/**
 * Vercel Serverless Entry Point for HireConnect Backend
 * Wraps the Express app and caches the MongoDB connection across invocations.
 * Vercel re-uses warm Lambda containers, so caching avoids reconnecting on every request.
 */

'use strict';

const mongoose = require('mongoose');
const { connectDatabase } = require('../src/config/database');
const app = require('../src/app');

// Cached connection reference — survives across warm invocations
let cachedConnection = null;

async function connectWithCache() {
  // Return early if Mongoose is already connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not configured in Vercel project settings.');
  }

  // Reduced pool size is appropriate for short-lived serverless functions
  cachedConnection = await connectDatabase(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false
  });

  return cachedConnection;
}

/**
 * Main Vercel handler — called on every incoming HTTP request
 */
module.exports = async (req, res) => {
  try {
    await connectWithCache();
  } catch (err) {
    console.error('[Vercel] MongoDB connection failed:', err.message);
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable — database connection failed.',
      code: 'DB_UNAVAILABLE'
    });
    return;
  }

  // Delegate to the Express application
  return app(req, res);
};
