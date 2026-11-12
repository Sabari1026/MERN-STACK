const request = require('supertest');
const app = require('../src/app');
const database = require('../src/config/database');

describe('Health and Monitoring Probes', () => {
  describe('GET /api/health', () => {
    it('1. should return a valid JSON response with HTTP 200 and success: true', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'HireConnect API is running');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body.data).toHaveProperty('status', 'healthy');
      expect(res.headers).toHaveProperty('x-request-id');
    });

    it('should be accessible via direct /health orchestration alias', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/health/live', () => {
    it('2. should return the expected liveness response with process uptime', async () => {
      const res = await request(app).get('/api/health/live');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'HireConnect API is alive');
      expect(res.body.data).toHaveProperty('status', 'alive');
      expect(res.body.data).toHaveProperty('uptimeSeconds');
      expect(typeof res.body.data.uptimeSeconds).toBe('number');
    });
  });

  describe('GET /api/health/ready', () => {
    afterEach(() => {
      database.setConnectionStateOverride(null);
    });

    it('3 & 10. should report database state correctly: return 503 when disconnected and never claim false health', async () => {
      database.setConnectionStateOverride({
        isConnected: false,
        status: 'disconnected',
        readyState: 0
      });

      const res = await request(app).get('/api/health/ready');

      expect(res.status).toBe(503);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('code', 'DATABASE_NOT_READY');
      expect(res.body.data.database.status).toBe('disconnected');
      expect(res.body.data.database.readyState).toBe(0);
    });

    it('should report database state as ready with HTTP 200 when mongoose is connected', async () => {
      database.setConnectionStateOverride({
        isConnected: true,
        status: 'connected',
        readyState: 1
      });

      const res = await request(app).get('/api/health/ready');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toContain('ready');
      expect(res.body.data.database.status).toBe('connected');
      expect(res.body.data.database.readyState).toBe(1);
    });
  });

  describe('GET /api/health/email', () => {
    it('should return email health status and provider configuration safely', async () => {
      const res = await request(app).get('/api/health/email');

      expect([200, 503]).toContain(res.status);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('provider', 'gmail-api');
      expect(res.body.data).toHaveProperty('sender');
      expect(res.body.data).toHaveProperty('adminRecipient');
      expect(res.body.data).toHaveProperty('verificationResult');
    });
  });

  describe('POST /api/health/email/test', () => {
    it('should deliver a controlled test email without throwing unhandled exceptions', async () => {
      const res = await request(app)
        .post('/api/health/email/test')
        .send({ to: 'sabari1082005@gmail.com' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toContain('delivered successfully');
      expect(res.body.data).toHaveProperty('messageId');
    });

    it('should support default recipient when none is provided in body', async () => {
      const res = await request(app)
        .post('/api/health/email/test')
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/health/email/outbox/process', () => {
    it('should trigger outbox queue processing cleanly', async () => {
      const res = await request(app)
        .post('/api/health/email/outbox/process?batch=10');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('processed');
    });
  });

  describe('emailService backward-compatibility alias', () => {
    it('should provide sendMail as an alias to sendEmail', async () => {
      const emailService = require('../src/services/email.service');
      expect(typeof emailService.sendMail).toBe('function');
      const result = await emailService.sendMail({
        to: 'test@hireconnect.io',
        subject: 'Alias Test',
        text: 'Testing sendMail alias'
      });
      expect(result.success).toBe(true);
    });
  });
});
