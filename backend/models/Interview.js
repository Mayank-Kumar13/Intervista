/**
 * Interview Model
 * Mongoose schema for mock interview sessions, questions, transcripts, and evaluation reports.
 */

const mongoose = require('mongoose');

const questionSubSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    index: { type: Number, required: true },
    category: { type: String, default: 'Technical' },
    questionText: { type: String, required: true },
    testedConcepts: { type: [String], default: [] },
    expectedCompetencies: { type: [String], default: [] },
    difficulty: { type: String, default: 'Medium' },
  },
  { _id: false }
);

const transcriptMessageSubSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    sender: { type: String, enum: ['interviewer', 'candidate', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, default: Date.now },
    questionId: { type: String, default: null },
    latencyMs: { type: Number, default: 0 },
    audioDurationMs: { type: Number, default: 0 },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
      default: 'guest_user',
    },
    role: {
      type: String,
      required: true,
      trim: true,
      default: 'Software Engineer',
    },
    company: {
      type: String,
      trim: true,
      default: 'Google',
    },
    interviewType: {
      type: String,
      default: 'Technical Interview',
    },
    experienceLevel: {
      type: String,
      default: 'Mid Level',
    },
    difficulty: {
      type: String,
      default: 'Medium',
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    focusTopic: {
      type: String,
      default: null,
    },
    interviewerPersona: {
      type: String,
      default: 'chen',
    },
    interviewerName: {
      type: String,
      default: 'Mr. J. Chen',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'failed'],
      default: 'active',
      index: true,
    },
    questions: {
      type: [questionSubSchema],
      default: [],
    },
    transcript: {
      type: [transcriptMessageSubSchema],
      default: [],
    },
    evaluation: {
      overallScore: { type: Number, default: 0 },
      rubricScores: { type: Array, default: [] },
      communicationMetrics: { type: Object, default: {} },
      visualObservations: { type: Object, default: {} },
      knowledgeGaps: { type: Array, default: [] },
      studyPlan: { type: Array, default: [] },
      strengths: { type: [String], default: [] },
      improvements: { type: [String], default: [] },
      questionFeedback: { type: Array, default: [] },
      summary: { type: String, default: '' },
      isDemoMode: { type: Boolean, default: false },
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'interviews',
  }
);

// Method to return formatted summary for dashboard
interviewSchema.methods.toDashboardSummary = function () {
  const evalData = this.evaluation || {};
  return {
    id: this.sessionId,
    company: this.company || 'Google',
    role: this.role,
    score: evalData.overallScore || 82,
    date: this.createdAt
      ? new Date(this.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Recent',
    status: this.status,
    details: {
      scores: evalData.scores || { communication: 85, technicalDepth: 80, problemSolving: 82, confidence: 80 },
      strengths: evalData.strengths || [],
      improvements: evalData.improvements || [],
      rubricScores: evalData.rubricScores || [],
    },
  };
};

module.exports = mongoose.model('Interview', interviewSchema);
