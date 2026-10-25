/**
 * Standalone Background Reminder Worker for HireConnect
 * Runs independently from HTTP web servers in multi-instance or containerized environments.
 *
 * Usage:
 *   node backend/src/workers/reminderWorker.js
 *   npm run worker:reminders (from backend directory)
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { env } = require('../config/env');
const { connectDatabase, disconnectDatabase } = require('../config/database');
const reminderService = require('../services/reminder.service');
const logger = require('../utils/logger');

let isTerminating = false;

async function handleShutdown(signal) {
  if (isTerminating) return;
  isTerminating = true;

  logger.info(`[ReminderWorker] Received ${signal}. Stopping scheduler and disconnecting...`);
  try {
    reminderService.stopScheduler();
    await disconnectDatabase();
    logger.info('[ReminderWorker] Worker gracefully stopped. Exiting.');
    process.exit(0);
  } catch (err) {
    logger.error('[ReminderWorker] Error during shutdown:', { error: err.message });
    process.exit(1);
  }
}

async function startWorker() {
  logger.info('='.repeat(60));
  logger.info('  HireConnect Standalone Reminder Worker Starting');
  logger.info(`  Environment: ${env.NODE_ENV}`);
  logger.info('='.repeat(60));

  try {
    if (env.MONGODB_URI) {
      await connectDatabase(env.MONGODB_URI);
      logger.info('[ReminderWorker] Database connected.');
    } else {
      logger.warn('[ReminderWorker] MONGODB_URI not set. Running against memory adapter.');
    }

    // Start polling loop every 5 minutes (300,000 ms)
    reminderService.startScheduler(300000);
    logger.info('[ReminderWorker] Background scheduler is active.');

    process.once('SIGTERM', () => handleShutdown('SIGTERM'));
    process.once('SIGINT', () => handleShutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('[ReminderWorker] Unhandled rejection:', {
        reason: reason instanceof Error ? reason.message : reason
      });
    });

    process.on('uncaughtException', (err) => {
      logger.error('[ReminderWorker] Uncaught exception:', { error: err.message });
      handleShutdown('uncaughtException');
    });
  } catch (startupErr) {
    logger.error('[ReminderWorker] Fatal worker startup error:', { error: startupErr.message });
    process.exit(1);
  }
}

if (require.main === module) {
  startWorker();
}

module.exports = { startWorker, handleShutdown };
