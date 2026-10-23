/**
 * Reports & PDF Download API Router
 * Endpoints for report persistence, interview history, and private PDF downloads.
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../sqlite');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const { generateReportPDF } = require('./pdfGenerator');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'intervista_secret';

function generateId(prefix = 'rep') {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Custom middleware for PDF downloads: accepts either Bearer header or ?token= query parameter
function authForPdf(req, res, next) {
  const token = (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]) || req.query.token;
  if (!token) {
    // Allow guest user access if no token
    req.user = { id: 'guest_user', name: 'Guest Candidate' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: 'guest_user', name: 'Guest Candidate' };
    next();
  }
}

// ─── POST /api/reports ────────────────────────────────────────────────────────
// Saves a validated interview evaluation report
router.post('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id || 'guest_user';
    const body = req.body || {};

    const {
      sessionId,
      role = 'Software Engineer',
      company = 'Google',
      overallScore = 85,
      scores = {},
      strengths = [],
      improvements = [],
      questionFeedback = [],
      verbalDelivery = null,
      visualObservations = null,
      knowledgeGaps = [],
      studyRoadmap = [],
      summary = '',
    } = body;

    // Avoid duplicate report generation for same session
    if (sessionId) {
      const existing = db.prepare('SELECT id FROM reports WHERE session_id = ?').get(sessionId);
      if (existing) {
        return res.json({
          success: true,
          isDuplicate: true,
          reportId: existing.id,
          message: 'Report already saved for this session.',
        });
      }
    }

    const reportId = generateId('rep');
    const actualSessionId = sessionId || generateId('sess');

    // Create session record if not present
    db.prepare(`
      INSERT OR IGNORE INTO sessions (id, user_id, role, company, interview_type, status, started_at)
      VALUES (?, ?, ?, ?, 'Technical Interview', 'completed', datetime('now'))
    `).run(actualSessionId, userId, role, company);

    // Prepare weighted criterion scores
    const commScore = scores.communication || 85;
    const techScore = scores.technicalDepth || 88;
    const probScore = scores.problemSolving || 86;
    const confScore = scores.confidence || 82;

    const criterionScores = JSON.stringify({
      technicalKnowledge: techScore,
      problemSolving: probScore,
      communication: commScore,
      confidence: confScore,
    });

    const criterionWeights = JSON.stringify({
      technicalKnowledge: 35,
      problemSolving: 30,
      communication: 20,
      confidence: 15,
    });

    // Provide realistic study roadmap if empty
    const finalRoadmap = (studyRoadmap && studyRoadmap.length > 0)
      ? studyRoadmap
      : [
          {
            topic: `${role} Scalability & Core Architecture`,
            reason: `Identified from technical depth score of ${techScore}%.`,
            priority: techScore < 85 ? 'High' : 'Medium',
            learningObjective: 'Master low-level trade-offs, concurrency handling, and system fault-tolerance.',
            practiceExercise: 'Diagram and write a design doc for an end-to-end resilient microservice with circuit breaking.',
            estimatedStudyTime: 'Est. 2-3 hours',
            suggestedFollowUpQuestion: 'How would your architecture maintain consistency under a sudden network partition?'
          },
          {
            topic: 'STAR Behavioral Communication & Impact',
            reason: 'Recruiters probe for quantified outcomes (XYZ formula).',
            priority: 'Medium',
            learningObjective: 'Structure project explanations tightly: Situation, Task, Action, and Quantified Result.',
            practiceExercise: 'Draft 3 project bullet points explicitly naming latency, throughput, or business impact metrics.',
            estimatedStudyTime: 'Est. 1.5 hours',
            suggestedFollowUpQuestion: 'Tell me about a technical decision you made where you lacked complete requirements.'
          }
        ];

    db.prepare(`
      INSERT INTO reports (
        id, session_id, user_id, role, company, overall_score,
        communication, technical_depth, problem_solving, confidence,
        criterion_scores, criterion_weights, strengths, improvements,
        question_feedback, verbal_delivery, visual_observations,
        knowledge_gaps, study_roadmap, summary, status
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, 'ready'
      )
    `).run(
      reportId,
      actualSessionId,
      userId,
      role,
      company,
      overallScore,
      commScore,
      techScore,
      probScore,
      confScore,
      criterionScores,
      criterionWeights,
      JSON.stringify(strengths),
      JSON.stringify(improvements),
      JSON.stringify(questionFeedback),
      JSON.stringify(verbalDelivery),
      JSON.stringify(visualObservations),
      JSON.stringify(knowledgeGaps),
      JSON.stringify(finalRoadmap),
      summary || `Candidate completed a ${role} interview for ${company}.`
    );

    return res.status(201).json({
      success: true,
      id: reportId,
      reportId,
      sessionId: actualSessionId,
      report: {
        id: reportId,
        sessionId: actualSessionId,
        role,
        company,
        overallScore,
        scores: { communication: commScore, technicalDepth: techScore, problemSolving: probScore, confidence: confScore },
        criterionScores: JSON.parse(criterionScores),
        criterionWeights: JSON.parse(criterionWeights),
        strengths,
        improvements,
        questionFeedback,
        verbalDelivery,
        visualObservations,
        knowledgeGaps,
        studyRoadmap: finalRoadmap,
        summary: summary || `Candidate completed a ${role} interview for ${company}.`
      }
    });
  } catch (err) {
    console.error('[save report error]', err);
    return res.status(500).json({ error: 'Failed to save evaluation report.', details: err.message });
  }
});

// ─── GET /api/reports ─────────────────────────────────────────────────────────
// Returns list of recent interviews for dashboard history
router.get('/', optionalAuth, (req, res) => {
  try {
    const userId = req.user?.id || 'guest_user';

    // Fetch reports for this user (or guest user)
    const reports = db.prepare(`
      SELECT
        id, session_id, role, company, overall_score,
        communication, technical_depth, problem_solving, confidence,
        criterion_scores, strengths, improvements, created_at, status
      FROM reports
      WHERE user_id = ? OR user_id = 'guest_user'
      ORDER BY created_at DESC
      LIMIT 25
    `).all(userId);

    // Format for frontend dashboard consumption
    const formatted = reports.map((r) => {
      const parsedScores = r.criterion_scores ? JSON.parse(r.criterion_scores) : {
        technicalKnowledge: r.technical_depth,
        problemSolving: r.problem_solving,
        communication: r.communication,
        confidence: r.confidence,
      };

      return {
        id: r.id,
        sessionId: r.session_id,
        role: r.role,
        company: r.company || 'Tech Company',
        score: r.overall_score,
        scoreColor: r.overall_score >= 85 ? 'var(--accent-gold)' : (r.overall_score >= 70 ? '#34D399' : '#F87171'),
        date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
        status: r.status || 'ready',
        details: {
          scores: parsedScores,
          strengths: r.strengths ? JSON.parse(r.strengths) : [],
          improvements: r.improvements ? JSON.parse(r.improvements) : [],
        }
      };
    });

    return res.json({
      success: true,
      reports: formatted,
    });
  } catch (err) {
    console.error('[fetch reports history error]', err);
    return res.status(500).json({ error: 'Failed to fetch interview history.' });
  }
});

// ─── GET /api/reports/:id ─────────────────────────────────────────────────────
// Returns full report details by reportId with authorization check
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'guest_user';

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    // Access control: prevent users from accessing another user's private report
    if (report.user_id !== 'guest_user' && req.user?.id && report.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You do not have access to this report.' });
    }

    return res.json({
      success: true,
      report: {
        id: report.id,
        sessionId: report.session_id,
        role: report.role,
        company: report.company,
        overallScore: report.overall_score,
        scores: report.criterion_scores ? JSON.parse(report.criterion_scores) : {
          communication: report.communication,
          technicalDepth: report.technical_depth,
          problemSolving: report.problem_solving,
          confidence: report.confidence,
        },
        weights: report.criterion_weights ? JSON.parse(report.criterion_weights) : null,
        strengths: report.strengths ? JSON.parse(report.strengths) : [],
        improvements: report.improvements ? JSON.parse(report.improvements) : [],
        questionFeedback: report.question_feedback ? JSON.parse(report.question_feedback) : [],
        verbalDelivery: report.verbal_delivery ? JSON.parse(report.verbal_delivery) : null,
        visualObservations: report.visual_observations ? JSON.parse(report.visual_observations) : null,
        knowledgeGaps: report.knowledge_gaps ? JSON.parse(report.knowledge_gaps) : [],
        studyRoadmap: report.study_roadmap ? JSON.parse(report.study_roadmap) : [],
        summary: report.summary,
        createdAt: report.created_at,
        status: report.status,
      }
    });
  } catch (err) {
    console.error('[get report details error]', err);
    return res.status(500).json({ error: 'Failed to retrieve report.' });
  }
});

// ─── GET /api/reports/:id/pdf ─────────────────────────────────────────────────
// Generates and streams downloadable PDF with authorization verification
router.get('/:id/pdf', authForPdf, async (req, res) => {
  try {
    const { id } = req.params;
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found for PDF export.' });
    }

    // Authorization check
    if (report.user_id !== 'guest_user' && req.user?.id && report.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: Access to this candidate PDF is restricted.' });
    }

    const safeFilename = `Intervista_Performance_Report_${report.id}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Cache-Control', 'private, no-transform, max-age=0');

    await generateReportPDF(report, res);
  } catch (err) {
    console.error('[pdf generation error]', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'PDF generation failed. Please retry.', details: err.message });
    }
  }
});

module.exports = router;
