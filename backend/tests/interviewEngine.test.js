/**
 * Interview Engine & Performance Analytics Test Suite
 * Task 3: Comprehensive automated tests for:
 * 1. Missing credentials handling
 * 2. Invalid outputs validation
 * 3. Incomplete transcripts handling
 * 4. Behavioral & communication analytics
 * 5. Knowledge gaps & study plan synthesis
 */

const assert = require('assert');
const {
  INTERVIEW_STATES,
  RUBRIC_CRITERIA,
  GAP_PRIORITY,
  validateEvaluationReport,
} = require('../shared/interviewContract');
const {
  isModelConfigured,
  startSession,
  generateFollowUp,
  evaluateSession,
} = require('../services/aiInterviewEngine');
const { analyzeCommunication } = require('../services/behavioralAnalytics');
const { analyzeKnowledgeGaps } = require('../services/knowledgeGapAnalyzer');
const { evaluateSingleQuestion } = require('../services/rubricEvaluator');

async function runTests() {
  console.log('🧪 Starting Intervista AI Interview Engine & Analytics Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${err.message}\n`);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${err.message}\n`);
      failed++;
    }
  }

  // ─── Test Group 1: Missing Credentials & Demo Fallback ────────────────────────
  console.log('--- Test Group 1: Missing Credentials & Demo Fallback ---');

  await testAsync('Handles missing API key gracefully without crashing', async () => {
    // When GEMINI_API_KEY is not set or empty
    const session = await startSession({
      role: 'Software Engineer',
      company: 'Stripe',
      experience: 'Senior',
    });

    assert.ok(session, 'Session must be returned');
    assert.strictEqual(session.isDemoMode, true, 'isDemoMode should be true when no API key is active');
    assert.ok(session.message.includes('Stripe'), 'Opening message should incorporate target company');
    assert.ok(session.currentQuestion.testedConcepts.length > 0, 'Should include role tested concepts');
  });

  await testAsync('Generates adaptive follow-up without external network reliance', async () => {
    const followUp = await generateFollowUp({
      role: 'Software Engineer',
      company: 'Netflix',
      currentQuestion: {
        id: 'q1',
        questionText: 'How do you handle high throughput caching?',
        testedConcepts: ['Cache Stampede', 'Redis'],
      },
      candidateAnswer: 'We used Redis with TTL and handled cache stampedes using distributed locks.',
      questionIndex: 1,
    });

    assert.ok(followUp.message, 'Follow-up message must not be empty');
    assert.strictEqual(followUp.isDemoMode, true);
  });

  // ─── Test Group 2: Output Validation & Schema Conformance ────────────────────
  console.log('\n--- Test Group 2: Output Validation & Schema Conformance ---');

  test('Rejects invalid report missing mandatory top-level fields', () => {
    const invalidReport = {
      role: 'Software Engineer',
      // missing overallScore, rubricScores, etc.
    };
    const res = validateEvaluationReport(invalidReport);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('Missing required field: overallScore')));
  });

  test('Rejects out-of-bounds scores (< 0 or > 100)', () => {
    const outOfBoundsReport = {
      sessionId: 's_test',
      role: 'Software Engineer',
      level: 'Mid Level',
      overallScore: 125, // Invalid!
      scores: { communication: 90, technicalDepth: 85, problemSolving: 80, confidence: 80 },
      rubricScores: [],
      questionFeedback: [],
      communicationMetrics: {},
      knowledgeGaps: [],
      studyPlan: [],
      strengths: [],
      improvements: [],
      summary: 'Test summary',
    };
    const res = validateEvaluationReport(outOfBoundsReport);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('overallScore must be a number between 0 and 100')));
  });

  test('Validates complete well-formed evaluation report with evidence', () => {
    const validReport = {
      sessionId: 's_valid_123',
      role: 'Software Engineer',
      level: 'Mid Level',
      overallScore: 84,
      scores: { communication: 86, technicalDepth: 84, problemSolving: 82, confidence: 84 },
      rubricScores: [
        {
          criterionId: 'correctness',
          label: 'Correctness & Relevance',
          weight: 0.25,
          score: 85,
          evidenceQuotes: ['We designed a distributed cache with Redis'],
        },
      ],
      questionFeedback: [
        {
          questionText: 'How did you scale the database?',
          score: 85,
        },
      ],
      communicationMetrics: {
        speakingRateWpm: 140,
        fillerWordCount: 2,
        fillerDetails: { like: 2 },
        fillerRatioPercent: 1.2,
        pauseDurationCount: 0,
        responseLatencyMs: 1200,
      },
      knowledgeGaps: [
        {
          questionId: 'q_1',
          testedConcepts: ['Database Indexing'],
          demonstratedWeaknesses: ['B-Tree Fill Factor'],
          untestedTopics: ['Partition Pruning'],
          priority: 'High',
          studyRecommendation: 'Review B-Tree internals in PostgreSQL',
        },
      ],
      studyPlan: [
        {
          topic: 'Database Indexing',
          priority: 'High',
          recommendedResources: ['PostgreSQL Documentation'],
          practiceExercises: ['Run EXPLAIN ANALYZE'],
          followUpInterviewQuestions: ['When does a query planner skip an index?'],
        },
      ],
      strengths: ['Clear architectural explanations'],
      improvements: ['State Big-O complexity upfront'],
      summary: 'Solid candidate demonstration.',
    };

    const res = validateEvaluationReport(validReport);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.errors.length, 0);
  });

  // ─── Test Group 3: Incomplete Transcripts & Abandoned Sessions ───────────────
  console.log('\n--- Test Group 3: Incomplete Transcripts & Abandoned Sessions ---');

  await testAsync('Handles session with zero candidate messages without division-by-zero or crash', async () => {
    const report = await evaluateSession({
      sessionId: 's_empty',
      role: 'Frontend Developer',
      company: 'Vercel',
      level: 'Senior',
      questions: [{ id: 'q1', questionText: 'How do you optimize INP?' }],
      candidateMessages: [], // Incomplete/abandoned!
    });

    assert.ok(report, 'Report should be returned');
    assert.strictEqual(report.overallScore, 0, 'Score should be 0 for abandoned interview');
    assert.ok(report.summary.includes('concluded without recorded candidate answers'));
    // Should not crash and all schema fields must be present
    assert.strictEqual(Array.isArray(report.rubricScores), true);
    assert.strictEqual(report.rubricScores.length, 6);
  });

  test('Does not invent scores for unanswered questions', () => {
    const evaluated = evaluateSingleQuestion({
      questionId: 'q_blank',
      questionIndex: 2,
      questionText: 'Describe how you scale message queues.',
      candidateAnswer: '   ', // empty
      testedConcepts: ['Kafka Partitioning', 'Consumer Groups'],
    });

    assert.strictEqual(evaluated.isEvaluated, false, 'Should be flagged as not evaluated');
    assert.strictEqual(evaluated.score, 0, 'Unanswered question should have score 0');
    assert.ok(evaluated.feedback.includes('too brief to evaluate'));
    assert.strictEqual(evaluated.evidenceQuotes.length, 0);
  });

  // ─── Test Group 4: Behavioral & Communication Analytics ─────────────────────
  console.log('\n--- Test Group 4: Behavioral & Communication Analytics ---');

  test('Accurately detects filler words and calculates speaking cadence', () => {
    const messages = [
      {
        content: 'Um, basically we decided to, like, use PostgreSQL read replicas because, you know, the traffic was high.',
        latencyMs: 1400,
        audioDurationMs: 6000,
      },
    ];

    const telemetry = analyzeCommunication(messages);
    assert.ok(telemetry.fillerWordCount >= 3, `Expected at least 3 fillers, got ${telemetry.fillerWordCount}`);
    assert.ok(telemetry.fillerDetails['um'] >= 1);
    assert.ok(telemetry.fillerDetails['like'] >= 1);
    assert.ok(telemetry.fillerDetails['basically'] >= 1);
    assert.ok(telemetry.speakingRateWpm > 0);
  });

  test('Enforces strictly neutral, non-diagnostic observable cues', () => {
    const visualTelemetry = {
      enabled: true,
      faceVisibilityPercent: 95,
      framing: 'Centered & Balanced',
      headOrientation: 'Direct Forward Alignment',
    };

    const comm = analyzeCommunication([], visualTelemetry);
    assert.strictEqual(comm.visualObservations.enabled, true);
    assert.strictEqual(comm.visualObservations.faceVisibilityPercent, 95);
    // Must not contain pseudoscientific assertions of stress or honesty
    const note = comm.visualObservations.neutralObservationNote.toLowerCase();
    assert.ok(!note.includes('stress'), 'Must not claim to diagnose stress');
    assert.ok(!note.includes('honest'), 'Must not claim to detect honesty');
    assert.ok(!note.includes('personality'), 'Must not claim to measure personality');
  });

  // ─── Test Group 5: Knowledge Gaps & Study Plan ──────────────────────────────
  console.log('\n--- Test Group 5: Knowledge Gaps & Study Plan ---');

  test('Correctly identifies missing concepts and assigns evidence-based priority', () => {
    const evaluatedQuestions = [
      {
        questionId: 'q_db',
        questionText: 'Can you describe database indexing strategies?',
        candidateAnswer: 'We used standard B-Tree indexes on the primary key column to make simple lookups faster.',
        testedConcepts: ['Database Indexing', 'Read Replicas', 'Caching Strategies'],
        score: 72,
      },
    ];

    const result = analyzeKnowledgeGaps(evaluatedQuestions, 'Software Engineer');
    assert.ok(result.knowledgeGaps.length > 0);
    const gap = result.knowledgeGaps[0];

    assert.ok(gap.demonstratedStrengths.includes('Database Indexing'));
    assert.ok(gap.demonstratedWeaknesses.includes('Read Replicas') || gap.demonstratedWeaknesses.includes('Caching Strategies'));
    assert.ok([GAP_PRIORITY.HIGH, GAP_PRIORITY.MEDIUM].includes(gap.priority));
    assert.ok(result.studyPlan.length > 0);
    assert.ok(result.studyPlan[0].practiceExercises.length > 0);
    assert.ok(result.studyPlan[0].followUpInterviewQuestions.length > 0);
  });

  console.log(`\n========================================`);
  console.log(`Tests Finished: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
