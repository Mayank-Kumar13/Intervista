/**
 * Intervista Shared Typed Contract & Schemas
 * Task 3: AI Interview Engine & Performance Analytics
 * 
 * Freezes shared contracts for:
 * 1. Session state lifecycle
 * 2. Transcript event handling
 * 3. Rubric scoring criteria & weights
 * 4. Communication & behavioral analytics
 * 5. Knowledge gap and study plan models
 * 6. Report schema consumed by Dashboard and PDF generators
 */

// ─── 1. Interview Session States ─────────────────────────────────────────────
const INTERVIEW_STATES = Object.freeze({
  INTERVIEWER_SPEAKING: 'INTERVIEWER_SPEAKING', // Avatar speech active / lipsync playing
  CANDIDATE_LISTENING: 'CANDIDATE_LISTENING',   // Intermission or listening window
  CANDIDATE_SPEAKING: 'CANDIDATE_SPEAKING',     // Mic active, speech recognition streaming
  AI_PROCESSING: 'AI_PROCESSING',               // LLM / heuristic response or evaluation generation
  RECONNECTING: 'RECONNECTING',                 // Network jitter / socket reconnect
  COMPLETED: 'COMPLETED',                       // Session finalized, evaluation persisted
  FAILED: 'FAILED',                             // Terminal failure or unrecoverable error
});

// ─── 2. Configurable Rubric Criteria & Default Weights ────────────────────────
const RUBRIC_CRITERIA = Object.freeze({
  correctness: {
    id: 'correctness',
    label: 'Correctness & Relevance',
    weight: 0.25,
    description: 'Factual accuracy, addressal of the core question, and domain validity.',
  },
  technicalKnowledge: {
    id: 'technicalKnowledge',
    label: 'Technical Knowledge',
    weight: 0.25,
    description: 'Depth of engineering concepts, architecture, and system trade-offs.',
  },
  completeness: {
    id: 'completeness',
    label: 'Completeness',
    weight: 0.15,
    description: 'Coverage of edge cases, scalability, lifecycle, and failure modes.',
  },
  answerStructure: {
    id: 'answerStructure',
    label: 'Answer Structure',
    weight: 0.15,
    description: 'Logical organization (e.g., STAR framework, top-down architecture).',
  },
  useOfExamples: {
    id: 'useOfExamples',
    label: 'Use of Examples',
    weight: 0.10,
    description: 'Concrete past projects, metrics, numbers, and practical trade-offs.',
  },
  clarityConciseness: {
    id: 'clarityConciseness',
    label: 'Clarity & Conciseness',
    weight: 0.10,
    description: 'Pacing, brevity, precision of vocabulary, avoiding wandering filler.',
  },
});

// ─── 3. Knowledge Gap Priority Levels ─────────────────────────────────────────
const GAP_PRIORITY = Object.freeze({
  HIGH: 'High',       // Core prerequisite directly impacting hiring bar
  MEDIUM: 'Medium',   // Valuable domain competency recommended for level
  LOW: 'Low',         // Supplemental optimization or advanced nuance
});

