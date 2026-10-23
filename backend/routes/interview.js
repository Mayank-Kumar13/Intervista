/**
 * Interview Routes
 * Task 3: Real-Time AI Interviewer, Transcript Persistence, and Performance Analytics
 * 
 * Integrated with the unified MongoDB Atlas system (via Mongoose Interview model)
 * with robust in-memory fallback for offline/disconnected operation.
 */

const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const { isDBConnected } = require('../db');
const Interview = require('../models/Interview');
const {
  INTERVIEW_STATES,
  RUBRIC_CRITERIA,
  EVALUATION_REPORT_SCHEMA,
  validateEvaluationReport,
} = require('../shared/interviewContract');
const {
  startSession,
  generateFollowUp,
  evaluateSession,
  isModelConfigured,
} = require('../services/aiInterviewEngine');

const router = express.Router();

// In-memory session store when database is in demo/offline mode
const memoryStore = new Map();

function generateSessionId() {
  return 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── GET /api/interview/schema ────────────────────────────────────────────────
// Exposes shared contract and schemas to clients and teammates
router.get('/schema', (req, res) => {
  res.json({
    states: INTERVIEW_STATES,
    rubricCriteria: RUBRIC_CRITERIA,
    evaluationReportSchema: EVALUATION_REPORT_SCHEMA,
    isModelConfigured: isModelConfigured(),
  });
});

// ─── POST /api/interview/start ────────────────────────────────────────────────
// Starts interview session, saves record, returns first question
router.post('/start', optionalAuth, async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user.userId || 'guest_user') : 'guest_user';
    const {
      role = 'Software Engineer',
      company = 'Google',
      interviewType = 'Technical Interview',
      experience = 'Mid Level',
      duration = 30,
      focusTopic = null,
      interviewerName = 'Mr. J. Chen',
      interviewerPersona = 'chen',
    } = req.body;

    const sessionId = generateSessionId();

    // 1. Initialize conversational session
    const sessionInit = await startSession({
      role,
      company,
      interviewType,
      experience,
      duration,
      focusTopic,
      interviewerName,
    });

    const q1 = sessionInit.currentQuestion;
    const initialQuestions = [
      {
        id: q1.id,
        index: 1,
        category: q1.category,
        questionText: q1.questionText,
        testedConcepts: q1.testedConcepts || [],
        expectedCompetencies: q1.expectedCompetencies || [],
        difficulty: q1.difficulty || 'Medium',
      },
    ];

    const initialTranscript = [
      {
        id: 'msg_' + Date.now().toString(36) + '1',
        sender: 'interviewer',
        content: sessionInit.message,
        timestamp: Date.now(),
        questionId: q1.id,
        latencyMs: 0,
        audioDurationMs: 0,
      },
    ];

    const sessionData = {
      sessionId,
      userId,
      role,
      company,
      interviewType,
      experienceLevel: experience,
      difficulty: 'Medium',
      durationMinutes: parseInt(duration) || 30,
      focusTopic,
      interviewerPersona,
      interviewerName,
      status: 'active',
      questions: initialQuestions,
      transcript: initialTranscript,
      plannedQuestions: sessionInit.plannedQuestions,
      createdAt: new Date(),
    };

    // Store in memory
    memoryStore.set(sessionId, sessionData);

    // If MongoDB Atlas is connected, persist to DB asynchronously
    if (isDBConnected()) {
      try {
        await Interview.create(sessionData);
      } catch (dbErr) {
        console.warn('[interview start db save warning]', dbErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      sessionId,
      message: sessionInit.message,
      currentQuestion: sessionInit.currentQuestion,
      isDemoMode: sessionInit.isDemoMode,
      state: INTERVIEW_STATES.CANDIDATE_LISTENING,
    });
  } catch (err) {
    console.error('[interview start error]', err);
    return res.status(500).json({ error: 'Failed to start interview session.', details: err.message });
  }
});

