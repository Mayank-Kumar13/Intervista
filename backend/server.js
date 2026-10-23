require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const resumeAnalyzerRoutes = require('./resume_analyzer/routes');
const reportRoutes = require('./reports/routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/resume-analyzer', resumeAnalyzerRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[server error]', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✦ Intervista Backend running on http://localhost:${PORT}`);
  console.log(`  Auth:            POST /api/auth/register | POST /api/auth/login | GET /api/auth/me`);
  console.log(`  Resume Analyzer: POST /api/resume-analyzer/analyze | GET /api/resume-analyzer/sample`);
  console.log(`  Reports & PDF:   POST /api/reports | GET /api/reports | GET /api/reports/:id/pdf\n`);
});
