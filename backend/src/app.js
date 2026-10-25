/**
 * Express Application Configuration for HireConnect
 * Sets up security, CORS, request tracing, parsing, routing, and centralized error handling.
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { env } = require('./config/env');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { mongoSanitize } = require('./middleware/sanitize');
const { apiLimiter } = require('./middleware/rateLimiter');
const apiRoutes = require('./routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

// Enable reverse proxy trust in production (for accurate client IPs behind Render, AWS ALB, Cloudflare, etc.)
if (env.NODE_ENV === 'production' || process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

// Disable x-powered-by header
app.disable('x-powered-by');

// 1. Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// 2. Request Correlation ID & Structured Logger
app.use(requestLogger);

// 3. CORS Configuration
const allowedOrigins = Array.isArray(env.FRONTEND_URL)
  ? env.FRONTEND_URL
  : [env.FRONTEND_URL];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (server-to-server, health checks, curl)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isLocalDev =
      env.NODE_ENV !== 'production' &&
      (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'));

    if (isExplicitlyAllowed || isLocalDev) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not permitted by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'Accept']
};

app.use(cors(corsOptions));

// 4. Request Body Parsers, Sanitization & Cookie Parser with safe limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(mongoSanitize);

// 5. Mount API Routes with Rate Limiting
app.use('/api', apiLimiter);
app.use('/api', apiRoutes);

// Direct mount alias for orchestration health probes (e.g. Docker/Kubernetes hitting /health)
app.use('/health', healthRoutes);

// 6. Handle unmatched routes with standard 404
app.use(notFound);

// 7. Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
