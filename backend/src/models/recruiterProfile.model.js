/**
 * Mongoose RecruiterProfile Model for HireConnect
 * Stores corporate recruiter, talent acquisition, and company association details.
 */

const mongoose = require('mongoose');

const recruiterActivitySchema = new mongoose.Schema(
  {
    totalJobsPosted: {
      type: Number,
      default: 0
    },
    activeJobsCount: {
      type: Number,
      default: 0
    },
    totalApplications: {
      type: Number,
      default: 0
    },
    reviewedApplications: {
      type: Number,
      default: 0
    },
    interviewsScheduled: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: 120,
      default: 'Technical Recruiter'
    },
    department: {
      type: String,
      trim: true,
      maxlength: 120,
      default: 'Talent Acquisition'
    },
    professionalSummary: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: 'Bengaluru, Karnataka'
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: ''
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: null
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null
    },
    companyName: {
      type: String,
      trim: true,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    activity: {
      type: recruiterActivitySchema,
      default: () => ({})
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        ret.title = ret.title || ret.jobTitle || '';
        ret.bio = ret.bio || ret.professionalSummary || '';
        ret.linkedin = ret.linkedin || ret.linkedinUrl || '';
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Virtual aliases for frontend compatibility
recruiterProfileSchema.virtual('title').get(function () {
  return this.jobTitle;
}).set(function (v) {
  this.jobTitle = v;
});

recruiterProfileSchema.virtual('bio').get(function () {
  return this.professionalSummary;
}).set(function (v) {
  this.professionalSummary = v;
});

// =========================================================================
// In-Memory Fallback Adapter (for dev/test environments without MongoDB daemon)
// =========================================================================
const memoryStore = new Map();

class MemoryQuery {
  constructor(resultPromise) {
    this.resultPromise = resultPromise;
  }
  populate() {
    return this;
  }
  select() {
    return this;
  }
  then(resolve, reject) {
    return this.resultPromise.then(resolve, reject);
  }
  catch(reject) {
    return this.resultPromise.catch(reject);
  }
  finally(callback) {
    return this.resultPromise.finally(callback);
  }
}

function matchQuery(doc, query) {
  for (const [key, val] of Object.entries(query)) {
    if (key === '_id' || key === 'id') {
      if (doc._id.toString() !== val.toString()) return false;
    } else if (key === 'user') {
      if (doc.user.toString() !== val.toString()) return false;
    } else if (doc[key] !== val) {
      return false;
    }
  }
  return true;
}

const originalSave = mongoose.Model.prototype.save;
recruiterProfileSchema.method(
  'save',
  async function (options) {
    if (mongoose.connection.readyState === 1) {
      return originalSave.call(this, options);
    }
    await this.validate();
    this.updatedAt = new Date();
    if (!this.createdAt) this.createdAt = new Date();
    memoryStore.set(this.user.toString(), this);
    return this;
  },
  { suppressWarning: true }
);

const RecruiterProfile =
  mongoose.models.RecruiterProfile || mongoose.model('RecruiterProfile', recruiterProfileSchema);

const nativeFindOne = RecruiterProfile.findOne;
RecruiterProfile.findOne = function (query, projection, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeFindOne.call(RecruiterProfile, query, projection, options);
  }
  const promise = Promise.resolve().then(() => {
    for (const doc of memoryStore.values()) {
      if (matchQuery(doc, query)) {
        return doc;
      }
    }
    return null;
  });
  return new MemoryQuery(promise);
};

RecruiterProfile.__clearMemoryStore = function () {
  memoryStore.clear();
};

module.exports = RecruiterProfile;
