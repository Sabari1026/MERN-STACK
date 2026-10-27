/**
 * Mongoose CandidateProfile Model for HireConnect
 * Stores comprehensive professional, educational, and preference data for candidates.
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Advanced'
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    }
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    qualification: {
      type: String,
      trim: true,
      maxlength: 100
    },
    degree: {
      type: String,
      trim: true,
      maxlength: 100
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: 100
    },
    year: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    isCurrent: {
      type: Boolean,
      default: false
    },
    grade: {
      type: String,
      trim: true,
      maxlength: 50
    }
  },
  {
    _id: false,
    toJSON: {
      transform(doc, ret) {
        ret.degree = ret.degree || ret.qualification || '';
        ret.qualification = ret.qualification || ret.degree || '';
        return ret;
      }
    }
  }
);

const experienceSchema = new mongoose.Schema(
  {
    employer: {
      type: String,
      trim: true,
      maxlength: 120
    },
    company: {
      type: String,
      trim: true,
      maxlength: 120
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: 100
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time'
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    isCurrent: {
      type: Boolean,
      default: false
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000
    }
  },
  {
    _id: false,
    toJSON: {
      transform(doc, ret) {
        ret.company = ret.company || ret.employer || '';
        ret.employer = ret.employer || ret.company || '';
        ret.title = ret.title || ret.jobTitle || '';
        ret.jobTitle = ret.jobTitle || ret.title || '';
        ret.current = ret.current !== undefined ? ret.current : ret.isCurrent;
        ret.isCurrent = ret.isCurrent !== undefined ? ret.isCurrent : ret.current;
        return ret;
      }
    }
  }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    technologies: {
      type: [String],
      default: []
    },
    projectUrl: {
      type: String,
      trim: true
    },
    githubUrl: {
      type: String,
      trim: true
    },
    liveUrl: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    issuer: {
      type: String,
      trim: true,
      maxlength: 120
    },
    date: {
      type: String,
      trim: true
    },
    credentialId: {
      type: String,
      trim: true
    },
    credentialUrl: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    headline: {
      type: String,
      trim: true,
      maxlength: 200,
      default: 'Software Engineer'
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    bio: {
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
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: 'Bengaluru, Karnataka'
    },
    preferredLocations: {
      type: [String],
      default: ['Bengaluru, Karnataka', 'Remote - India']
    },
    preferredWorkModes: {
      type: [String],
      enum: ['remote', 'hybrid', 'onsite'],
      default: ['hybrid', 'remote']
    },
    preferredEmploymentTypes: {
      type: [String],
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: ['full-time']
    },
    desiredTitles: {
      type: [String],
      default: ['Software Engineer']
    },
    expectedSalary: {
      type: String,
      trim: true,
      default: ''
    },
    noticePeriod: {
      type: String,
      enum: ['Immediate', '15 Days', '30 Days', '60 Days', '90 Days'],
      default: '30 Days'
    },
    skills: {
      type: [skillSchema],
      default: []
    },
    education: {
      type: [educationSchema],
      default: []
    },
    experience: {
      type: [experienceSchema],
      default: []
    },
    projects: {
      type: [projectSchema],
      default: []
    },
    certifications: {
      type: [certificationSchema],
      default: []
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: ''
    },
    githubUrl: {
      type: String,
      trim: true,
      default: ''
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
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeAsset',
      default: null
    },
    resumeVisibility: {
      type: String,
      enum: ['private', 'verified_recruiters', 'public'],
      default: 'private'
    },
    discoverability: {
      type: Boolean,
      default: false
    },
    isDiscoverable: {
      type: Boolean,
      default: false
    },
    profileVisibility: {
      type: String,
      enum: ['private', 'verified_recruiters', 'public'],
      default: 'private'
    },
    hideContactInfo: {
      type: Boolean,
      default: false
    },
    completionPercentage: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        const uid = ret.user ? (ret.user._id ? ret.user._id.toString() : ret.user.toString()) : '';
        ret.userId = uid;
        ret.summary = ret.summary || ret.bio || '';
        ret.bio = ret.summary;
        ret.discoverability = ret.discoverability !== undefined ? Boolean(ret.discoverability) : Boolean(ret.isDiscoverable);
        ret.isDiscoverable = ret.discoverability;
        ret.privacy = {
          isDiscoverable: ret.discoverability,
          profileVisibility: ret.profileVisibility || 'private',
          allowResumeDownload: ret.resumeVisibility === 'verified_recruiters' || ret.resumeVisibility === 'public',
          hideContactInfo: Boolean(ret.hideContactInfo)
        };
        if (ret.resume && typeof ret.resume === 'object') {
          ret.resume.fileName = ret.resume.fileName || ret.resume.originalFilename || 'Resume.pdf';
          ret.resume.fileSize = ret.resume.fileSize != null ? ret.resume.fileSize : ret.resume.sizeBytes;
          ret.resume.fileUrl = ret.resume.fileUrl || (uid ? `/api/profile/resume/download/${uid}` : '');
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Calculate completeness
candidateProfileSchema.methods.calculateCompleteness = function () {
  let score = 0;
  const completedFields = [];
  const incompleteRecommendedFields = [];

  if (this.headline && this.headline.trim().length > 0) {
    score += 15;
    completedFields.push('headline');
  } else {
    incompleteRecommendedFields.push('headline');
  }

  if (this.summary && this.summary.trim().length > 20) {
    score += 15;
    completedFields.push('summary');
  } else {
    incompleteRecommendedFields.push('summary');
  }

  if (this.skills && this.skills.length >= 3) {
    score += 20;
    completedFields.push('skills');
  } else {
    incompleteRecommendedFields.push('skills (at least 3)');
  }

  if (this.experience && this.experience.length >= 1) {
    score += 20;
    completedFields.push('experience');
  } else {
    incompleteRecommendedFields.push('work experience');
  }

  if (this.education && this.education.length >= 1) {
    score += 15;
    completedFields.push('education');
  } else {
    incompleteRecommendedFields.push('education');
  }

  if (this.resume) {
    score += 15;
    completedFields.push('resume');
  } else {
    incompleteRecommendedFields.push('resume');
  }

  this.completionPercentage = score;
  return {
    completionPercentage: score,
    completedFields,
    incompleteRecommendedFields
  };
};

// =========================================================================
// In-Memory Fallback Adapter (for dev/test environments without MongoDB daemon)
// =========================================================================
const memoryStore = new Map();

class MemoryQuery {
  constructor(resultPromise) {
    this.resultPromise = resultPromise;
  }
  populate(field) {
    const p = this.resultPromise.then(async (doc) => {
      if (!doc) return null;
      if (field === 'resume' && doc.resume) {
        const ResumeAsset = require('./resumeAsset.model');
        const resumeDoc = await ResumeAsset.findById(doc.resume);
        if (resumeDoc) {
          doc.resume = resumeDoc;
        }
      }
      return doc;
    });
    return new MemoryQuery(p);
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
  if (query.$or && Array.isArray(query.$or)) {
    return query.$or.some((subQuery) => matchQuery(doc, subQuery));
  }
  for (const [key, val] of Object.entries(query)) {
    if (key === '_id' || key === 'id') {
      const docId = doc._id ? doc._id.toString() : doc.id;
      if (docId !== val.toString()) return false;
    } else if (key === 'user' || key === 'userId') {
      const docUser = doc.user ? (doc.user._id ? doc.user._id.toString() : doc.user.toString()) : doc.userId;
      const targetUser = val._id ? val._id.toString() : val.toString();
      if (docUser !== targetUser) return false;
    } else if (doc[key] !== val) {
      return false;
    }
  }
  return true;
}

const originalSave = mongoose.Model.prototype.save;
candidateProfileSchema.method(
  'save',
  async function (options) {
    if (this.bio !== undefined && !this.summary) {
      this.summary = this.bio;
    } else if (this.summary !== undefined && !this.bio) {
      this.bio = this.summary;
    }
    if (this.isDiscoverable !== undefined) {
      this.discoverability = Boolean(this.isDiscoverable);
    } else if (this.discoverability !== undefined) {
      this.isDiscoverable = Boolean(this.discoverability);
    }
    this.calculateCompleteness();
    if (mongoose.connection.readyState === 1) {
      return originalSave.call(this, options);
    }
    if (process.env.NODE_ENV !== 'test' && process.env.MONGODB_URI && mongoose.connection.readyState !== 1) {
      const err = new Error('Database write failed: Persistent database connection is not active.');
      err.code = 'DATABASE_DISCONNECTED';
      err.statusCode = 503;
      throw err;
    }
    await this.validate();
    this.updatedAt = new Date();
    if (!this.createdAt) this.createdAt = new Date();
    memoryStore.set(this.user.toString(), this);
    return this;
  },
  { suppressWarning: true }
);

const CandidateProfile =
  mongoose.models.CandidateProfile || mongoose.model('CandidateProfile', candidateProfileSchema);

const nativeFindOne = CandidateProfile.findOne;
CandidateProfile.findOne = function (query, projection, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeFindOne.call(CandidateProfile, query, projection, options);
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

CandidateProfile.findById = function (id, projection, options) {
  if (mongoose.connection.readyState === 1) {
    return CandidateProfile.findOne({ _id: id }, projection, options);
  }
  const promise = Promise.resolve().then(() => {
    for (const doc of memoryStore.values()) {
      if (doc._id.toString() === String(id) || doc.id === String(id)) {
        return doc;
      }
    }
    return null;
  });
  return new MemoryQuery(promise);
};

const nativeFind = CandidateProfile.find;
CandidateProfile.find = function (query, projection, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeFind.call(CandidateProfile, query, projection, options);
  }
  const promise = Promise.resolve().then(() => {
    const list = [];
    for (const doc of memoryStore.values()) {
      if (!query || matchQuery(doc, query)) {
        list.push(doc);
      }
    }
    return list;
  });
  return new MemoryQuery(promise);
};

const nativeCreate = CandidateProfile.create;
CandidateProfile.create = async function (docs, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeCreate.call(CandidateProfile, docs, options);
  }
  if (Array.isArray(docs)) {
    const list = [];
    for (const d of docs) {
      const doc = new CandidateProfile(d);
      await doc.save();
      list.push(doc);
    }
    return list;
  }
  const doc = new CandidateProfile(docs);
  await doc.save();
  return doc;
};

CandidateProfile.__clearMemoryStore = function () {
  memoryStore.clear();
};

module.exports = CandidateProfile;
