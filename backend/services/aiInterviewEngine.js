/**
 * AI Interview Service
 * Task 3: Secure Session Integration, Real-Time AI Interviewer, and Adaptive Dialogue
 * 
 * Capabilities:
 * 1. Checks server-side environment for GEMINI_API_KEY.
 * 2. If present, connects to Gemini Generative AI for real-time natural dialogue.
 * 3. If missing or offline, uses our intelligent rule-based adaptive engine (zero crashes, full demo-mode fidelity).
 * 4. Never exposes permanent API keys to the frontend.
 * 5. Adapts question difficulty and asks targeted follow-ups.
 */

const { getQuestionsForSession } = require('./questionBank');
const { evaluateInterviewSession } = require('./rubricEvaluator');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/**
 * Checks if a live AI model is configured.
 */
function isModelConfigured() {
  return !!GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 10;
}

/**
 * Initiates an interview session:
 * Selects role questions and formulates the natural opening prompt.
 */
async function startSession({
  role = 'Software Engineer',
  company = 'Google',
  interviewType = 'Technical Interview',
  experience = 'Mid Level',
  difficulty = 'Medium',
  duration = 30,
  focusTopic = null,
  interviewerName = 'Mr. J. Chen',
}) {
  const isDemo = !isModelConfigured();
  const sessionQuestions = getQuestionsForSession({
    role,
    interviewType,
    experience,
    count: 4,
  });

  const firstQ = sessionQuestions[0];
  const openingGreeting = `Hello! Welcome to your ${role} interview at ${company}. I'm ${interviewerName}, and I'll be conducting your technical interview today.`;
  const openingQuestion = firstQ.questionText;
  const fullOpeningMessage = `${openingGreeting}\n\nTo begin: ${openingQuestion}`;

  return {
    isDemoMode: isDemo,
    message: fullOpeningMessage,
    currentQuestion: {
      id: firstQ.id,
      index: 1,
      category: firstQ.category,
      questionText: firstQ.questionText,
      testedConcepts: firstQ.testedConcepts,
      difficulty: firstQ.difficulty || difficulty,
    },
    plannedQuestions: sessionQuestions,
  };
}

/**
 * Generates an adaptive response or follow-up question based on candidate reply.
 */
/**
 * Generates an adaptive response or follow-up question based on candidate reply.
 */
