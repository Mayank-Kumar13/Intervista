const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);

const db = new Database(path.join(DB_DIR, 'intervista.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ──────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id             TEXT PRIMARY KEY,
    user_id        TEXT NOT NULL,
    role           TEXT NOT NULL,
    company        TEXT,
    level          TEXT,
    interview_type TEXT,
    status         TEXT NOT NULL DEFAULT 'completed',
    started_at     TEXT NOT NULL DEFAULT (datetime('now')),
    ended_at       TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reports (
    id                   TEXT PRIMARY KEY,
    session_id           TEXT,
    user_id              TEXT NOT NULL,
    role                 TEXT NOT NULL,
    company              TEXT,
    overall_score        INTEGER NOT NULL,
    communication        INTEGER,
    technical_depth      INTEGER,
    problem_solving      INTEGER,
    confidence           INTEGER,
    criterion_scores     TEXT,
    criterion_weights    TEXT,
    strengths            TEXT,
    improvements         TEXT,
    question_feedback    TEXT,
    verbal_delivery      TEXT,
    visual_observations  TEXT,
    knowledge_gaps       TEXT,
    study_roadmap        TEXT,
    summary              TEXT,
    pdf_path             TEXT,
    status               TEXT NOT NULL DEFAULT 'ready',
    created_at           TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Safely migrate existing tables if columns are missing
try {
  const sessionCols = db.prepare("PRAGMA table_info(sessions)").all().map(c => c.name);
  if (!sessionCols.includes('level')) db.prepare("ALTER TABLE sessions ADD COLUMN level TEXT").run();
  if (!sessionCols.includes('company')) db.prepare("ALTER TABLE sessions ADD COLUMN company TEXT").run();
  if (!sessionCols.includes('interview_type')) db.prepare("ALTER TABLE sessions ADD COLUMN interview_type TEXT").run();
  if (!sessionCols.includes('started_at')) db.prepare("ALTER TABLE sessions ADD COLUMN started_at TEXT DEFAULT (datetime('now'))").run();
  if (!sessionCols.includes('ended_at')) db.prepare("ALTER TABLE sessions ADD COLUMN ended_at TEXT DEFAULT (datetime('now'))").run();

  const reportCols = db.prepare("PRAGMA table_info(reports)").all().map(c => c.name);
  if (!reportCols.includes('role')) db.prepare("ALTER TABLE reports ADD COLUMN role TEXT").run();
  if (!reportCols.includes('company')) db.prepare("ALTER TABLE reports ADD COLUMN company TEXT").run();
  if (!reportCols.includes('criterion_scores')) db.prepare("ALTER TABLE reports ADD COLUMN criterion_scores TEXT").run();
  if (!reportCols.includes('criterion_weights')) db.prepare("ALTER TABLE reports ADD COLUMN criterion_weights TEXT").run();
  if (!reportCols.includes('verbal_delivery')) db.prepare("ALTER TABLE reports ADD COLUMN verbal_delivery TEXT").run();
  if (!reportCols.includes('visual_observations')) db.prepare("ALTER TABLE reports ADD COLUMN visual_observations TEXT").run();
  if (!reportCols.includes('knowledge_gaps')) db.prepare("ALTER TABLE reports ADD COLUMN knowledge_gaps TEXT").run();
  if (!reportCols.includes('study_roadmap')) db.prepare("ALTER TABLE reports ADD COLUMN study_roadmap TEXT").run();
  if (!reportCols.includes('pdf_path')) db.prepare("ALTER TABLE reports ADD COLUMN pdf_path TEXT").run();
  if (!reportCols.includes('status')) db.prepare("ALTER TABLE reports ADD COLUMN status TEXT DEFAULT 'ready'").run();
} catch (e) {
  console.warn('[DB Migration] schema warning:', e.message);
}

// Ensure guest user exists for unauthenticated demo/guest interviews
db.prepare(`
  INSERT OR IGNORE INTO users (id, name, email, password_hash)
  VALUES ('guest_user', 'Guest Candidate', 'guest@intervista.ai', 'none')
`).run();

// Seed initial interview history if empty
const existingReportsCount = db.prepare('SELECT count(*) as count FROM reports').get().count;
if (existingReportsCount === 0) {
  const seedReportId = 'rep_seed_google_01';
  const seedSessionId = 'sess_seed_google_01';

  db.prepare(`
    INSERT OR IGNORE INTO sessions (id, user_id, role, company, level, interview_type, status, started_at)
    VALUES (?, 'guest_user', 'Software Engineer', 'Google', 'Mid Level', 'Technical Interview', 'completed', datetime('now', '-2 days'))
  `).run(seedSessionId);

  const criterionScores = JSON.stringify({
    technicalKnowledge: 88,
    problemSolving: 85,
    communication: 82,
    systemDesign: 80,
    confidence: 84
  });

  const criterionWeights = JSON.stringify({
    technicalKnowledge: 35,
    problemSolving: 30,
    communication: 20,
    confidence: 15
  });

  const strengths = JSON.stringify([
    'Clean, articulate communication when breaking down algorithmic trade-offs.',
    'Strong grasp of time and space complexity with proactive edge case analysis.',
    'Structured architectural approach to microservices scalability.'
  ]);

  const improvements = JSON.stringify([
    'State Big-O time and space complexity upfront before expanding on code implementation.',
    'Incorporate concrete production metrics (e.g. p95 latency reduction) in system design answers.',
    'Structure behavioral answers using the STAR framework more tightly.'
  ]);

  const questionFeedback = JSON.stringify([
    {
      question: 'Design an in-memory caching system like Redis with LRU eviction.',
      candidateAnswer: 'I proposed using a Hash Map combined with a Doubly Linked List to achieve O(1) get and put operations with eviction at the tail.',
      score: 90,
      feedback: 'Excellent explanation. Mentioning concurrent thread-safety using fine-grained mutexes or RW locks would elevate this to staff level.'
    },
    {
      question: 'How do you handle data consistency across distributed microservices?',
      candidateAnswer: 'Explained the Saga pattern with compensating transactions versus two-phase commit (2PC) trade-offs.',
      score: 84,
      feedback: 'Good overview of choreography vs orchestration. Proactively mention idempotent event handling and outbox pattern.'
    },
    {
      question: 'Tell me about a time a production incident occurred under your watch.',
      candidateAnswer: 'Walked through an incident where database connections were exhausted, how we diagnosed it with APM tools and resolved it.',
      score: 82,
      feedback: 'Solid root-cause analysis. Highlight how preventative automated alerts were added to prevent recurrence.'
    }
  ]);

  const verbalDelivery = JSON.stringify({
    speakingPaceWpm: 138,
    paceAssessment: 'Optimal Cadence (125-155 WPM)',
    fillerWordsCount: 4,
    fillerWords: ['um', 'like'],
    fillerRatioPercent: 1.1,
    pausesOver3s: 1,
    clarityScore: 92,
    suggestions: [
      'Pacing was steady and conversational throughout all technical answers.',
      'Pause intentionally for 1-2 seconds instead of filler sounds when thinking.'
    ]
  });

  const visualObservations = JSON.stringify({
    assessed: true,
    postureScore: 89,
    postureStatus: 'Upright & Centered',
    gazeCenteredRatio: 86,
    headMovementStability: 'Stable & Natural',
    suggestions: [
      'Maintained direct camera engagement during key architectural explanations.',
      'Natural head movement and steady upright posture.'
    ]
  });

  const knowledgeGaps = JSON.stringify([
    {
      topic: 'Distributed Systems Concurrency & Locking',
      severity: 'Medium',
      evidence: 'Hesitation observed when explaining distributed lock lease renewals and split-brain recovery in Redis Redlock.'
    },
    {
      topic: 'Production Outbox Pattern & Idempotency',
      severity: 'Low',
      evidence: 'Explained event publishing but did not explicitly detail database transaction outbox tables for at-least-once delivery.'
    }
  ]);

  const studyRoadmap = JSON.stringify([
    {
      topic: 'Distributed Transactions & Saga Orchestration',
      reason: 'Candidate provided high-level overview but missed idempotency keys and outbox tables.',
      priority: 'High',
      learningObjective: 'Master Saga choreography vs orchestration, outbox pattern, and compensating transactions.',
      practiceExercise: 'Design an e-commerce order fulfillment workflow with payment failure rollbacks using Temporal or Kafka.',
      estimatedStudyTime: 'Est. 3-4 hours',
      suggestedFollowUpQuestion: 'How would you prevent duplicate financial charges if a payment gateway webhook times out and retries?'
    },
    {
      topic: 'Distributed Locking & Redlock Algorithm',
      reason: 'Identified during caching question discussion on concurrent writes across multiple nodes.',
      priority: 'Medium',
      learningObjective: 'Understand fencing tokens, clock drift, and consensus in distributed mutexes.',
      practiceExercise: 'Implement a distributed lock with automatic TTL renewal in Node.js using Redis Lua scripts.',
      estimatedStudyTime: 'Est. 2 hours',
      suggestedFollowUpQuestion: 'What failure modes occur if a GC pause halts a process holding a distributed lock beyond its TTL?'
    }
  ]);

  db.prepare(`
    INSERT INTO reports (
      id, session_id, user_id, role, company, overall_score,
      communication, technical_depth, problem_solving, confidence,
      criterion_scores, criterion_weights, strengths, improvements,
      question_feedback, verbal_delivery, visual_observations,
      knowledge_gaps, study_roadmap, summary, status
    ) VALUES (
      ?, ?, 'guest_user', 'Software Engineer', 'Google', 86,
      82, 88, 85, 84,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?,
      'The candidate demonstrated strong domain fundamentals for Software Engineer at Google. Answers showed structured thinking, sound architectural reasoning, and professional poise under mock interview pressure.',
      'ready'
    )
  `).run(
    seedReportId, seedSessionId,
    criterionScores, criterionWeights, strengths, improvements,
    questionFeedback, verbalDelivery, visualObservations,
    knowledgeGaps, studyRoadmap
  );
}

module.exports = db;
