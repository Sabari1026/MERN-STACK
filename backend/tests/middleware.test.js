const request = require('supertest');
const express = require('express');
const app = require('../src/app');
const ApiError = require('../src/utils/ApiError');
const errorHandler = require('../src/middleware/errorHandler');

describe('Middleware, Security, CORS and Error Handling', () => {
  describe('404 Route Not Found Handling', () => {
    it('4. should return a consistent 404 response for unknown API routes', async () => {
      const res = await request(app).get('/api/v1/nonexistent-endpoint-test');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('code', 'ROUTE_NOT_FOUND');
      expect(res.body).toHaveProperty('requestId');
      expect(res.body.message).toContain('Route not found');
    });
  });

  describe('Malformed JSON Handling', () => {
    it('5. should return controlled client error 400 when body contains malformed JSON', async () => {
      const res = await request(app)
        .post('/api/health')
        .set('Content-Type', 'application/json')
        .send('{"badJson": invalid-value}');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('code', 'MALFORMED_JSON');
      expect(res.body.message).toContain('Malformed JSON');
      expect(res.body).toHaveProperty('requestId');
    });
  });

  describe('Centralized Error Handling & Production Sanitization', () => {
    it('6. should format operational ApiErrors into consistent JSON structure', async () => {
      const testApp = express();
      testApp.use((req, res, next) => {
        req.id = 'test-req-123';
        next();
      });
      testApp.get('/test-error', (req, res, next) => {
        next(ApiError.badRequest('Custom client bad request', 'CUSTOM_BAD_REQUEST', [{ field: 'name', message: 'Required' }]));
      });
      testApp.use(errorHandler);

      const res = await request(testApp).get('/test-error');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('CUSTOM_BAD_REQUEST');
      expect(res.body.message).toBe('Custom client bad request');
      expect(res.body.errors).toEqual([{ field: 'name', message: 'Required' }]);
      expect(res.body.requestId).toBe('test-req-123');
    });

    it('11. should redact internal details, database queries, and stack traces in production responses', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const testApp = express();
      testApp.use((req, res, next) => {
        req.id = 'prod-req-999';
        next();
      });
      testApp.get('/secret-crash', (req, res, next) => {
        // Simulating unexpected crash with sensitive database connection/file information
        const internalErr = new Error('Database password failed for mongodb://user:super_secret@cluster:27017/db at /var/www/secret/file.js:42');
        next(internalErr);
      });
      testApp.use(errorHandler);

      const res = await request(testApp).get('/secret-crash');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('INTERNAL_SERVER_ERROR');
      // Must NOT contain sensitive internal error details
      expect(res.body.message).toBe('An unexpected internal server error occurred');
      expect(res.body.message).not.toContain('super_secret');
      expect(res.body.message).not.toContain('/var/www/secret');
      expect(res.body).not.toHaveProperty('stack');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('CORS Configuration', () => {
    it('7. should accept configured frontend origins and echo back Access-Control-Allow-Origin', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');

      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });

    it('8. should reject arbitrary unauthorized origins in production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Build a dedicated production app instance with production CORS
      const cors = require('cors');
      const testProdApp = express();

      const prodCorsOptions = {
        origin: (origin, cb) => {
          const allowed = ['http://localhost:5173', 'http://localhost:3000'];
          if (!origin || allowed.includes(origin)) {
            cb(null, true);
          } else {
            cb(new Error(`Origin ${origin} is not permitted by CORS policy`));
          }
        }
      };

      testProdApp.use(cors(prodCorsOptions));
      testProdApp.get('/test-prod', (req, res) => res.json({ ok: true }));
      testProdApp.use(errorHandler);

      const res = await request(testProdApp)
        .get('/test-prod')
        .set('Origin', 'https://malicious-attacker-website.com');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('CORS_NOT_ALLOWED');

      process.env.NODE_ENV = originalEnv;
    });
  });
});
