const { validateEnv } = require('../src/config/env');
const logger = require('../src/utils/logger');

describe('Environment Configuration & Validation', () => {
  it('9. should handle missing or invalid environment configuration with clear errors', () => {
    // Test with invalid PORT string
    expect(() => {
      validateEnv({
        PORT: 'invalid_port',
        NODE_ENV: 'development'
      });
    }).toThrow(/PORT must be an integer/);
  });

  it('should reject out-of-range port numbers', () => {
    expect(() => {
      validateEnv({
        PORT: '70000',
        NODE_ENV: 'development'
      });
    }).toThrow(/PORT must be an integer between 1 and 65535/);
  });

  it('should reject invalid NODE_ENV values', () => {
    expect(() => {
      validateEnv({
        PORT: '5000',
        NODE_ENV: 'invalid_env'
      });
    }).toThrow(/Invalid enum value/);
  });

  it('should parse comma-separated FRONTEND_URL into an array of origins', () => {
    const config = validateEnv({
      PORT: '5000',
      NODE_ENV: 'development',
      FRONTEND_URL: 'http://localhost:5173, http://localhost:3000/'
    });

    expect(config.FRONTEND_URL).toEqual(['http://localhost:5173', 'http://localhost:3000']);
  });

  it('should redact sensitive credentials from database connection strings', () => {
    const rawUri = 'mongodb://app_admin:SecretP@ssword123!@cluster0.abcde.mongodb.net:27017/hireconnect?authSource=admin';
    const redacted = logger.redactConnectionString(rawUri);

    expect(redacted).not.toContain('SecretP@ssword123!');
    expect(redacted).toContain('mongodb://app_admin:***@cluster0.abcde.mongodb.net');
  });

  it('should reject missing MONGODB_URI in production mode', () => {
    expect(() => {
      validateEnv({
        PORT: '5000',
        NODE_ENV: 'production',
        MONGODB_URI: '',
        JWT_SECRET: 'a'.repeat(32),
        COOKIE_SECRET: 'b'.repeat(32)
      });
    }).toThrow(/MONGODB_URI is strictly required in production mode/);
  });

  it('should reject development default JWT_SECRET in production mode', () => {
    expect(() => {
      validateEnv({
        PORT: '5000',
        NODE_ENV: 'production',
        MONGODB_URI: 'mongodb://127.0.0.1:27017/hireconnect',
        JWT_SECRET: 'hireconnect-dev-super-secure-jwt-secret-key-32chars+',
        COOKIE_SECRET: 'b'.repeat(32)
      });
    }).toThrow(/JWT_SECRET must be set to a strong, unique secret/);
  });

  it('should reject development default COOKIE_SECRET in production mode', () => {
    expect(() => {
      validateEnv({
        PORT: '5000',
        NODE_ENV: 'production',
        MONGODB_URI: 'mongodb://127.0.0.1:27017/hireconnect',
        JWT_SECRET: 'a'.repeat(32),
        COOKIE_SECRET: 'hireconnect-dev-cookie-secret-key-32chars+'
      });
    }).toThrow(/COOKIE_SECRET must be set to a strong, unique secret/);
  });

  it('should successfully validate strong production configuration', () => {
    const config = validateEnv({
      PORT: '5000',
      NODE_ENV: 'production',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/hireconnect_prod',
      JWT_SECRET: 'f3b89088523c9135069720b0808b8b0e457f6b4d306b3bc4f3a9e3208031d2ba',
      COOKIE_SECRET: '74c0e66a33f4439c14833ce8e0018f3cb2925f6fa034e3e3b379e496a7eb1c28',
      COOKIE_SAME_SITE: 'strict',
      ENABLE_BACKGROUND_WORKER: 'false'
    });

    expect(config.NODE_ENV).toBe('production');
    expect(config.COOKIE_SAME_SITE).toBe('strict');
    expect(config.ENABLE_BACKGROUND_WORKER).toBe(false);
  });
});
