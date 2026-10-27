/**
 * Vercel Cron Handler — Interview Reminder Processor
 * Route: GET /api/cron/reminders
 * Scheduled via vercel.json crons config.
 *
 * ⚠️ Vercel Hobby Plan Limitation:
 *   Cron jobs on the Hobby plan run at most once per day.
 *   For the 1-hour reminder window to work correctly, upgrade to Vercel Pro
 *   (supports schedules up to every 1 minute).
 *
 * Security: Requests must include the CRON_SECRET header set in Vercel env.
 */

'use strict';

const mongoose = require('mongoose');
const { connectDatabase } = require('../../src/config/database');
const reminderService = require('../../src/services/reminder.service');

let cachedConnection = null;

async function connectWithCache() {
  if (cachedConnection && mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not configured');
  cachedConnection = await connectDatabase(uri, {
    maxPoolSize: 5,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false
  });
}

module.exports = async (req, res) => {
  // Only allow GET requests (Vercel cron always uses GET)
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Verify CRON_SECRET to prevent unauthorized external calls
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers['authorization'];
  if (secret && authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    await connectWithCache();
    const result = await reminderService.processUpcomingMeetingReminders();
    console.log('[Cron] Reminder sweep complete:', result);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error('[Cron] Reminder sweep failed:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};