// ─── POST /api/interview/:id/message ──────────────────────────────────────────
// Receives candidate answer, logs transcript, produces dynamic follow-up
router.post('/:id/message', optionalAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const {
      content,
      latencyMs = 1200,
      audioDurationMs = null,
      questionId = null,
      questionIndex = 1,
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    // Retrieve session from memory or DB
    let session = memoryStore.get(sessionId);
    if (!session && isDBConnected()) {
      session = await Interview.findOne({ sessionId });
    }

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    // 1. Log candidate answer into transcript
    const candidateMsg = {
      id: 'msg_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      sender: 'candidate',
      content: content.trim(),
      timestamp: Date.now(),
      questionId,
      latencyMs: parseInt(latencyMs) || 1200,
      audioDurationMs: parseInt(audioDurationMs) || Math.round((content.trim().split(/\s+/).length / 135) * 60000),
    };

    if (Array.isArray(session.transcript)) {
      session.transcript.push(candidateMsg);
    } else {
      session.transcript = [candidateMsg];
    }

    // 2. Fetch context
    const questions = session.questions || [];
    const latestQuestion = questions[questions.length - 1] || {
      id: questionId || 'q_1',
      questionText: 'Describe your technical design.',
      testedConcepts: ['System Design'],
      category: 'System Design',
    };

    // 3. Generate adaptive follow-up
    const followUpResult = await generateFollowUp({
      role: session.role,
      company: session.company,
      currentQuestion: {
        id: latestQuestion.id,
        questionText: latestQuestion.questionText,
        testedConcepts: latestQuestion.testedConcepts || [],
      },
      candidateAnswer: content.trim(),
      questionIndex,
      totalQuestions: 4,
      plannedQuestions: session.plannedQuestions || [],
    });

    // 4. If next primary question, append to questions list
    let activeQuestionId = latestQuestion.id;
    if (followUpResult.nextQuestion) {
      const nq = followUpResult.nextQuestion;
      activeQuestionId = nq.id;
      session.questions.push({
        id: nq.id,
        index: nq.index || questionIndex + 1,
        category: nq.category || 'Technical',
        questionText: nq.questionText,
        testedConcepts: nq.testedConcepts || [],
        difficulty: nq.difficulty || 'Medium',
      });
    }

    // 5. Append interviewer reply to transcript
    const interviewerMsg = {
      id: 'msg_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      sender: 'interviewer',
      content: followUpResult.message,
      timestamp: Date.now(),
      questionId: activeQuestionId,
    };
    session.transcript.push(interviewerMsg);

    // Update memory
    memoryStore.set(sessionId, session);

    // Update DB if connected
    if (isDBConnected()) {
      try {
        await Interview.updateOne(
          { sessionId },
          {
            $push: {
              transcript: { $each: [candidateMsg, interviewerMsg] },
              ...(followUpResult.nextQuestion ? { questions: session.questions[session.questions.length - 1] } : {}),
            },
          }
        );
      } catch (dbErr) {
        console.warn('[interview message db update warning]', dbErr.message);
      }
    }

    return res.json({
      success: true,
      message: followUpResult.message,
      isFollowUp: !!followUpResult.isFollowUp,
      difficulty: followUpResult.difficulty || 'Medium',
      testedConcepts: followUpResult.testedConcepts || [],
      nextQuestion: followUpResult.nextQuestion || null,
      state: INTERVIEW_STATES.INTERVIEWER_SPEAKING,
    });
  } catch (err) {
    console.error('[interview message error]', err);
    return res.status(500).json({ error: 'Failed to process message.', details: err.message });
  }
});