async function generateFollowUp({
  role = 'Software Engineer',
  company = 'Google',
  interviewType = 'Technical Interview',
  experience = 'Mid Level',
  interviewerName = 'Mr. J. Chen',
  candidateName = null,
  resumeData = null,
  currentQuestion,
  candidateAnswer,
  questionIndex = 1,
  totalQuestions = 4,
  previousMessages = [],
  plannedQuestions = [],
}) {
  const answer = (candidateAnswer || '').trim();
  const lowerAnswer = answer.toLowerCase();

  // Try live Gemini API if key is present
  if (isModelConfigured()) {
    try {
      const liveReply = await callGeminiDialogue({
        role,
        company,
        interviewType,
        experience,
        interviewerName,
        candidateName,
        resumeData,
        currentQuestionText: currentQuestion?.questionText || '',
        candidateAnswer: answer,
        questionIndex,
      });

      if (liveReply && liveReply.trim().length > 15) {
        return {
          isDemoMode: false,
          message: liveReply,
          isFollowUp: true,
          difficulty: 'Medium',
          testedConcepts: currentQuestion?.testedConcepts || ['System Architecture'],
        };
      }
    } catch (err) {
      console.warn('[aiInterviewEngine] Gemini live call failed, falling back to adaptive engine:', err.message);
    }
  }

  // ─── Adaptive Fallback Heuristic Engine ─────────────────────────────────────
  // Check if candidate provided an in-depth answer vs brief
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const isShallow = wordCount < 30;

  // 1. Check if current question has custom adaptive follow-up probes
  if (currentQuestion && Array.isArray(currentQuestion.adaptiveFollowUps) && currentQuestion.adaptiveFollowUps.length > 0) {
    const probes = currentQuestion.adaptiveFollowUps;
    let selectedProbe = null;

    if (isShallow) {
      selectedProbe = probes.find(p => p.trigger === 'shallow') || probes[0];
    } else {
      // Find probe matching candidate keywords
      selectedProbe = probes.find(p => p.trigger !== 'shallow' && lowerAnswer.includes(p.trigger)) || probes[0];
    }

    if (selectedProbe && questionIndex % 2 === 1) {
      // Ask adaptive follow-up on odd rounds
      const prefix = isShallow
        ? 'Understood. To help evaluate the practical depth of your design:'
        : 'That is a very clear approach. Now, let us explore this deeper:';

      return {
        isDemoMode: true,
        message: `${prefix} ${selectedProbe.question}`,
        isFollowUp: true,
        difficulty: isShallow ? 'Medium' : 'Hard',
        testedConcepts: selectedProbe.testedConcepts || currentQuestion.testedConcepts,
      };
    }
  }

  // 2. Advance to Next Primary Question from planned list
  const nextQIndex = Math.min(questionIndex, plannedQuestions.length - 1);
  const nextQuestion = plannedQuestions[nextQIndex] || {
    id: `q_${questionIndex + 1}`,
    questionText: `Looking at system trade-offs more broadly, how would you approach end-to-end monitoring and automated rollback for that deployment?`,
    category: 'Production Operations & Reliability',
    testedConcepts: ['Canary Deployments', 'Automated Health Checks', 'Rollback Triggers'],
  };

  const acknowledgments = [
    "Thank you for that thorough explanation. That addresses the core design.",
    "Appreciate the concrete breakdown of the architectural trade-offs.",
    "Great insights into the operational considerations.",
    "Understood. Moving forward in our discussion:",
  ];
  const ack = acknowledgments[questionIndex % acknowledgments.length];

  return {
    isDemoMode: true,
    message: `${ack} Now, let's explore this: ${nextQuestion.questionText}`,
    isFollowUp: false,
    nextQuestion: {
      id: nextQuestion.id,
      index: questionIndex + 1,
      category: nextQuestion.category,
      questionText: nextQuestion.questionText,
      testedConcepts: nextQuestion.testedConcepts,
      difficulty: nextQuestion.difficulty || 'Medium',
    },
    difficulty: nextQuestion.difficulty || 'Medium',
    testedConcepts: nextQuestion.testedConcepts,
  };
}

/**
 * Calls Gemini 1.5 Flash securely via server-side HTTP request.
 */
async function callGeminiDialogue({
  role,
  company,
  interviewType = 'Technical Interview',
  experience = 'Mid Level',
  interviewerName = 'Mr. J. Chen',
  candidateName = null,
  resumeData = null,
  currentQuestionText,
  candidateAnswer,
  questionIndex,
}) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `You are a real senior interviewer (${interviewerName}) conducting a live face-to-face ${interviewType} for a ${experience} ${role} role at ${company}.
${candidateName ? `Candidate's name: ${candidateName}.` : ''}
${resumeData ? `Candidate's resume/skills context: ${typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData)}` : ''}
The candidate was asked: "${currentQuestionText}".
The candidate answered: "${candidateAnswer}".

Your instructions:
1. Act like a real human interviewer speaking aloud across the desk.
2. In 1 sentence, acknowledge or validate a specific technical or conceptual point they just made.
3. Immediately ask ONE natural, targeted follow-up question or advance to the next technical probe. If their answer asked for clarification, answer it directly and ask them to proceed. If their answer was brief, ask for a concrete real-world example.
4. Keep the entire response under 3 sentences so it can be spoken naturally out loud.
5. Do NOT include greetings like "Hello", markdown asterisks, or bullet points. Output only the spoken words directly.`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 160,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return candidateText ? candidateText.replace(/[*#_]/g, '').trim() : null;
}

/**
 * Concludes session and evaluates performance.
 */
async function evaluateSession({
  sessionId,
  role,
  company,
  level,
  interviewType,
  difficulty,
  durationSeconds,
  questions,
  candidateMessages,
  rawVisualTelemetry,
  rawAudioTelemetry,
}) {
  const isDemo = !isModelConfigured();

  const report = evaluateInterviewSession({
    sessionId,
    role,
    company,
    level,
    interviewType,
    difficulty,
    durationSeconds,
    questions,
    candidateMessages,
    rawVisualTelemetry,
    rawAudioTelemetry,
    isDemoMode: isDemo,
  });

  return report;
}

module.exports = {
  isModelConfigured,
  startSession,
  generateFollowUp,
  evaluateSession,
};
