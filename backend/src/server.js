/**
 * Server Entrypoint for HireConnect Backend
 * Manages database initialization, HTTP listener lifecycle, and graceful shutdown.
 */

const http = require('http');
const app = require('./app');
const { env } = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/database');
const reminderService = require('./services/reminder.service');
const logger = require('./utils/logger');

let server = null;
let isShuttingDown = false;

/**
 * Graceful termination handler for SIGINT and SIGTERM
 * @param {string} signal
 */
async function handleShutdown(signal) {
  if (isShuttingDown) {
    logger.warn(`Shutdown already in progress. Ignoring duplicate signal: ${signal}`);
    return;
  }
  isShuttingDown = true;

  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  // Force exit safety timeout (10 seconds)
  const forceExitTimeout = setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing process exit.');
    process.exit(1);
  }, 10000);
  forceExitTimeout.unref();

  try {
    // 0. Stop background workers
    reminderService.stopScheduler();

    // 1. Stop accepting new HTTP connections
    if (server) {
      await new Promise((resolve) => {
        server.close((err) => {
          if (err) {
            logger.error('Error during HTTP server close:', { error: err.message });
          } else {
            logger.info('HTTP server closed successfully');
          }
          resolve();
        });
      });
    }

    // 2. Disconnect database
    await disconnectDatabase();

    logger.info('Graceful shutdown completed successfully. Exiting.');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', { error: error.message });
    process.exit(1);
  }
}

/**
 * Start the backend server
 */
async function startServer() {
  try {
    // 1. Establish database connection before accepting traffic
    if (env.MONGODB_URI) {
      try {
        await connectDatabase(env.MONGODB_URI);
      } catch (dbError) {
        if (env.NODE_ENV === 'production') {
          logger.error('Refusing to start production server without required database connection.');
          process.exit(1);
        } else {
          logger.warn(
            'Starting development server with database disconnected. Ensure MongoDB is running for full functionality.'
          );
        }
      }
    }

    // 2. Start HTTP Listener
    server = http.createServer(app);

    server.listen(env.PORT, () => {
      logger.info(`HireConnect Backend running at: http://localhost:${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Health check: http://localhost:${env.PORT}/api/health`);
      logger.info(`Readiness probe: http://localhost:${env.PORT}/api/health/ready`);

      // Start background workers if enabled and in non-test mode
      if (env.NODE_ENV !== 'test' && env.ENABLE_BACKGROUND_WORKER) {
        reminderService.startScheduler();
      }
    });

    server.on('error', (err) => {
      logger.error('HTTP Server listener error:', { error: err.message });
      process.exit(1);
    });

    // 3. Register process termination signals
    process.once('SIGTERM', () => handleShutdown('SIGTERM'));
    process.once('SIGINT', () => handleShutdown('SIGINT'));

    // Handle unexpected exceptions
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection detected:', {
        reason: reason instanceof Error ? reason.message : reason,
        stack: reason instanceof Error ? reason.stack : undefined
      });
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception detected:', {
        error: err.message,
        stack: err.stack
      });
      handleShutdown('uncaughtException');
    });

    return server;
  } catch (startupError) {
    logger.error('Fatal startup error encountered:', { error: startupError.message });
    process.exit(1);
  }
}

// Automatically start if executed directly
if (require.main === module) {
  startServer();
}

module.exports = {
  startServer,
  handleShutdown,
  getServer: () => server
};