// ─── 4. JSON Schema for Full Evaluation Output ────────────────────────────────
const EVALUATION_REPORT_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'IntervistaInterviewEvaluationReport',
  type: 'object',
  required: [
    'sessionId',
    'role',
    'company',
    'level',
    'overallScore',
    'scores',
    'rubricScores',
    'questionFeedback',
    'communicationMetrics',
    'knowledgeGaps',
    'studyPlan',
    'strengths',
    'improvements',
    'summary',
  ],
  properties: {
    sessionId: { type: 'string' },
    role: { type: 'string' },
    company: { type: 'string' },
    level: { type: 'string' },
    interviewType: { type: 'string' },
    difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
    durationSeconds: { type: 'integer', minimum: 0 },
    overallScore: { type: 'integer', minimum: 0, maximum: 100 },
    scores: {
      type: 'object',
      required: ['communication', 'technicalDepth', 'problemSolving', 'confidence'],
      properties: {
        communication: { type: 'integer', minimum: 0, maximum: 100 },
        technicalDepth: { type: 'integer', minimum: 0, maximum: 100 },
        problemSolving: { type: 'integer', minimum: 0, maximum: 100 },
        confidence: { type: 'integer', minimum: 0, maximum: 100 },
      },
    },
    rubricScores: {
      type: 'array',
      items: {
        type: 'object',
        required: ['criterionId', 'label', 'weight', 'score', 'evidenceQuotes'],
        properties: {
          criterionId: { type: 'string' },
          label: { type: 'string' },
          weight: { type: 'number', minimum: 0, maximum: 1 },
          score: { type: 'integer', minimum: 0, maximum: 100 },
          evidenceQuotes: {
            type: 'array',
            items: { type: 'string' },
          },
          rationale: { type: 'string' },
        },
      },
    },
    questionFeedback: {
      type: 'array',
      items: {
        type: 'object',
        required: ['questionId', 'questionText', 'candidateAnswer', 'score', 'feedback', 'evidenceQuotes'],
        properties: {
          questionId: { type: 'string' },
          questionIndex: { type: 'integer' },
          questionText: { type: 'string' },
          candidateAnswer: { type: 'string' },
          score: { type: 'integer', minimum: 0, maximum: 100 },
          feedback: { type: 'string' },
          testedConcepts: { type: 'array', items: { type: 'string' } },
          evidenceQuotes: { type: 'array', items: { type: 'string' } },
          evaluatedAt: { type: 'integer' },
        },
      },
    },
    communicationMetrics: {
      type: 'object',
      required: ['speakingRateWpm', 'fillerWordCount', 'fillerDetails', 'pauseDurationCount', 'responseLatencyMs'],
      properties: {
        speakingRateWpm: { type: 'number' },
        paceAssessment: { type: 'string' },
        fillerWordCount: { type: 'integer', minimum: 0 },
        fillerDetails: { type: 'object' },
        fillerRatioPercent: { type: 'number' },
        pauseDurationCount: { type: 'integer', minimum: 0 }, // Pauses > 3s
        responseLatencyMs: { type: 'integer', minimum: 0 },
        verbalRestartsCount: { type: 'integer', minimum: 0 },
        clarityScore: { type: 'integer', minimum: 0, maximum: 100 },
        suggestions: { type: 'array', items: { type: 'string' } },
      },
    },
    visualObservations: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        faceVisibilityPercent: { type: 'number', minimum: 0, maximum: 100 },
        framingStatus: { type: 'string' },
        headOrientationStatus: { type: 'string' },
        neutralObservationNote: { type: 'string' },
      },
    },
    knowledgeGaps: {
      type: 'array',
      items: {
        type: 'object',
        required: ['questionId', 'testedConcepts', 'demonstratedWeaknesses', 'untestedTopics', 'priority', 'studyRecommendation'],
        properties: {
          questionId: { type: 'string' },
          testedConcepts: { type: 'array', items: { type: 'string' } },
          demonstratedWeaknesses: { type: 'array', items: { type: 'string' } },
          untestedTopics: { type: 'array', items: { type: 'string' } },
          priority: { type: 'string', enum: ['High', 'Medium', 'Low'] },
          studyRecommendation: { type: 'string' },
        },
      },
    },
    studyPlan: {
      type: 'array',
      items: {
        type: 'object',
        required: ['topic', 'priority', 'recommendedResources', 'practiceExercises', 'followUpInterviewQuestions'],
        properties: {
          topic: { type: 'string' },
          priority: { type: 'string', enum: ['High', 'Medium', 'Low'] },
          recommendedResources: { type: 'array', items: { type: 'string' } },
          practiceExercises: { type: 'array', items: { type: 'string' } },
          followUpInterviewQuestions: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    strengths: { type: 'array', items: { type: 'string' } },
    improvements: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
    isDemoMode: { type: 'boolean' },
    createdAt: { type: 'string' },
  },
};

// ─── 5. Validator Function for Structured Output ──────────────────────────────
function validateEvaluationReport(report) {
  const errors = [];
  if (!report || typeof report !== 'object') {
    return { valid: false, errors: ['Report must be a non-null object'] };
  }

  // Required top-level fields
  const requiredFields = [
    'sessionId',
    'role',
    'level',
    'overallScore',
    'scores',
    'rubricScores',
    'questionFeedback',
    'communicationMetrics',
    'knowledgeGaps',
    'studyPlan',
    'strengths',
    'improvements',
    'summary',
  ];

  for (const field of requiredFields) {
    if (report[field] === undefined || report[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Score boundaries (0 - 100)
  if (typeof report.overallScore !== 'number' || report.overallScore < 0 || report.overallScore > 100) {
    errors.push(`overallScore must be a number between 0 and 100 (got: ${report.overallScore})`);
  }

  if (report.scores) {
    for (const key of ['communication', 'technicalDepth', 'problemSolving', 'confidence']) {
      const s = report.scores[key];
      if (typeof s !== 'number' || s < 0 || s > 100) {
        errors.push(`scores.${key} must be a number between 0 and 100 (got: ${s})`);
      }
    }
  }

  // Rubric scores validation: evidence quotes must be present if scored
  if (Array.isArray(report.rubricScores)) {
    for (const item of report.rubricScores) {
      if (!item.criterionId || typeof item.score !== 'number' || item.score < 0 || item.score > 100) {
        errors.push(`Invalid rubric score item for ${item.criterionId}`);
      }
      if (!Array.isArray(item.evidenceQuotes)) {
        errors.push(`Rubric criterion ${item.criterionId} missing evidenceQuotes array`);
      }
    }
  }

  // Question evaluations validation
  if (Array.isArray(report.questionFeedback)) {
    for (let i = 0; i < report.questionFeedback.length; i++) {
      const q = report.questionFeedback[i];
      if (!q.questionText) {
        errors.push(`Question feedback item #${i + 1} missing questionText`);
      }
      if (typeof q.score !== 'number' || q.score < 0 || q.score > 100) {
        errors.push(`Question feedback item #${i + 1} score must be 0-100`);
      }
    }
  }

  // Knowledge gaps validation: check priority
  if (Array.isArray(report.knowledgeGaps)) {
    for (const gap of report.knowledgeGaps) {
      if (!['High', 'Medium', 'Low'].includes(gap.priority)) {
        errors.push(`Knowledge gap priority must be 'High', 'Medium', or 'Low' (got: ${gap.priority})`);
      }
      if (!Array.isArray(gap.testedConcepts) || !Array.isArray(gap.demonstratedWeaknesses)) {
        errors.push(`Knowledge gap missing testedConcepts or demonstratedWeaknesses array`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  INTERVIEW_STATES,
  RUBRIC_CRITERIA,
  GAP_PRIORITY,
  EVALUATION_REPORT_SCHEMA,
  validateEvaluationReport,
};
