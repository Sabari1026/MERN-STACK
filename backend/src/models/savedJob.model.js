/**
 * Mongoose SavedJob Model for HireConnect
 * Stores candidate bookmarked jobs with compound uniqueness and in-memory fallback.
 */

const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate reference is required'],
      index: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
      index: true
    },
    savedAt: {
      type: Date,
      default: Date.now,
      index: true
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

// Compound unique index ensuring a candidate cannot save the same job multiple times
savedJobSchema.index({ candidate: 1, job: 1 }, { unique: true });

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Fallback when MongoDB is disconnected)
// ============================================================================
const memorySavedJobs = new Map();

class MemorySavedJobDocument {
  constructor(data = {}) {
    const id = data._id ? data._id.toString() : (data.id || `saved-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    this._id = id;
    this.id = id;
    this.candidate = data.candidate || data.candidateId || null;
    this.candidateId = data.candidateId || (this.candidate ? (this.candidate._id ? this.candidate._id.toString() : this.candidate.toString()) : null);
    this.job = data.job || data.jobId || null;
    this.jobId = data.jobId || (this.job ? (this.job._id ? this.job._id.toString() : this.job.toString()) : null);
    this.savedAt = data.savedAt ? new Date(data.savedAt) : new Date();
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    if (this.candidate) {
      this.candidateId = this.candidate._id ? this.candidate._id.toString() : this.candidate.toString();
    }
    if (this.job) {
      this.jobId = this.job._id ? this.job._id.toString() : this.job.toString();
    }

    // Compound unique check { candidate, job }
    for (const [id, existing] of memorySavedJobs.entries()) {
      if (id !== this._id.toString()) {
        const existCand = existing.candidateId || (existing.candidate ? (existing.candidate._id ? existing.candidate._id.toString() : existing.candidate.toString()) : '');
        const existJob = existing.jobId || (existing.job ? (existing.job._id ? existing.job._id.toString() : existing.job.toString()) : '');
        const thisCand = this.candidateId;
        const thisJob = this.jobId;

        if (existCand && existJob && thisCand && thisJob && existCand === thisCand && existJob === thisJob) {
          const err = new Error('E11000 duplicate key error collection: savedjobs index: candidate_1_job_1 dup key');
          err.code = 11000;
          throw err;
        }
      }
    }

    memorySavedJobs.set(this._id.toString(), this);
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
}

function matchSavedJobQuery(item, query) {
  for (const [key, val] of Object.entries(query)) {
    if (key === '_id' || key === 'id') {
      const targetId = val._id ? val._id.toString() : val.toString();
      if (item._id.toString() !== targetId && item.id !== targetId) return false;
      continue;
    }
    if (key === 'candidate') {
      const targetVal = val._id ? val._id.toString() : val.toString();
      const actualVal = item.candidate ? (item.candidate._id ? item.candidate._id.toString() : item.candidate.toString()) : item.candidateId;
      if (actualVal !== targetVal) return false;
      continue;
    }
    if (key === 'job') {
      const targetVal = val._id ? val._id.toString() : val.toString();
      const actualVal = item.job ? (item.job._id ? item.job._id.toString() : item.job.toString()) : item.jobId;
      if (actualVal !== targetVal) return false;
      continue;
    }
    const actual = item[key];
    const expected = (val && val._id) ? val._id.toString() : val;
    if (actual !== expected && (actual && actual.toString() !== (expected && expected.toString()))) {
      return false;
    }
  }
  return true;
}

class MemorySavedJobQueryChain {
  constructor(results, isSingle = false) {
    this._results = results;
    this._isSingle = isSingle;
    this._populateJob = false;
  }

  populate(field) {
    if (field === 'job' || field === 'jobId') this._populateJob = true;
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
    const resolvePopulate = async (doc) => {
      if (!doc) return null;
      const clone = new MemorySavedJobDocument(doc.toObject());
      if (this._populateJob && clone.job) {
        const jDoc = await Job.findById(clone.job);
        if (jDoc) {
          await jDoc.populate?.('company');
          clone.job = jDoc;
        }
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

const memorySavedJobModel = {
  _savedJobs: memorySavedJobs,

  find(query = {}) {
    const matched = [];
    for (const item of memorySavedJobs.values()) {
      if (matchSavedJobQuery(item, query)) {
        matched.push(item);
      }
    }
    return new MemorySavedJobQueryChain(matched, false);
  },

  findOne(query = {}) {
    for (const item of memorySavedJobs.values()) {
      if (matchSavedJobQuery(item, query)) {
        return new MemorySavedJobQueryChain([item], true);
      }
    }
    return new MemorySavedJobQueryChain([], true);
  },

  findById(id) {
    if (!id) return new MemorySavedJobQueryChain([], true);
    const strId = id._id ? id._id.toString() : id.toString();
    const doc = memorySavedJobs.get(strId);
    if (doc) return new MemorySavedJobQueryChain([doc], true);
    return new MemorySavedJobQueryChain([], true);
  },

  async countDocuments(query = {}) {
    let count = 0;
    for (const item of memorySavedJobs.values()) {
      if (matchSavedJobQuery(item, query)) count++;
    }
    return count;
  },

  async create(data) {
    const doc = new MemorySavedJobDocument(data);
    await doc.save();
    return doc;
  },

  async deleteOne(query) {
    for (const [id, item] of memorySavedJobs.entries()) {
      if (matchSavedJobQuery(item, query)) {
        memorySavedJobs.delete(id);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  },

  async deleteMany(query = {}) {
    let deletedCount = 0;
    for (const [id, item] of memorySavedJobs.entries()) {
      if (matchSavedJobQuery(item, query)) {
        memorySavedJobs.delete(id);
        deletedCount++;
      }
    }
    return { deletedCount };
  },

  __clearMemoryStore: () => memorySavedJobs.clear()
};

let MongooseSavedJobModel;
try {
  MongooseSavedJobModel = mongoose.model('SavedJob', savedJobSchema);
} catch (e) {
  MongooseSavedJobModel = mongoose.model('SavedJob');
}

// Proxy wrapper activating in-memory fallback when MongoDB is disconnected
const SavedJobProxy = new Proxy(MongooseSavedJobModel, {
  get(target, prop) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return target[prop];
    }
    if (prop in memorySavedJobModel) {
      return memorySavedJobModel[prop];
    }
    return target[prop];
  },

  construct(target, args) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return new target(...args);
    }
    return new MemorySavedJobDocument(args[0]);
  }
});

module.exports = SavedJobProxy;
