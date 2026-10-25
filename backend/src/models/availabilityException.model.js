/**
 * Mongoose AvailabilityException Model for HireConnect (Phase 8)
 * Stores recruiter dates/times where normal weekly availability is overridden or blocked (time-off, leaves).
 * Includes zero-dependency in-memory fallback for testing and offline development.
 */

const mongoose = require('mongoose');

const availabilityExceptionSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter user reference is required'],
      index: true
    },
    startAt: {
      type: Date,
      required: [true, 'startAt UTC timestamp is required'],
      index: true
    },
    endAt: {
      type: Date,
      required: [true, 'endAt UTC timestamp is required'],
      index: true
    },
    type: {
      type: String,
      enum: ['unavailable', 'override'],
      default: 'unavailable',
      index: true
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
      default: ''
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

// Compound index for query efficiency
availabilityExceptionSchema.index({ recruiter: 1, startAt: 1, endAt: 1 });

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Fallback when MongoDB is disconnected)
// ============================================================================
const memoryExceptions = new Map();

class MemoryExceptionDocument {
  constructor(data = {}) {
    const id = data._id ? data._id.toString() : (data.id || `exc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    this._id = id;
    this.id = id;
    this.recruiter = data.recruiter || data.recruiterId || null;
    this.recruiterId = data.recruiterId || (this.recruiter ? (this.recruiter._id ? this.recruiter._id.toString() : this.recruiter.toString()) : null);
    this.startAt = data.startAt ? new Date(data.startAt) : new Date();
    this.endAt = data.endAt ? new Date(data.endAt) : new Date();
    this.type = data.type || 'unavailable';
    this.reason = data.reason || '';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    if (this.recruiter) {
      this.recruiterId = this.recruiter._id ? this.recruiter._id.toString() : this.recruiter.toString();
    }
    memoryExceptions.set(this._id.toString(), this);
    return this;
  }

  toObject() {
    return {
      id: this._id.toString(),
      _id: this._id,
      recruiter: this.recruiter,
      startAt: this.startAt,
      endAt: this.endAt,
      type: this.type,
      reason: this.reason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toJSON() {
    return this.toObject();
  }
}

class MemoryQuery {
  constructor(resultPromise) {
    this.resultPromise = resultPromise;
  }
  sort(sortCriteria) {
    const p = this.resultPromise.then((res) => {
      if (!Array.isArray(res)) return res;
      return [...res].sort((a, b) => {
        if (sortCriteria && sortCriteria.startAt) {
          const dir = sortCriteria.startAt === -1 ? -1 : 1;
          return (new Date(a.startAt) - new Date(b.startAt)) * dir;
        }
        return 0;
      });
    });
    return new MemoryQuery(p);
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
  for (const [k, v] of Object.entries(query)) {
    if (k === '_id') {
      if (typeof v === 'object' && v && v.$ne) {
        const neId = v.$ne._id ? v.$ne._id.toString() : v.$ne.toString();
        if (doc._id.toString() === neId) return false;
      } else {
        const qId = v?._id ? v._id.toString() : (v ? v.toString() : '');
        if (doc._id.toString() !== qId) return false;
      }
    } else if (k === 'recruiter') {
      const qRec = v?._id ? v._id.toString() : (v ? v.toString() : '');
      const docRec = doc.recruiterId || (doc.recruiter ? (doc.recruiter._id ? doc.recruiter._id.toString() : doc.recruiter.toString()) : '');
      if (docRec !== qRec) return false;
    } else if (k === 'type') {
      if (doc.type !== v) return false;
    } else if (k === 'startAt') {
      const docStart = new Date(doc.startAt).getTime();
      if (v.$gte && docStart < new Date(v.$gte).getTime()) return false;
      if (v.$lte && docStart > new Date(v.$lte).getTime()) return false;
      if (v.$lt && docStart >= new Date(v.$lt).getTime()) return false;
      if (v.$gt && docStart <= new Date(v.$gt).getTime()) return false;
    } else if (k === 'endAt') {
      const docEnd = new Date(doc.endAt).getTime();
      if (v.$gte && docEnd < new Date(v.$gte).getTime()) return false;
      if (v.$lte && docEnd > new Date(v.$lte).getTime()) return false;
      if (v.$lt && docEnd >= new Date(v.$lt).getTime()) return false;
      if (v.$gt && docEnd <= new Date(v.$gt).getTime()) return false;
    } else if (k === '$or') {
      const matchedAny = v.some((subQ) => matchQuery(doc, subQ));
      if (!matchedAny) return false;
    }
  }
  return true;
}

const memoryExceptionModel = {
  find(query = {}) {
    const promise = Promise.resolve().then(() => {
      const list = [];
      for (const doc of memoryExceptions.values()) {
        if (matchQuery(doc, query)) list.push(doc);
      }
      return list;
    });
    return new MemoryQuery(promise);
  },

  findOne(query = {}) {
    const promise = Promise.resolve().then(() => {
      for (const doc of memoryExceptions.values()) {
        if (matchQuery(doc, query)) return doc;
      }
      return null;
    });
    return new MemoryQuery(promise);
  },

  findById(id) {
    const promise = Promise.resolve().then(() => {
      if (!id) return null;
      return memoryExceptions.get(id.toString()) || null;
    });
    return new MemoryQuery(promise);
  },

  async findByIdAndDelete(id) {
    if (!id) return null;
    const doc = memoryExceptions.get(id.toString());
    if (doc) {
      memoryExceptions.delete(id.toString());
      return doc;
    }
    return null;
  },

  async deleteOne(query = {}) {
    for (const [id, doc] of memoryExceptions.entries()) {
      if (matchQuery(doc, query)) {
        memoryExceptions.delete(id);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  },

  async create(data) {
    const doc = new MemoryExceptionDocument(data);
    await doc.save();
    return doc;
  },

  __clearMemoryStore: () => memoryExceptions.clear()
};

let MongooseAvailabilityExceptionModel;
try {
  MongooseAvailabilityExceptionModel = mongoose.model('AvailabilityException', availabilityExceptionSchema);
} catch (e) {
  MongooseAvailabilityExceptionModel = mongoose.model('AvailabilityException');
}

const AvailabilityExceptionProxy = new Proxy(MongooseAvailabilityExceptionModel, {
  get(target, prop) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return target[prop];
    }
    if (prop in memoryExceptionModel) {
      return memoryExceptionModel[prop];
    }
    return target[prop];
  },

  construct(target, args) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return new target(...args);
    }
    return new MemoryExceptionDocument(args[0]);
  }
});

module.exports = AvailabilityExceptionProxy;
