/**
 * Automated Test Suite for Intervista Authentication & Security
 */
const assert = require('assert');
const jwt = require('jsonwebtoken');
const { createAuthToken, requireAuth } = require('./middleware/auth');
const User = require('./models/User');

async function runTests() {
  console.log('🧪 Starting Intervista Authentication & Security Tests...\n');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     ${err.message}`);
      failed++;
    }
  }

  // 1. Safe Object Serialization
  test('User.toSafeObject() never includes passwordHash or sensitive fields', () => {
    const dummy = new User({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456',
      provider: 'local',
      role: 'user',
    });
    const safe = dummy.toSafeObject();
    assert.strictEqual(safe.name, 'Sarah Connor');
    assert.strictEqual(safe.email, 'sarah@example.com');
    assert.strictEqual(safe.passwordHash, undefined);
    assert.strictEqual(safe.role, 'user');
  });

  // 2. Token Generation & Verification
  test('createAuthToken generates signed JWT with correct payload', () => {
    const dummy = new User({
      _id: '507f191e810c19729de860ea',
      name: 'Alex Rivera',
      email: 'alex@example.com',
      role: 'user',
    });
    const token = createAuthToken(dummy);
    assert(typeof token === 'string' && token.length > 20);

    const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'intervista_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.email, 'alex@example.com');
    assert.strictEqual(decoded.name, 'Alex Rivera');
    assert.strictEqual(decoded.role, 'user');
    assert.strictEqual(decoded.id, '507f191e810c19729de860ea');
  });

  // 3. Auth Middleware Rejection (No token)
  test('requireAuth rejects unauthenticated requests with 401', () => {
    let status = null;
    let jsonResponse = null;
    let nextCalled = false;

    const req = { cookies: {}, headers: {} };
    const res = {
      status: (code) => {
        status = code;
        return {
          json: (data) => {
            jsonResponse = data;
          },
        };
      },
    };
    const next = () => {
      nextCalled = true;
    };

    requireAuth(req, res, next);
    assert.strictEqual(status, 401);
    assert.strictEqual(nextCalled, false);
    assert(jsonResponse.error.includes('Unauthorized'));
  });

  // 4. Auth Middleware Accepts Valid Bearer Token
  test('requireAuth successfully accepts and decodes valid Bearer token', () => {
    const dummy = new User({
      _id: '507f191e810c19729de860ea',
      name: 'Alex Rivera',
      email: 'alex@example.com',
    });
    const token = createAuthToken(dummy);

    let nextCalled = false;
    const req = {
      cookies: {},
      headers: { authorization: `Bearer ${token}` },
    };
    const res = {};
    const next = () => {
      nextCalled = true;
    };

    requireAuth(req, res, next);
    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user.email, 'alex@example.com');
  });

  // 5. Auth Middleware Accepts Valid HttpOnly Cookie
  test('requireAuth accepts valid token from cookie', () => {
    const dummy = new User({
      _id: '507f191e810c19729de860ea',
      name: 'Alex Rivera',
      email: 'alex@example.com',
    });
    const token = createAuthToken(dummy);

    let nextCalled = false;
    const req = {
      cookies: { intervista_token: token },
      headers: {},
    };
    const res = {};
    const next = () => {
      nextCalled = true;
    };

    requireAuth(req, res, next);
    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user.email, 'alex@example.com');
  });

  // 6. User Model Validation (Email validation)
  test('User schema rejects invalid email address', async () => {
    const invalidUser = new User({
      name: 'Invalid Email User',
      email: 'not-an-email',
      provider: 'local',
      passwordHash: 'dummyhash',
    });
    try {
      await invalidUser.validate();
      assert.fail('Should have failed email validation');
    } catch (err) {
      assert(err.errors.email !== undefined);
    }
  });

  // 7. User Model Validation (Name length)
  test('User schema rejects names shorter than 2 characters', async () => {
    const shortNameUser = new User({
      name: 'A',
      email: 'valid@example.com',
      provider: 'local',
      passwordHash: 'dummyhash',
    });
    try {
      await shortNameUser.validate();
      assert.fail('Should have failed name validation');
    } catch (err) {
      assert(err.errors.name !== undefined);
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
