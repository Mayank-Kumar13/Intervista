const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'intervista_super_secret_jwt_key_2026';
const COOKIE_NAME = 'intervista_token';

/**
 * Generate a signed JWT for the authenticated user
 */
function createAuthToken(user) {
  const userId = user._id ? user._id.toString() : user.id;
  return jwt.sign(
    {
      id: userId,
      userId: userId,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Attach secure HttpOnly authentication cookie to response
 */
function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

/**
 * Clear the authentication cookie upon logout
 */
function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
}

/**
 * Middleware: extracts and verifies token from HttpOnly cookie or Authorization header
 */
function requireAuth(req, res, next) {
  let token = null;

  // 1. Check HttpOnly cookie
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  }

  // 2. Fallback to Authorization: Bearer <token>
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized — no active session or token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized — invalid or expired authentication token.' });
  }
}

/**
 * Middleware: optional authentication, defaults to guest user if not authenticated
 */
function optionalAuth(req, res, next) {
  let token = null;

  if (req.cookies && req.cookies[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = { id: 'guest_user', name: 'Guest Candidate', email: 'guest@intervista.ai' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: 'guest_user', name: 'Guest Candidate', email: 'guest@intervista.ai' };
    next();
  }
}

module.exports = {
  COOKIE_NAME,
  createAuthToken,
  setAuthCookie,
  clearAuthCookie,
  requireAuth,
  optionalAuth,
};
