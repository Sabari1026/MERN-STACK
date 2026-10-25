/**
 * Automated Authentication & Authorization Test Suite for HireConnect
 * Covers: Registration, Login, Role Enforcement, JWT/Cookie Session Management,
 * Password Hashing, Refresh Token Rotation, Password Recovery, and Protected Routes.
 */

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const { generateAccessToken, hashToken } = require('../src/utils/token');

describe('HireConnect Authentication & Authorization System', () => {
  beforeEach(async () => {
    User.__clearMemoryStore();
    await User.__seedMemoryDefaults();
  });

  // 1. Candidate Registration
  describe('POST /api/auth/register', () => {
    it('1. should register a new candidate account with valid data', async () => {
      const payload = {
        name: 'Arjun Das',
        email: 'arjun.das@example.com',
        password: 'SecurePassword123!',
        role: 'candidate'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('arjun.das@example.com');
      expect(res.body.user.role).toBe('candidate');
      expect(res.body.user.passwordHash).toBeUndefined();

      // Check cookies
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.includes('hireconnect_access_token'))).toBe(true);
      expect(cookies.some((c) => c.includes('hireconnect_refresh_token'))).toBe(true);
    });

    it('2. should register a candidate using "employee" alias and normalize to "candidate"', async () => {
      const payload = {
        name: 'Meera Nair',
        email: 'meera.nair@example.com',
        password: 'Password@2026',
        role: 'employee'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('candidate');
    });

    it('3. should register a new recruiter account with valid data', async () => {
      const payload = {
        name: 'Vikram Seth',
        email: 'vikram.seth@company.com',
        password: 'RecruiterPassword123!',
        role: 'recruiter'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('vikram.seth@company.com');
      expect(res.body.user.role).toBe('recruiter');
    });

    it('4. should strictly reject public registration specifying role: "admin"', async () => {
      const payload = {
        name: 'Malicious Admin Attempt',
        email: 'hacker@admin.com',
        password: 'AdminPassword123!',
        role: 'admin'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toMatch(/administrator role is strictly forbidden/i);
    });

    it('5. should reject duplicate email registration with 409 Conflict', async () => {
      const payload = {
        name: 'Duplicate Candidate',
        email: 'candidate@hireconnect.io', // Already seeded
        password: 'Password123!',
        role: 'candidate'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('CONFLICT');
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('6. should reject registration with invalid email format', async () => {
      const payload = {
        name: 'Bad Email',
        email: 'invalid-email-format',
        password: 'Password123!',
        role: 'candidate'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('7. should reject registration with weak password (under 8 chars)', async () => {
      const payload = {
        name: 'Short Password',
        email: 'short.pw@example.com',
        password: '123',
        role: 'candidate'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('8. should verify password is never stored in plaintext', async () => {
      const password = 'PlainTextPassword123!';
      const payload = {
        name: 'Security Verify',
        email: 'security.check@example.com',
        password,
        role: 'candidate'
      };

      await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(201);

      // Inspect document directly in database layer
      const storedUser = await User.findOne({ email: 'security.check@example.com' }).select(
        '+passwordHash'
      );
      expect(storedUser).toBeDefined();
      expect(storedUser.passwordHash).not.toBe(password);
      expect(storedUser.passwordHash).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash format
    });
  });

  // 2. Authentication / Login
  describe('POST /api/auth/login', () => {
    it('9. should authenticate user with correct credentials and issue tokens', async () => {
      const payload = {
        email: 'candidate@hireconnect.io',
        password: 'Candidate@123',
        role: 'candidate'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(payload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('candidate@hireconnect.io');
      expect(res.body.user.role).toBe('candidate');
      expect(res.body.user.passwordHash).toBeUndefined();

      // Check HTTP-only cookie headers
      const cookies = res.headers['set-cookie'];
      expect(cookies.some((c) => c.includes('hireconnect_access_token'))).toBe(true);
      expect(cookies.some((c) => c.includes('HttpOnly'))).toBe(true);
    });

    it('10. should reject login with incorrect password (401 Unauthorized)', async () => {
      const payload = {
        email: 'candidate@hireconnect.io',
        password: 'WrongPassword123!',
        role: 'candidate'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(payload)
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('UNAUTHORIZED');
      expect(res.body.message).toMatch(/Invalid email or password/i);
    });

    it('11. should reject login with non-existent email (401 Unauthorized)', async () => {
      const payload = {
        email: 'nonexistent.user@example.com',
        password: 'AnyPassword123!',
        role: 'candidate'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(payload)
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('UNAUTHORIZED');
      expect(res.body.message).toMatch(/Invalid email or password/i);
    });

    it('12. should reject role mismatch (candidate logging in under recruiter tab)', async () => {
      const payload = {
        email: 'candidate@hireconnect.io', // Registered as candidate
        password: 'Candidate@123',
        role: 'recruiter' // Attempted via recruiter tab
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(payload)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('FORBIDDEN');
      expect(res.body.message).toMatch(/registered as a Job Seeker \/ Candidate/i);
    });

    it('13. should reject role mismatch (recruiter logging in under candidate tab)', async () => {
      const payload = {
        email: 'recruiter@hireconnect.io', // Registered as recruiter
        password: 'Recruiter@123',
        role: 'candidate' // Attempted via candidate tab
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(payload)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('FORBIDDEN');
      expect(res.body.message).toMatch(/registered as a Recruiter \/ Employer/i);
    });
  });

  // 3. Authenticated Session (GET /api/auth/me)
  describe('GET /api/auth/me', () => {
    it('14. should restore user session with valid Bearer token and exclude sensitive hashes', async () => {
      // First sign in to obtain valid token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'candidate@hireconnect.io', password: 'Candidate@123' })
        .expect(200);

      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('candidate@hireconnect.io');
      expect(res.body.user.role).toBe('candidate');
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.body.user.refreshTokens).toBeUndefined();
      expect(res.body.user.passwordResetTokenHash).toBeUndefined();
    });

    it('15. should reject unauthenticated requests with 401 Unauthorized', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('UNAUTHORIZED');
      expect(res.body.message).toMatch(/Authentication required/i);
    });

    it('16. should reject requests with malformed or tampered token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.tampered.jwt.token')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });
  });

  // 4. Role-Based Access Control Middleware
  describe('Role-Based Authorization Enforcement', () => {
    it('17. should permit candidate accessing candidate-authorized endpoint', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'candidate@hireconnect.io', password: 'Candidate@123' });

      const res = await request(app)
        .get('/api/auth/test/candidate')
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.role).toBe('candidate');
    });

    it('18. should reject candidate attempting to access recruiter-authorized endpoint with 403 Forbidden', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'candidate@hireconnect.io', password: 'Candidate@123' });

      const res = await request(app)
        .get('/api/auth/test/recruiter')
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('FORBIDDEN');
      expect(res.body.message).toMatch(/Access denied/i);
    });

    it('19. should permit recruiter accessing recruiter-authorized endpoint', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'recruiter@hireconnect.io', password: 'Recruiter@123' });

      const res = await request(app)
        .get('/api/auth/test/recruiter')
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.role).toBe('recruiter');
    });

    it('20. should reject non-admin from accessing admin-authorized endpoint with 403 Forbidden', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'candidate@hireconnect.io', password: 'Candidate@123' });

      const res = await request(app)
        .get('/api/auth/test/admin')
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('FORBIDDEN');
    });
  });

  // 5. Session Refresh Token Rotation
  describe('POST /api/auth/refresh', () => {
    it('21. should rotate refresh token and issue new access token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'candidate@hireconnect.io', password: 'Candidate@123' })
        .expect(200);

      const oldRefreshToken = loginRes.body.refreshToken;
      expect(oldRefreshToken).toBeDefined();

      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: oldRefreshToken })
        .expect(200);

      expect(refreshRes.body.success).toBe(true);
      expect(refreshRes.body.token).toBeDefined();
      expect(refreshRes.body.refreshToken).toBeDefined();
      expect(refreshRes.body.refreshToken).not.toBe(oldRefreshToken);

      // Reusing the old rotated refresh token must fail
      const reuseRes = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: oldRefreshToken })
        .expect(401);

      expect(reuseRes.body.success).toBe(false);
      expect(reuseRes.body.code).toBe('UNAUTHORIZED');
    });
  });

  // 6. Logout and Session Invalidation
  describe('POST /api/auth/logout', () => {
    it('22. should invalidate session and clear cookies on logout', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'candidate@hireconnect.io', password: 'Candidate@123' })
        .expect(200);

      const refreshToken = loginRes.body.refreshToken;

      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(200);

      expect(logoutRes.body.success).toBe(true);
      expect(logoutRes.body.message).toMatch(/Signed out successfully/i);

      // Clear cookie header should be sent
      const cookies = logoutRes.headers['set-cookie'];
      expect(cookies.some((c) => c.includes('hireconnect_access_token=;'))).toBe(true);

      // Attempting to refresh after logout must fail
      await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });
  });

  // 7. Password Recovery Workflow
  describe('Password Recovery (Forgot / Reset Password)', () => {
    it('23. should handle forgot-password and return generic 200 to prevent user enumeration', async () => {
      // For existing user
      const resExisting = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'candidate@hireconnect.io' })
        .expect(200);

      expect(resExisting.body.success).toBe(true);
      expect(resExisting.body.message).toMatch(/instructions have been sent/i);
      expect(resExisting.headers['x-dev-reset-token']).toBeDefined();

      // For non-existing user (uniform response)
      const resNonExisting = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'unknown@example.com' })
        .expect(200);

      expect(resNonExisting.body.success).toBe(true);
      expect(resNonExisting.body.message).toMatch(/instructions have been sent/i);
    });

    it('24. should complete password reset workflow, update password hash, and allow login with new password', async () => {
      // Request reset token
      const forgotRes = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'candidate@hireconnect.io' });

      const rawToken = forgotRes.headers['x-dev-reset-token'];
      expect(rawToken).toBeDefined();

      // Reset password with token
      const resetRes = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: rawToken,
          password: 'NewSuperPassword@2026'
        })
        .expect(200);

      expect(resetRes.body.success).toBe(true);
      expect(resetRes.body.message).toMatch(/Password has been reset successfully/i);

      // Login with old password must fail
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'candidate@hireconnect.io',
          password: 'Candidate@123'
        })
        .expect(401);

      // Login with new password must succeed
      const newLoginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'candidate@hireconnect.io',
          password: 'NewSuperPassword@2026'
        })
        .expect(200);

      expect(newLoginRes.body.success).toBe(true);
    });

    it('25. should reject password reset with invalid or expired token (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid_expired_token_1234567890',
          password: 'NewSuperPassword@2026'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('BAD_REQUEST');
      expect(res.body.message).toMatch(/invalid or has expired/i);
    });
  });

  // 8. Account Settings Management
  describe('Account Settings Management', () => {
    it('26. should change password for authenticated user and verify new credentials', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'candidate@hireconnect.io', password: 'Candidate@123' });

      const token = loginRes.body.token;

      // Change password
      const changeRes = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'Candidate@123',
          newPassword: 'BrandNewCandidatePassword@1'
        })
        .expect(200);

      expect(changeRes.body.success).toBe(true);
      expect(changeRes.body.message).toMatch(/Password updated successfully/i);

      // Re-login with new password
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'candidate@hireconnect.io',
          password: 'BrandNewCandidatePassword@1'
        })
        .expect(200);
    });

    it('27. should list active sessions and allow revoking other sessions', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'candidate@hireconnect.io', password: 'Candidate@123' });

      const token = loginRes.body.token;

      const sessionsRes = await request(app)
        .get('/api/auth/sessions')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(sessionsRes.body.success).toBe(true);
      expect(Array.isArray(sessionsRes.body.sessions)).toBe(true);

      const revokeRes = await request(app)
        .post('/api/auth/sessions/revoke-others')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(revokeRes.body.success).toBe(true);
      expect(revokeRes.body.message).toMatch(/All other sessions have been revoked/i);
    });
  });
});
