/**
 * Database Index Synchronization & Production Readiness Script
 * Ensures all compound, unique, text, and sparse indexes are built in MongoDB Atlas / production.
 *
 * Usage:
 *   node backend/src/scripts/ensureIndexes.js
 *   npm run db:indexes (from backend directory)
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Import all models to register schemas
const User = require('../models/user.model');
const Company = require('../models/company.model');
const CompanyMembership = require('../models/companyMembership.model');
const Job = require('../models/job.model');
const Application = require('../models/application.model');
const SavedJob = require('../models/savedJob.model');
const Meeting = require('../models/meeting.model');
const Notification = require('../models/notification.model');
const NotificationOutbox = require('../models/notificationOutbox.model');
const ResumeAsset = require('../models/resumeAsset.model');
const CandidateProfile = require('../models/candidateProfile.model');
const RecruiterProfile = require('../models/recruiterProfile.model');
const AdminAuditLog = require('../models/adminAuditLog.model');

const models = [
  { name: 'User', model: User },
  { name: 'Company', model: Company },
  { name: 'CompanyMembership', model: CompanyMembership },
  { name: 'Job', model: Job },
  { name: 'Application', model: Application },
  { name: 'SavedJob', model: SavedJob },
  { name: 'Meeting', model: Meeting },
  { name: 'Notification', model: Notification },
  { name: 'NotificationOutbox', model: NotificationOutbox },
  { name: 'ResumeAsset', model: ResumeAsset },
  { name: 'CandidateProfile', model: CandidateProfile },
  { name: 'RecruiterProfile', model: RecruiterProfile },
  { name: 'AdminAuditLog', model: AdminAuditLog }
];

async function ensureIndexes() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hireconnect';
  const safeUri = logger.redactConnectionString(mongoUri);

  console.log('='.repeat(65));
  console.log('  HireConnect Production Database Index Verification');
  console.log(`  Connecting to: ${safeUri}`);
  console.log('='.repeat(65));

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Indexes] Connected to MongoDB successfully.\n');

    for (const { name, model } of models) {
      if (model && model.createIndexes) {
        try {
          await model.createIndexes();
          const indexes = await model.collection.indexes();
          console.log(`  [OK] ${name.padEnd(20)} (${indexes.length} indexes verified)`);
        } catch (idxErr) {
          console.warn(`  [WARN] ${name.padEnd(20)} ${idxErr.message}`);
        }
      }
    }

    console.log('\n' + '='.repeat(65));
    console.log('  Database Index Synchronization Completed Successfully');
    console.log('='.repeat(65));
  } catch (err) {
    logger.error('[Indexes] Error building indexes:', { error: err.message });
    console.error('\n[Error] Failed to connect to MongoDB or build indexes:', err.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

if (require.main === module) {
  ensureIndexes();
}

module.exports = ensureIndexes;
