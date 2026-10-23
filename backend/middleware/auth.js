const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'intervista_secret';

/**
 * Middleware: verifies JWT token from Authorization header
 * Attaches decoded user payload to req.user
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized — no token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized — invalid or expired token.' });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { id: 'guest_user', name: 'Guest Candidate', email: 'guest@intervista.ai' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: 'guest_user', name: 'Guest Candidate', email: 'guest@intervista.ai' };
    next();
  }
}

module.exports = { requireAuth, optionalAuth };
