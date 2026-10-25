/**
 * Environment configuration loader and validator for HireConnect
 * Uses Zod to ensure all necessary runtime configuration is valid.
 */

const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');
const logger = require('../utils/logger');

// Load .env from backend root or parent if present
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Define environment schema
const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 65535, {
      message: 'PORT must be an integer between 1 and 65535'
    }),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  MONGODB_URI: z
    .string()
    .optional()
    .default('mongodb://127.0.0.1:27017/hireconnect'),

  FRONTEND_URL: z
    .string()
    .default('http://localhost:5173,http://localhost:3000')
    .transform((val) =>
      val
        .split(',')
        .map((origin) => origin.trim().replace(/\/+$/, ''))
        .filter(Boolean)
    ),

  // Authentication & Security Configuration
  JWT_SECRET: z
    .string()
    .default('hireconnect-dev-super-secure-jwt-secret-key-32chars+'),

  JWT_EXPIRES_IN: z
    .string()
    .default('15m'),

  REFRESH_TOKEN_EXPIRES_IN: z
    .string()
    .default('7d'),

  COOKIE_SECRET: z
    .string()
    .default('hireconnect-dev-cookie-secret-key-32chars+'),

  COOKIE_SAME_SITE: z
    .enum(['lax', 'strict', 'none'])
    .default('lax'),

  ENABLE_BACKGROUND_WORKER: z
    .union([z.boolean(), z.string()])
    .default(true)
    .transform((val) => val === true || val === 'true' || val === '1'),

  // Storage Configuration (Phase 3 & Production Setup)
  STORAGE_PROVIDER: z
    .enum(['local', 's3', 'memory'])
    .default('local'),

  UPLOAD_DIR: z
    .string()
    .default('./uploads'),

  // Optional Cloud Object Storage (S3 / Cloudflare R2 / MinIO)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_S3_ENDPOINT: z.string().optional(),

  // Optional OAuth & Email Provider Configuration
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional().default('noreply@hireconnect.io'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_SECURE: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  PASSWORD_RESET_URL: z.string().optional().default('http://localhost:3000/reset-password')
});

/**
 * Validate given environment dictionary
 * @param {object} [source=process.env]
 * @returns {object} validated config
 */
function validateEnv(source = process.env) {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const errorMessages = result.error.errors.map(
      (err) => `  - ${err.path.join('.')}: ${err.message}`
    );
    const formattedError = `[Configuration Error] Invalid environment variables:\n${errorMessages.join('\n')}`;

    // Redact connection strings or tokens before logging
    logger.error(formattedError);
    throw new Error(formattedError);
  }

  // Additional production enforcement: database and security secrets
  if (result.data.NODE_ENV === 'production') {
    if (!result.data.MONGODB_URI) {
      const msg = '[Configuration Error] MONGODB_URI is strictly required in production mode';
      logger.error(msg);
      throw new Error(msg);
    }

    if (
      !result.data.JWT_SECRET ||
      result.data.JWT_SECRET === 'hireconnect-dev-super-secure-jwt-secret-key-32chars+' ||
      result.data.JWT_SECRET.length < 32
    ) {
      const msg =
        '[Configuration Error] In production mode, JWT_SECRET must be set to a strong, unique secret of at least 32 characters. Run `node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"` to generate one.';
      logger.error(msg);
      throw new Error(msg);
    }

    if (
      !result.data.COOKIE_SECRET ||
      result.data.COOKIE_SECRET === 'hireconnect-dev-cookie-secret-key-32chars+' ||
      result.data.COOKIE_SECRET.length < 32
    ) {
      const msg =
        '[Configuration Error] In production mode, COOKIE_SECRET must be set to a strong, unique secret of at least 32 characters. Run `node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"` to generate one.';
      logger.error(msg);
      throw new Error(msg);
    }

    if (
      Array.isArray(result.data.FRONTEND_URL) &&
      result.data.FRONTEND_URL.every((u) => u.includes('localhost') || u.includes('127.0.0.1'))
    ) {
      logger.warn(
        '[Configuration Warning] In production mode, FRONTEND_URL is still configured with localhost. Update FRONTEND_URL to your deployed production domain (e.g. https://hireconnect.io).'
      );
    }
  }

  return result.data;
}

let env;
try {
  env = validateEnv(process.env);
} catch (error) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(error.message);
    process.exit(1);
  }
  // Fallback safe dummy for unit test runs that test invalid env explicitly
  env = {
    PORT: 5000,
    NODE_ENV: 'test',
    MONGODB_URI: 'mongodb://127.0.0.1:27017/hireconnect_test',
    FRONTEND_URL: ['http://localhost:5173', 'http://localhost:3000']
  };
}

module.exports = {
  env,
  validateEnv,
  envSchema
};
