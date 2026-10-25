/**
 * Mongoose Application Model for HireConnect
 * Stores job applications, immutable resume snapshots, candidate snapshots,
 * auditable status history, and internal recruiter evaluation notes.
 */

const mongoose = require('mongoose');

const applicationStatusHistorySchema = new mongoose.Schema(
  {
    fromStatus: {
      type: String,
      default: null
    },
    toStatus: {
      type: String,
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    changedByName: {
      type: String,
      trim: true,
      default: ''
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const recruiterNoteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      trim: true,
      default: ''
    },
    text: {
      type: String,
      trim: true,
      required: true,
      maxlength: [2000, 'Note text cannot exceed 2000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate user reference is required'],
      index: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
      index: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
      index: true
    },
    candidateProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CandidateProfile',
      default: null
    },
    status: {
      type: String,
      enum: ['applied', 'under_review', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
      default: 'applied',
      index: true
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [5000, 'Cover letter cannot exceed 5000 characters'],
      default: ''
    },
    coverNote: {
      type: String,
      trim: true,
      default: ''
    },
    answers: {
      type: [
        {
          question: { type: String, trim: true },
          answer: { type: String, trim: true }
        }
      ],
      default: []
    },
    resumeSnapshot: {
      assetId: { type: String, default: null },
      fileName: { type: String, trim: true, default: '' },
      fileUrl: { type: String, trim: true, default: '' },
      fileType: { type: String, trim: true, default: 'application/pdf' },
      fileSize: { type: Number, default: 0 },
      storageKey: { type: String, trim: true, default: '' },
      uploadedAt: { type: Date, default: Date.now }
    },
    candidateSnapshot: {
      name: { type: String, trim: true, default: '' },
      headline: { type: String, trim: true, default: '' },
      location: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
      summary: { type: String, trim: true, default: '' }
    },
    statusHistory: {
      type: [applicationStatusHistorySchema],
      default: []
    },
    notes: {
      type: [recruiterNoteSchema],
      default: []
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    lastStatusChangedAt: {
      type: Date,
      default: Date.now
    },
    withdrawnAt: {
      type: Date,
      default: null
    },
    source: {
      type: String,
      trim: true,
      default: 'HireConnect Platform'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound unique index ensuring one active/historical application per candidate per job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ company: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ candidate: 1, submittedAt: -1 });

// Safe public serialization for candidate view (redacting internal recruiter notes)
applicationSchema.methods.toCandidateJSON = function () {
  const obj = this.toJSON ? this.toJSON() : this;
  const clone = { ...obj };
  delete clone.notes;
  if (clone.resumeSnapshot) {
    const resumeCopy = { ...clone.resumeSnapshot };
    delete resumeCopy.storageKey;
    clone.resumeSnapshot = resumeCopy;
  }
  clone.jobTitle = this.job?.title || clone.jobTitle || '';
  clone.companyName = this.company?.name || clone.companyName || '';
  clone.appliedAt = clone.submittedAt || clone.appliedAt || clone.createdAt;
  clone.coverNote = clone.coverLetter || clone.coverNote || '';
  return clone;
};

// Recruiter serialization with full applicant details and internal notes
applicationSchema.methods.toRecruiterJSON = function () {
  const obj = this.toJSON ? this.toJSON() : this;
  const clone = { ...obj };
  if (clone.resumeSnapshot) {
    const resumeCopy = { ...clone.resumeSnapshot };
    delete resumeCopy.storageKey;
    clone.resumeSnapshot = resumeCopy;
  }
  clone.candidateName = clone.candidateSnapshot?.name || this.candidate?.name || 'Applicant';
  clone.candidateHeadline = clone.candidateSnapshot?.headline || 'Tech Professional';
  clone.candidateEmail = clone.candidateSnapshot?.email || this.candidate?.email || '';
  clone.jobTitle = this.job?.title || clone.jobTitle || '';
  clone.companyName = this.company?.name || clone.companyName || '';
  clone.appliedAt = clone.submittedAt || clone.appliedAt || clone.createdAt;
  clone.coverNote = clone.coverLetter || clone.coverNote || '';
  return clone;
};

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Fallback when MongoDB is disconnected)
// ============================================================================
const memoryApplications = new Map();

class MemoryApplicationDocument {
  constructor(data = {}) {
    const id = data._id ? data._id.toString() : (data.id || `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    this._id = id;
    this.id = id;
    this.candidate = data.candidate || null;
    this.candidateId = data.candidateId || (this.candidate ? (this.candidate._id ? this.candidate._id.toString() : this.candidate.toString()) : null);
    this.job = data.job || data.jobId || null;
    this.jobId = data.jobId || (this.job ? (this.job._id ? this.job._id.toString() : this.job.toString()) : null);
    this.company = data.company || data.companyId || null;
    this.companyId = data.companyId || (this.company ? (this.company._id ? this.company._id.toString() : this.company.toString()) : null);
    this.candidateProfile = data.candidateProfile || null;
    this.status = data.status || 'applied';
    this.coverLetter = data.coverLetter || data.coverNote || '';
    this.coverNote = this.coverLetter;
    this.answers = Array.isArray(data.answers) ? [...data.answers] : [];
    this.resumeSnapshot = data.resumeSnapshot ? { ...data.resumeSnapshot } : {
      assetId: null,
      fileName: 'Resume.pdf',
      fileUrl: '',
      fileType: 'application/pdf',
      fileSize: 0,
      storageKey: '',
      uploadedAt: new Date()
    };
    this.candidateSnapshot = data.candidateSnapshot ? { ...data.candidateSnapshot } : {};
    this.statusHistory = Array.isArray(data.statusHistory) ? [...data.statusHistory] : [
      {
        fromStatus: null,
        toStatus: this.status,
        changedBy: data.candidate || 'system',
        changedByName: data.candidateSnapshot?.name || 'Candidate',
        changedAt: new Date(),
        reason: 'Application submitted'
      }
    ];
    this.notes = Array.isArray(data.notes) ? [...data.notes] : [];
    this.submittedAt = data.submittedAt ? new Date(data.submittedAt) : new Date();
    this.lastStatusChangedAt = data.lastStatusChangedAt ? new Date(data.lastStatusChangedAt) : new Date();
    this.withdrawnAt = data.withdrawnAt ? new Date(data.withdrawnAt) : null;
    this.source = data.source || 'HireConnect Platform';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    this.coverNote = this.coverLetter;
    if (this.candidate) {
      this.candidateId = this.candidate._id ? this.candidate._id.toString() : this.candidate.toString();
    }
    if (this.job) {
      this.jobId = this.job._id ? this.job._id.toString() : this.job.toString();
    }
    if (this.company) {
      this.companyId = this.company._id ? this.company._id.toString() : this.company.toString();
    }

    // Check compound unique index { job, candidate }
    for (const [id, existing] of memoryApplications.entries()) {
      if (id !== this._id.toString()) {
        const existCand = existing.candidateId || (existing.candidate ? (existing.candidate._id ? existing.candidate._id.toString() : existing.candidate.toString()) : '');
        const existJob = existing.jobId || (existing.job ? (existing.job._id ? existing.job._id.toString() : existing.job.toString()) : '');
        const thisCand = this.candidateId;
        const thisJob = this.jobId;

        if (existCand && existJob && thisCand && thisJob && existCand === thisCand && existJob === thisJob) {
          const err = new Error('E11000 duplicate key error collection: applications index: job_1_candidate_1 dup key');
          err.code = 11000;
          throw err;
        }
      }
    }

    memoryApplications.set(this._id.toString(), this);
    return this;
  }

  toObject() {
    const copy = {};
    for (const k of Object.keys(this)) {
      copy[k] = this[k];
    }
    copy.id = this._id ? this._id.toString() : this.id;
    return copy;
  }

  toJSON() {
    return this.toObject();
  }

  toCandidateJSON() {
    const copy = this.toObject();
    delete copy.notes;
    if (copy.resumeSnapshot) {
      const resumeCopy = { ...copy.resumeSnapshot };
      delete resumeCopy.storageKey;
      copy.resumeSnapshot = resumeCopy;
    }
    copy.jobTitle = this.job?.title || copy.jobTitle || '';
    copy.companyName = this.company?.name || copy.companyName || '';
    copy.appliedAt = copy.submittedAt || copy.appliedAt || copy.createdAt;
    copy.coverNote = copy.coverLetter || copy.coverNote || '';
    return copy;
  }

  toRecruiterJSON() {
    const copy = this.toObject();
    if (copy.resumeSnapshot) {
      const resumeCopy = { ...copy.resumeSnapshot };
      delete resumeCopy.storageKey;
      copy.resumeSnapshot = resumeCopy;
    }
    copy.candidateName = copy.candidateSnapshot?.name || this.candidate?.name || 'Applicant';
    copy.candidateHeadline = copy.candidateSnapshot?.headline || 'Tech Professional';
    copy.candidateEmail = copy.candidateSnapshot?.email || this.candidate?.email || '';
    copy.jobTitle = this.job?.title || copy.jobTitle || '';
    copy.companyName = this.company?.name || copy.companyName || '';
    copy.appliedAt = copy.submittedAt || copy.appliedAt || copy.createdAt;
    copy.coverNote = copy.coverLetter || copy.coverNote || '';
    return copy;
  }
}

function matchAppQuery(app, query) {
  for (const [key, val] of Object.entries(query)) {
    if (key === '$or' && Array.isArray(val)) {
      const anyMatches = val.some(subQuery => matchAppQuery(app, subQuery));
      if (!anyMatches) return false;
      continue;
    }
    if (val && typeof val === 'object' && !Array.isArray(val) && !val._bsontype) {
      if ('$in' in val) {
        const allowed = val.$in.map(v => (v && v._id ? v._id.toString() : (v ? v.toString() : '')));
        let actual = '';
        if (key === 'company') {
          actual = app.company ? (app.company._id ? app.company._id.toString() : app.company.toString()) : (app.companyId || '');
        } else if (key === 'candidate') {
          actual = app.candidate ? (app.candidate._id ? app.candidate._id.toString() : app.candidate.toString()) : (app.candidateId || '');
        } else if (key === 'job') {
          actual = app.job ? (app.job._id ? app.job._id.toString() : app.job.toString()) : (app.jobId || '');
        } else {
          actual = app[key] ? (app[key]._id ? app[key]._id.toString() : app[key].toString()) : '';
        }
        if (!allowed.includes(actual)) return false;
        continue;
      }
      if ('$ne' in val) {
        const targetVal = val.$ne ? (val.$ne._id ? val.$ne._id.toString() : val.$ne.toString()) : val.$ne;
        const actualVal = app[key] ? (app[key]._id ? app[key]._id.toString() : app[key].toString()) : app[key];
        if (actualVal === targetVal) return false;
        continue;
      }
      if ('$gte' in val || '$lte' in val || '$gt' in val || '$lt' in val) {
        let actualVal = app[key];
        if (actualVal instanceof Date) actualVal = actualVal.getTime();
        let gteVal = val.$gte instanceof Date ? val.$gte.getTime() : (val.$gte != null ? Number(val.$gte) : undefined);
        let lteVal = val.$lte instanceof Date ? val.$lte.getTime() : (val.$lte != null ? Number(val.$lte) : undefined);
        let gtVal = val.$gt instanceof Date ? val.$gt.getTime() : (val.$gt != null ? Number(val.$gt) : undefined);
        let ltVal = val.$lt instanceof Date ? val.$lt.getTime() : (val.$lt != null ? Number(val.$lt) : undefined);

        const num = actualVal != null ? Number(actualVal) : null;
        if (num == null || Number.isNaN(num)) return false;
        if (gteVal !== undefined && num < gteVal) return false;
        if (lteVal !== undefined && num > lteVal) return false;
        if (gtVal !== undefined && num <= gtVal) return false;
        if (ltVal !== undefined && num >= ltVal) return false;
        continue;
      }
    }
    if (key === '_id' || key === 'id') {
      const targetId = val._id ? val._id.toString() : val.toString();
      if (app._id.toString() !== targetId && app.id !== targetId) return false;
      continue;
    }
    if (key === 'candidate') {
      const targetVal = val._id ? val._id.toString() : val.toString();
      const actualVal = app.candidate ? (app.candidate._id ? app.candidate._id.toString() : app.candidate.toString()) : app.candidateId;
      if (actualVal !== targetVal) return false;
      continue;
    }
    if (key === 'job') {
      const targetVal = val._id ? val._id.toString() : val.toString();
      const actualVal = app.job ? (app.job._id ? app.job._id.toString() : app.job.toString()) : app.jobId;
      if (actualVal !== targetVal) return false;
      continue;
    }
    if (key === 'company') {
      const targetVal = val._id ? val._id.toString() : val.toString();
      const actualVal = app.company ? (app.company._id ? app.company._id.toString() : app.company.toString()) : app.companyId;
      if (actualVal !== targetVal) return false;
      continue;
    }
    if (key.includes('.')) {
      const parts = key.split('.');
      let cur = app;
      for (const p of parts) {
        cur = cur ? cur[p] : undefined;
      }
      const expected = (val && val._id) ? val._id.toString() : val;
      if (cur !== expected) return false;
      continue;
    }
    const actual = app[key];
    const expected = (val && val._id) ? val._id.toString() : val;
    if (actual !== expected && (actual && actual.toString() !== (expected && expected.toString()))) {
      return false;
    }
  }
  return true;
}

class MemoryAppQueryChain {
  constructor(results, isSingle = false) {
    this._results = results;
    this._isSingle = isSingle;
    this._populateJob = false;
    this._populateCompany = false;
    this._populateCandidate = false;
  }

  populate(field) {
    if (field === 'job' || field === 'jobId') this._populateJob = true;
    if (field === 'company' || field === 'companyId') this._populateCompany = true;
    if (field === 'candidate' || field === 'candidateId') this._populateCandidate = true;
    return this;
  }

  sort(sortObj) {
    if (!sortObj) return this;
    const entries = Object.entries(sortObj);
    if (!entries.length) return this;
    const [field, dir] = entries[0];
    const mult = dir === -1 || dir === 'desc' ? -1 : 1;

    this._results.sort((a, b) => {
      let va = a[field];
      let vb = b[field];
      if (va instanceof Date) va = va.getTime();
      if (vb instanceof Date) vb = vb.getTime();
      if (va == null && vb == null) return 0;
      if (va == null) return 1 * mult;
      if (vb == null) return -1 * mult;
      if (typeof va === 'string') return va.localeCompare(vb) * mult;
      return (va - vb) * mult;
    });
    return this;
  }

  skip(n) {
    this._results = this._results.slice(n);
    return this;
  }

  limit(n) {
    this._results = this._results.slice(0, n);
    return this;
  }

  async exec() {
    const Job = require('./job.model');
    const Company = require('./company.model');
    const User = require('./user.model');

    const resolvePopulate = async (doc) => {
      if (!doc) return null;
      const clone = new MemoryApplicationDocument(doc.toObject());
      if (this._populateJob && clone.job) {
        const jDoc = await Job.findById(clone.job);
        if (jDoc) clone.job = jDoc;
      }
      if (this._populateCompany && clone.company) {
        const cDoc = await Company.findById(clone.company);
        if (cDoc) clone.company = cDoc;
      }
      if (this._populateCandidate && clone.candidate) {
        const uDoc = await User.findById(clone.candidate);
        if (uDoc) clone.candidate = uDoc;
      }
      return clone;
    };

    if (this._isSingle) {
      const single = this._results[0] || null;
      return resolvePopulate(single);
    }

    return Promise.all(this._results.map(resolvePopulate));
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

const memoryApplicationModel = {
  _applications: memoryApplications,

  find(query = {}) {
    const matched = [];
    for (const app of memoryApplications.values()) {
      if (matchAppQuery(app, query)) {
        matched.push(app);
      }
    }
    return new MemoryAppQueryChain(matched, false);
  },

  findOne(query = {}) {
    for (const app of memoryApplications.values()) {
      if (matchAppQuery(app, query)) {
        return new MemoryAppQueryChain([app], true);
      }
    }
    return new MemoryAppQueryChain([], true);
  },

  findById(id) {
    if (!id) return new MemoryAppQueryChain([], true);
    const strId = id._id ? id._id.toString() : id.toString();
    const doc = memoryApplications.get(strId);
    if (doc) return new MemoryAppQueryChain([doc], true);

    for (const a of memoryApplications.values()) {
      if (a.id === strId || a._id.toString() === strId) {
        return new MemoryAppQueryChain([a], true);
      }
    }
    return new MemoryAppQueryChain([], true);
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const doc = await this.findById(id);
    if (!doc) return null;

    const data = update.$set || update;
    Object.assign(doc, data);
    await doc.save();
    return doc;
  },

  async countDocuments(query = {}) {
    let count = 0;
    for (const app of memoryApplications.values()) {
      if (matchAppQuery(app, query)) count++;
    }
    return count;
  },

  async create(data) {
    const doc = new MemoryApplicationDocument(data);
    await doc.save();
    return doc;
  },

  async deleteOne(query) {
    for (const [id, app] of memoryApplications.entries()) {
      if (matchAppQuery(app, query)) {
        memoryApplications.delete(id);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  },

  __clearMemoryStore: () => memoryApplications.clear()
};

let MongooseApplicationModel;
try {
  MongooseApplicationModel = mongoose.model('Application', applicationSchema);
} catch (e) {
  MongooseApplicationModel = mongoose.model('Application');
}

// Proxy wrapper activating in-memory fallback when MongoDB is disconnected
const ApplicationProxy = new Proxy(MongooseApplicationModel, {
  get(target, prop) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return target[prop];
    }
    if (prop in memoryApplicationModel) {
      return memoryApplicationModel[prop];
    }
    return target[prop];
  },

  construct(target, args) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return new target(...args);
    }
    return new MemoryApplicationDocument(args[0]);
  }
});

module.exports = ApplicationProxy;
