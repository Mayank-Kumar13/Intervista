require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Fallback: If MONGODB_URI is not in process.env, check root atlas-credentials.env
if (!process.env.MONGODB_URI) {
  const atlasCredsPath = path.join(__dirname, '..', 'atlas-credentials.env');
  if (fs.existsSync(atlasCredsPath)) {
    require('dotenv').config({ path: atlasCredsPath });
  }
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDB, isDBConnected } = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const resumeAnalyzerRoutes = require('./resume_analyzer/routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// ─── CORS Configuration ───────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error(`CORS origin ${origin} not permitted.`));
    },
    credentials: true,
  })
);

// ─── Body & Cookie Parsers ────────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resume-analyzer', resumeAnalyzerRoutes);

// ─── Health Check Endpoint ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDBConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[server error]', err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: isProd ? 'Internal server error.' : err.message || 'Internal server error.',
  });
});

// ─── Server Start ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✦ Intervista Backend running on http://localhost:${PORT}`);
  console.log(`  Auth:            POST /api/auth/register | POST /api/auth/login | POST /api/auth/google | POST /api/auth/logout | GET /api/auth/me`);
  console.log(`  Users:           GET /api/users/me | PATCH /api/users/me`);
  console.log(`  Resume Analyzer: POST /api/resume-analyzer/analyze | GET /api/resume-analyzer/sample`);
  console.log(`  Health:          GET /api/health\n`);
});
