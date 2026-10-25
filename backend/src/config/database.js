/**
 * MongoDB connection management using Mongoose
 * Handles connection lifecycle, event monitoring, state inspection, and graceful shutdown.
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnectedBefore = false;
let listenersRegistered = false;
let stateOverride = null;

/**
 * Register connection lifecycle listeners (once)
 */
function registerConnectionListeners() {
  if (listenersRegistered) return;
  listenersRegistered = true;

  mongoose.connection.on('connected', () => {
    isConnectedBefore = true;
    logger.info('MongoDB connection established successfully');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error occurred:', {
      error: err.message
    });
  });

  mongoose.connection.on('disconnected', () => {
    if (isConnectedBefore) {
      logger.warn('MongoDB connection lost. Reconnection in progress...');
    } else {
      logger.debug('MongoDB connection closed');
    }
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected successfully');
  });
}

/**
 * Test helper to override connection state without monkey-patching Mongoose internals
 * @param {object|null} override
 */
function setConnectionStateOverride(override) {
  stateOverride = override;
}

/**
 * Get the current MongoDB connection state and readiness
 * @returns {{ isConnected: boolean, status: string, readyState: number }}
 */
function getConnectionState() {
  if (stateOverride !== null) {
    return stateOverride;
  }

  const readyState = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return {
    isConnected: readyState === 1,
    status: stateMap[readyState] || 'unknown',
    readyState
  };
}

/**
 * Connect to MongoDB with timeout and safe error reporting
 * @param {string} uri - MongoDB connection string
 * @param {object} [options={}] - Optional mongoose connect options
 * @returns {Promise<typeof mongoose>}
 */
async function connectDatabase(uri, options = {}) {
  registerConnectionListeners();

  if (!uri) {
    throw new Error('Database connection failed: MONGODB_URI is undefined or empty');
  }

  const safeUri = logger.redactConnectionString(uri);

  const defaultOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 50,
    minPoolSize: 5,
    autoIndex: process.env.NODE_ENV !== 'production',
    ...options
  };

  try {
    logger.info(`Connecting to MongoDB at: ${safeUri}`);
    const connection = await mongoose.connect(uri, defaultOptions);
    return connection;
  } catch (error) {
    logger.error(`Initial MongoDB connection failed at ${safeUri}:`, {
      message: error.message
    });
    throw error;
  }
}

/**
 * Gracefully disconnect from MongoDB
 * @returns {Promise<void>}
 */
async function disconnectDatabase() {
  try {
    if (mongoose.connection.readyState !== 0) {
      logger.info('Closing MongoDB connection...');
      await mongoose.connection.close(false);
      logger.info('MongoDB connection closed successfully');
    }
  } catch (error) {
    logger.error('Error occurred while disconnecting MongoDB:', {
      error: error.message
    });
    throw error;
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
  getConnectionState,
  setConnectionStateOverride
};
