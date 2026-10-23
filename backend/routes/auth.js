const express = require('express');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { isDBConnected } = require('../db');
const {
  createAuthToken,
  setAuthCookie,
  clearAuthCookie,
  requireAuth,
} = require('../middleware/auth');

const router = express.Router();

// Helper to check DB readiness
function checkDB(res) {
  if (!isDBConnected()) {
    res.status(503).json({
      error: 'Database connection is temporarily unavailable. Please verify MongoDB Atlas IP access or network status.',
    });
    return false;
  }
  return true;
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  if (!checkDB(res)) return;

  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check for existing user
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      provider: 'local',
    });

    const token = createAuthToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    console.error('[register error]', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  if (!checkDB(res)) return;

  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query user and explicitly select passwordHash
    const user = await User.findOne({ email: cleanEmail }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        error: 'This account was registered using Google Sign-In. Please click "Continue with Google".',
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = createAuthToken(user);
    setAuthCookie(res, token);

    return res.json({
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('[login error]', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ─── POST /api/auth/google ────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  if (!checkDB(res)) return;

  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google ID token credential is required.' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({
        error: 'GOOGLE_CLIENT_ID is not configured on the server. Please add your Google Client ID to backend/.env.',
      });
    }

    const client = new OAuth2Client(clientId);
    let payload;

    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.warn('[google token verify failed]', verifyErr.message);
      return res.status(401).json({ error: 'Invalid or expired Google token. Please sign in again.' });
    }

    if (!payload || !payload.sub) {
      return res.status(401).json({ error: 'Unable to extract Google identity information.' });
    }

    if (!payload.email_verified) {
      return res.status(401).json({ error: 'Google email address is not verified.' });
    }

    const googleId = payload.sub;
    const cleanEmail = payload.email.trim().toLowerCase();
    const displayName = (payload.name || payload.email.split('@')[0]).trim();
    const picture = payload.picture || '';

    // Find existing user by Google sub OR verified email
    let user = await User.findOne({
      $or: [{ googleId }, { email: cleanEmail }],
    });

    if (user) {
      let needsSave = false;
      if (!user.googleId) {
        user.googleId = googleId;
        needsSave = true;
      }
      if (!user.picture && picture) {
        user.picture = picture;
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    } else {
      // Create new Google user with safe race-condition handling
      try {
        user = await User.create({
          name: displayName,
          email: cleanEmail,
          googleId,
          picture,
          provider: 'google',
        });
      } catch (raceErr) {
        if (raceErr.code === 11000) {
          // Concurrency race: find user that was just created
          user = await User.findOne({
            $or: [{ googleId }, { email: cleanEmail }],
          });
        } else {
          throw raceErr;
        }
      }
    }

    const token = createAuthToken(user);
    setAuthCookie(res, token);

    return res.json({
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('[google auth error]', err);
    return res.status(500).json({ error: 'Google authentication failed. Please try again.' });
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  return res.json({ message: 'Successfully logged out.' });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  if (!checkDB(res)) return;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }
    return res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error('[auth me error]', err);
    return res.status(500).json({ error: 'Failed to retrieve user session.' });
  }
});

module.exports = router;