// ─── POST /api/interview/:id/end ──────────────────────────────────────────────
// Concludes session, evaluates transcript, stores validated evaluation report
router.post('/:id/end', optionalAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const {
      durationSeconds = 0,
      visualObservations = null,
      audioTelemetry = null,
      verbalDelivery = null,
      multimodalTelemetry = null,
    } = req.body || {};

    let session = memoryStore.get(sessionId);
    if (!session && isDBConnected()) {
      session = await Interview.findOne({ sessionId });
    }

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    const questions = session.questions || [];
    const candidateMessages = (session.transcript || []).filter(m => m.sender === 'candidate');

    const effectiveVisual = visualObservations || multimodalTelemetry?.visual;
    const effectiveAudio = audioTelemetry || verbalDelivery || multimodalTelemetry?.audio;

    // Generate comprehensive rubric evaluation and analytics
    const report = await evaluateSession({
      sessionId,
      role: session.role,
      company: session.company,
      level: session.experienceLevel,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      durationSeconds: durationSeconds || Math.round(candidateMessages.length * 80),
      questions,
      candidateMessages,
      rawVisualTelemetry: effectiveVisual,
      rawAudioTelemetry: effectiveAudio,
    });

    // Validate structured model output before saving
    const validation = validateEvaluationReport(report);
    if (!validation.valid) {
      console.warn('[evaluation validation warnings]', validation.errors);
    }

    // Update in-memory session
    session.status = 'completed';
    session.endedAt = new Date();
    session.evaluation = report;
    memoryStore.set(sessionId, session);

    // Update MongoDB Atlas if connected
    if (isDBConnected()) {
      try {
        await Interview.updateOne(
          { sessionId },
          {
            $set: {
              status: 'completed',
              endedAt: new Date(),
              evaluation: report,
            },
          }
        );
      } catch (dbErr) {
        console.warn('[interview end db update warning]', dbErr.message);
      }
    }

    return res.json(report);
  } catch (err) {
    console.error('[interview end error]', err);
    return res.status(500).json({ error: 'Failed to evaluate interview.', details: err.message });
  }
});

// ─── GET /api/interview/sessions ──────────────────────────────────────────────
// Returns past mock interview sessions for current user or guest
router.get('/sessions', optionalAuth, async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user.userId || 'guest_user') : 'guest_user';

    let sessions = [];

    // Check DB first if connected
    if (isDBConnected()) {
      try {
        const dbSessions = await Interview.find({ userId }).sort({ createdAt: -1 }).limit(20);
        sessions = dbSessions.map(s => s.toDashboardSummary());
      } catch (dbErr) {
        console.warn('[sessions db query warning]', dbErr.message);
      }
    }

    // If DB returned nothing or is offline, check memory store
    if (sessions.length === 0) {
      for (const s of memoryStore.values()) {
        if (s.userId === userId || userId === 'guest_user') {
          const evalData = s.evaluation || {};
          sessions.push({
            id: s.sessionId,
            company: s.company || 'Google',
            role: s.role,
            score: evalData.overallScore || 84,
            date: s.createdAt
              ? new Date(s.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Recent',
            status: s.status,
            details: {
              scores: evalData.scores || { communication: 86, technicalDepth: 84, problemSolving: 82, confidence: 80 },
              strengths: evalData.strengths || [],
              improvements: evalData.improvements || [],
              rubricScores: evalData.rubricScores || [],
            },
          });
        }
      }
    }

    return res.json({ success: true, sessions });
  } catch (err) {
    console.error('[interview sessions error]', err);
    return res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
});

// ─── GET /api/interview/report/:id ────────────────────────────────────────────
// Retrieves saved evaluation report by session ID
router.get('/report/:id', optionalAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;

    // Check memory store
    const memSession = memoryStore.get(sessionId);
    if (memSession && memSession.evaluation) {
      return res.json(memSession.evaluation);
    }

    // Check DB if connected
    if (isDBConnected()) {
      const dbSession = await Interview.findOne({ sessionId });
      if (dbSession && dbSession.evaluation && dbSession.evaluation.overallScore !== undefined) {
        return res.json(dbSession.evaluation);
      }
    }

    return res.status(404).json({ error: 'Report not found for this interview.' });
  } catch (err) {
    console.error('[interview report error]', err);
    return res.status(500).json({ error: 'Failed to fetch report.' });
  }
});

module.exports = router;
