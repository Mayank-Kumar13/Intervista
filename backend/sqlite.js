const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(path.join(DB_DIR, 'intervista.db'));

// Enable WAL mode for better concurrency
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
    knowledgeGaps        TEXT,
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
      question: "Design a High-Throughput Distributed Rate Limiter",
      candidateAnswer: "Used a Token Bucket algorithm with Redis clusters and local memory caching.",
      feedback: "Strong architectural trade-off discussion. Mention sliding window logs for ultra-strict edge-case billing.",
      score: 88
    },
    {
      question: "Reverse Linked List with Constant Extra Memory",
      candidateAnswer: "Implemented standard 3-pointer iterative reversal with O(1) space.",
      feedback: "Clean pointer manipulation. State Big-O time and space limits before coding.",
      score: 92
    }
  ]);

  const verbalDelivery = JSON.stringify({
    speakingPaceWpm: 138,
    paceAssessment: "Optimal Cadence (125-165 WPM)",
    fillerWordsCount: 3,
    fillerDetails: { um: 2, like: 1 },
    fillerRatioPercent: 1.2,
    pausesOver3s: 1,
    clarityScore: 92,
    suggestions: [
      "Natural conversational cadence with clear enunciation.",
      "Replace mid-sentence fillers with deliberate 1-second pauses."
    ]
  });

  const visualObservations = JSON.stringify({
    enabled: true,
    postureScore: 88,
    postureStatus: "Upright & Centered",
    gazeCenteredRatio: 86,
    gazeStatus: "Optimal Direct Focus",
    headMovementStability: "Stable & Poised",
    suggestions: [
      "Maintained upright posture and steady camera framing.",
      "Keep eye contact aligned with webcam lens when explaining trade-offs."
    ]
  });

  const knowledgeGaps = JSON.stringify([
    {
      topic: "Distributed Cache Stampede Invalidation",
      evidence: "Candidate proposed TTL expiry without probabilistic early expiration or mutual exclusion locking."
    },
    {
      topic: "Tail Latency (p99) Engineering",
      evidence: "Addressed average response times without mitigating long-tail RPC outliers."
    }
  ]);

  const studyRoadmap = JSON.stringify([
    {
      topic: "Distributed Systems & Cache Eviction Patterns",
      reason: "Demonstrated basic LRU familiarity but missed Redis cluster stampede locking.",
      priority: "High",
      learningObjective: "Master probabilistic early expiration (XFetch) and cache stampede prevention.",
      practiceExercise: "Implement a simulated cache with mutex locks in Go or Node.js under high concurrent loads.",
      estimatedTime: "Estimated Study Time: ~2.5 hrs",
      suggestedQuestion: "How do you prevent a cache stampede when an expensive query key expires?"
    },
    {
      topic: "STAR Behavioral Communication",
      reason: "Situation and Task were detailed, but quantifiable business impact was omitted.",
      priority: "Medium",
      learningObjective: "Deliver punchy 2-minute behavioral stories ending with quantifiable percentage gains.",
      practiceExercise: "Record and refine 3 past architectural initiatives highlighting measurable business ROI.",
      estimatedTime: "Estimated Study Time: ~1.5 hrs",
      suggestedQuestion: "Tell me about a time you resolved an engineering deadlock with cross-functional partners."
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
      ?, ?, 'Candidate demonstrated strong domain fundamentals, structured thinking, and sound architectural reasoning.', 'ready'
    )
  `).run(
    seedReportId, seedSessionId,
    criterionScores, criterionWeights, strengths, improvements,
    questionFeedback, verbalDelivery, visualObservations,
    knowledgeGaps, studyRoadmap
  );
}

module.exports = db;
