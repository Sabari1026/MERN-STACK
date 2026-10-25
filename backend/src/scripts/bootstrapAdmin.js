/**
 * Admin Bootstrap CLI Script for HireConnect (Phase 10)
 * Safely initializes or verifies the primary platform administrator account without exposing public endpoints.
 *
 * Usage:
 *   node backend/src/scripts/bootstrapAdmin.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const logger = require('../utils/logger');

async function bootstrapAdmin() {
  const adminEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@hireconnect.io').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'Admin@123';
  const adminName = process.env.ADMIN_BOOTSTRAP_NAME || 'Platform Administrator';

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.ADMIN_BOOTSTRAP_PASSWORD || adminPassword === 'Admin@123') {
      logger.error('[Bootstrap Error] In production mode, ADMIN_BOOTSTRAP_PASSWORD must be explicitly provided and cannot use the default "Admin@123".');
      process.exit(1);
    }
    if (adminPassword.length < 10) {
      logger.error('[Bootstrap Error] In production mode, ADMIN_BOOTSTRAP_PASSWORD must be at least 10 characters long.');
      process.exit(1);
    }
  }

  const mongoUri = process.env.MONGODB_URI;
  let connected = false;

  if (process.env.NODE_ENV === 'production' && !mongoUri) {
    logger.error('[Bootstrap Error] MONGODB_URI is strictly required in production mode.');
    process.exit(1);
  }

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      connected = true;
      logger.info('[Bootstrap] Connected to MongoDB.');
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'production') {
        logger.error(`[Bootstrap Error] Cannot connect to production MongoDB database: ${dbErr.message}`);
        process.exit(1);
      }
      logger.warn(`[Bootstrap] MongoDB daemon not reachable: ${dbErr.message}. Operating against memory store.`);
    }
  }

  try {
    let existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        logger.info(`[Bootstrap] Promoted existing user ${adminEmail} to administrator.`);
      } else {
        logger.info(`[Bootstrap] Administrator account ${adminEmail} is already active.`);
      }
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      existingAdmin = await User.create({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: 'admin',
        accountStatus: 'active',
        emailVerifiedAt: new Date()
      });
      logger.info(`[Bootstrap] Successfully created primary platform administrator: ${adminEmail}`);
    }

    console.log('='.repeat(60));
    console.log('  HireConnect Administrator Account Verified');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Role:  ${existingAdmin.role}`);
    console.log(`  State: ${existingAdmin.accountStatus}`);
    console.log('='.repeat(60));
  } catch (err) {
    logger.error(`[Bootstrap] Error during administrator setup: ${err.message}`);
    process.exitCode = 1;
  } finally {
    if (connected) {
      await mongoose.disconnect();
    }
  }
}

if (require.main === module) {
  bootstrapAdmin();
}

module.exports = bootstrapAdmin;
