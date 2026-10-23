const express = require('express');
const User = require('../models/User');
const { isDBConnected } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function checkDB(res) {
  if (!isDBConnected()) {
    res.status(503).json({
      error: 'Database connection is temporarily unavailable. Please verify MongoDB Atlas IP access.',
    });
    return false;
  }
  return true;
}

// ─── GET /api/users/me ────────────────────────────────────────────────────────
// Retrieve the authenticated user's complete profile
router.get('/me', requireAuth, async (req, res) => {
  if (!checkDB(res)) return;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    return res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error('[users get me error]', err);
    return res.status(500).json({ error: 'Unable to fetch user profile.' });
  }
});

// ─── PATCH /api/users/me ──────────────────────────────────────────────────────
// Update permitted profile fields (name, skills, picture)
router.patch('/me', requireAuth, async (req, res) => {
  if (!checkDB(res)) return;

  try {
    const { name, skills, picture } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    // 1. Validate & update Name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters.' });
      }
      if (name.trim().length > 100) {
        return res.status(400).json({ error: 'Name cannot exceed 100 characters.' });
      }
      user.name = name.trim();
    }

    // 2. Validate & update Skills array if provided
    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({ error: 'Skills must be an array of strings.' });
      }
      const sanitizedSkills = skills
        .filter((s) => typeof s === 'string' && s.trim().length > 0)
        .map((s) => s.trim().slice(0, 50));
      user.skills = Array.from(new Set(sanitizedSkills)).slice(0, 30);
    }

    // 3. Update Picture if provided
    if (picture !== undefined && typeof picture === 'string') {
      user.picture = picture.trim();
    }

    // Persist changes
    await user.save();

    return res.json({
      message: 'Profile updated successfully.',
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('[users patch me error]', err);
    return res.status(500).json({ error: 'Failed to update user profile.' });
  }
});

module.exports = router;
