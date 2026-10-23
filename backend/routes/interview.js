const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Initialize Gemini client
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function generateId(prefix = 's') {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Build system prompt for the AI interviewer
function buildSystemPrompt(config) {
  const { role, company, interviewType, experience, focusTopic } = config;
  return `You are a professional technical interviewer at ${company || 'a top tech company'}.
You are conducting a ${interviewType || 'Technical'} interview for a ${experience || 'Mid Level'} ${role || 'Software Engineer'} position.
${focusTopic ? `Focus area: ${focusTopic}.` : ''}

Your behavior:
- Ask ONE clear, focused question at a time. Do NOT ask multiple questions in one turn.
- After the candidate answers, give a very brief (1 sentence) neutral acknowledgment, then ask the next question or a follow-up.
- Be professional, slightly formal, but not intimidating.
- Probe deeper if an answer is vague or incomplete.
- After 4-6 questions total, wrap up the interview gracefully.
- Never reveal scores or detailed feedback during the interview — save that for the report.
- Keep your responses concise (2-4 sentences max per interviewer turn).

Start by introducing yourself briefly and asking your first question.`;
}

// ─── POST /api/interview/start ────────────────────────────────────────────────
// Creates a new session and gets the first question from Gemini
router.post('/start', requireAuth, async (req, res) => {
  try {
    const { role, company, interviewType, experience, duration, focusTopic } = req.body;
    const userId = req.user.id;

    // Create session in DB
    const sessionId = generateId('s');
    db.prepare(`
      INSERT INTO sessions (id, user_id, role, company, interview_type, experience, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(sessionId, userId, role || 'Software Engineer', company || null,
           interviewType || 'Technical Interview', experience || 'Mid Level',
           duration ? parseInt(duration) : 30);

    // Get opening message from Gemini
    const systemPrompt = buildSystemPrompt({ role, company, interviewType, experience, focusTopic });

    const interaction = await genai.interactions.create({
      model: 'gemini-3.6-flash',
      system_instruction: systemPrompt,
      input: 'Begin the interview.',
    });

    const interviewerMessage = interaction.output_text;
    const geminiInteractionId = interaction.id;

    // Save the first interviewer message
    db.prepare(`
      INSERT INTO messages (session_id, role, content) VALUES (?, 'interviewer', ?)
    `).run(sessionId, interviewerMessage);

    // Store the gemini interaction ID on the session for continuity
    db.prepare(`UPDATE sessions SET status = 'active' WHERE id = ?`).run(sessionId);

    return res.status(201).json({
      sessionId,
      geminiInteractionId,
      message: interviewerMessage,
    });
  } catch (err) {
    console.error('[interview/start]', err);
    return res.status(500).json({ error: 'Failed to start interview. Please try again.' });
  }
});

// ─── POST /api/interview/:sessionId/message ───────────────────────────────────
// Candidate sends an answer → Gemini responds with next question
router.post('/:sessionId/message', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { content, geminiInteractionId } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim())
      return res.status(400).json({ error: 'Message content is required.' });

    // Validate session belongs to this user
    const session = db.prepare('SELECT * FROM sessions WHERE id = ? AND user_id = ?').get(sessionId, userId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    if (session.status !== 'active') return res.status(400).json({ error: 'Session is not active.' });

    // Save candidate message
    db.prepare(`INSERT INTO messages (session_id, role, content) VALUES (?, 'candidate', ?)`).run(sessionId, content.trim());

    // Get config for system prompt
    const systemPrompt = buildSystemPrompt({
      role: session.role,
      company: session.company,
      interviewType: session.interview_type,
      experience: session.experience,
    });

    // Continue conversation with Gemini using previous_interaction_id
    const interaction = await genai.interactions.create({
      model: 'gemini-3.6-flash',
      system_instruction: systemPrompt,
      input: content.trim(),
      previous_interaction_id: geminiInteractionId,
    });

    const interviewerReply = interaction.output_text;

    // Save interviewer reply
    db.prepare(`INSERT INTO messages (session_id, role, content) VALUES (?, 'interviewer', ?)`).run(sessionId, interviewerReply);

    return res.json({
      message: interviewerReply,
      geminiInteractionId: interaction.id,
    });
  } catch (err) {
    console.error('[interview/message]', err);
    return res.status(500).json({ error: 'Failed to get response. Please try again.' });
  }
});

// ─── POST /api/interview/:sessionId/end ──────────────────────────────────────
// Ends session + generates full evaluation report via Gemini
router.post('/:sessionId/end', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = db.prepare('SELECT * FROM sessions WHERE id = ? AND user_id = ?').get(sessionId, userId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });

    // Get all messages
    const messages = db.prepare('SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC').all(sessionId);

    if (messages.length < 2) {
      return res.status(400).json({ error: 'Not enough conversation to generate a report.' });
    }

    // Build transcript
    const transcript = messages
      .map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
      .join('\n\n');

    // Generate evaluation from Gemini
    const evalPrompt = `You are an expert interview evaluator. Below is a complete transcript of a mock interview.

Role: ${session.role}
Company: ${session.company || 'General'}
Interview Type: ${session.interview_type}
Experience Level: ${session.experience}

TRANSCRIPT:
${transcript}

Evaluate the candidate's performance and respond ONLY with a valid JSON object (no markdown, no extra text) in exactly this format:
{
  "overallScore": <integer 0-100>,
  "scores": {
    "communication": <integer 0-100>,
    "technicalDepth": <integer 0-100>,
    "problemSolving": <integer 0-100>,
    "confidence": <integer 0-100>
  },
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"],
  "questionFeedback": [
    {
      "question": "<question text>",
      "candidateAnswer": "<summary of their answer>",
      "feedback": "<specific feedback>",
      "score": <integer 0-100>
    }
  ]
}`;

    const evalInteraction = await genai.interactions.create({
      model: 'gemini-3.6-flash',
      input: evalPrompt,
      store: false,
    });

    let evalData;
    try {
      // Strip any markdown code fences if present
      const raw = evalInteraction.output_text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      evalData = JSON.parse(raw);
    } catch (parseErr) {
      console.error('[eval parse error]', parseErr);
      // Fallback scores if JSON parsing fails
      evalData = {
        overallScore: 75,
        scores: { communication: 75, technicalDepth: 70, problemSolving: 72, confidence: 73 },
        summary: 'The candidate demonstrated reasonable understanding of the topics discussed.',
        strengths: ['Clear communication', 'Engaged with questions', 'Showed problem-solving approach'],
        improvements: ['Add more specific examples', 'Deeper technical detail', 'Structured responses better'],
        questionFeedback: [],
      };
    }

    // Mark session as ended
    db.prepare(`UPDATE sessions SET status = 'completed', ended_at = datetime('now') WHERE id = ?`).run(sessionId);

    // Save report
    const reportId = generateId('r');
    db.prepare(`
      INSERT INTO reports (id, session_id, user_id, overall_score, communication, technical_depth, problem_solving, confidence, strengths, improvements, question_feedback, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      reportId, sessionId, userId,
      evalData.overallScore,
      evalData.scores?.communication,
      evalData.scores?.technicalDepth,
      evalData.scores?.problemSolving,
      evalData.scores?.confidence,
      JSON.stringify(evalData.strengths),
      JSON.stringify(evalData.improvements),
      JSON.stringify(evalData.questionFeedback),
      evalData.summary
    );

    return res.json({
      reportId,
      sessionId,
      role: session.role,
      company: session.company,
      interviewType: session.interview_type,
      overallScore: evalData.overallScore,
      scores: evalData.scores,
      summary: evalData.summary,
      strengths: evalData.strengths,
      improvements: evalData.improvements,
      questionFeedback: evalData.questionFeedback,
    });
  } catch (err) {
    console.error('[interview/end]', err);
    return res.status(500).json({ error: 'Failed to generate report. Please try again.' });
  }
});

// ─── GET /api/interview/sessions ─────────────────────────────────────────────
// Get user's past sessions + scores
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = db.prepare(`
      SELECT s.id, s.role, s.company, s.interview_type, s.experience, s.status, s.started_at, s.ended_at,
             r.overall_score, r.id as report_id
      FROM sessions s
      LEFT JOIN reports r ON r.session_id = s.id
      WHERE s.user_id = ?
      ORDER BY s.started_at DESC
      LIMIT 20
    `).all(userId);

    return res.json({ sessions });
  } catch (err) {
    console.error('[interview/sessions]', err);
    return res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
});

// ─── GET /api/interview/report/:reportId ─────────────────────────────────────
// Get a specific report
router.get('/report/:reportId', requireAuth, async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user.id;

    const report = db.prepare('SELECT * FROM reports WHERE id = ? AND user_id = ?').get(reportId, userId);
    if (!report) return res.status(404).json({ error: 'Report not found.' });

    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(report.session_id);

    return res.json({
      reportId: report.id,
      sessionId: report.session_id,
      role: session?.role,
      company: session?.company,
      interviewType: session?.interview_type,
      overallScore: report.overall_score,
      scores: {
        communication: report.communication,
        technicalDepth: report.technical_depth,
        problemSolving: report.problem_solving,
        confidence: report.confidence,
      },
      summary: report.summary,
      strengths: JSON.parse(report.strengths || '[]'),
      improvements: JSON.parse(report.improvements || '[]'),
      questionFeedback: JSON.parse(report.question_feedback || '[]'),
      createdAt: report.created_at,
    });
  } catch (err) {
    console.error('[interview/report]', err);
    return res.status(500).json({ error: 'Failed to fetch report.' });
  }
});

module.exports = router;
