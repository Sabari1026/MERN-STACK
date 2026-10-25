/**
 * Mongoose CompanyVerificationRequest Model for HireConnect
 * Stores corporate verification submissions, supporting evidence, and administrative review states.
 */

const mongoose = require('mongoose');

const companyVerificationSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    officialEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    businessRegistrationNumber: {
      type: String,
      trim: true,
      default: ''
    },
    contactPhone: {
      type: String,
      trim: true,
      default: ''
    },
    documents: [
      {
        storageKey: String,
        originalFileName: String,
        mimeType: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'under_review', 'verified', 'rejected', 'suspended'],
      default: 'pending',
      index: true
    },
    reviewerNotes: {
      type: String,
      default: ''
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Activated when MongoDB is not connected)
// ============================================================================
const memoryVerifications = new Map();

class MemoryCompanyVerificationDocument {
  constructor(data) {
    this._id = data._id || data.id || new mongoose.Types.ObjectId().toString();
    this.id = this._id.toString();
    this.company = data.company ? (data.company._id || data.company).toString() : null;
    this.requestedBy = data.requestedBy ? (data.requestedBy._id || data.requestedBy).toString() : null;
    this.officialEmail = (data.officialEmail || '').toLowerCase().trim();
    this.website = data.website || '';
    this.businessRegistrationNumber = data.businessRegistrationNumber || '';
    this.contactPhone = data.contactPhone || '';
    this.documents = Array.isArray(data.documents) ? [...data.documents] : [];
    this.status = data.status || 'pending';
    this.reviewerNotes = data.reviewerNotes || '';
    this.reviewedBy = data.reviewedBy ? data.reviewedBy.toString() : null;
    this.reviewedAt = data.reviewedAt ? new Date(data.reviewedAt) : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    memoryVerifications.set(this.id, this);
    return this;
  }

  toObject() {
    const copy = {};
    for (const key of Object.keys(this)) {
      copy[key] = this[key];
    }
    return copy;
  }

  toJSON() {
    const obj = this.toObject();
    obj.id = this.id;
    delete obj._id;
    delete obj.__v;
    return obj;
  }
}

function matchStatus(actual, expected) {
  if (expected === undefined) return true;
  if (expected && typeof expected === 'object' && Array.isArray(expected.$in)) {
    return expected.$in.includes(actual);
  }
  return actual === expected;
}

const memoryModel = {
  _memoryStore: memoryVerifications,
  __clearMemoryStore: () => memoryVerifications.clear(),

  async findOne(query) {
    for (const v of memoryVerifications.values()) {
      let matches = true;
      if (query._id && v.id !== query._id.toString()) matches = false;
      if (query.company && v.company !== query.company.toString()) matches = false;
      if (query.status !== undefined && !matchStatus(v.status, query.status)) matches = false;
      if (matches) return v;
    }
    return null;
  },

  async findById(id) {
    if (!id) return null;
    return memoryVerifications.get(id.toString()) || null;
  },

  find(query = {}) {
    const results = [];
    for (const v of memoryVerifications.values()) {
      let matches = true;
      if (query.company && v.company !== query.company.toString()) matches = false;
      if (query.status !== undefined && !matchStatus(v.status, query.status)) matches = false;
      if (matches) results.push(v);
    }
    const chain = {
      _results: results,
      populate() {
        return chain;
      },
      sort(sortObj) {
        if (sortObj && sortObj.createdAt === -1) {
          chain._results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return chain;
      },
      skip(n) {
        chain._results = chain._results.slice(n);
        return chain;
      },
      limit(n) {
        chain._results = chain._results.slice(0, n);
        return chain;
      },
      then(resolve) {
        return Promise.resolve(chain._results).then(resolve);
      }
    };
    return chain;
  },

  async countDocuments(query = {}) {
    let count = 0;
    for (const v of memoryVerifications.values()) {
      let matches = true;
      if (query.company && v.company !== query.company.toString()) matches = false;
      if (query.status !== undefined && !matchStatus(v.status, query.status)) matches = false;
      if (matches) count++;
    }
    return count;
  },

  async create(data) {
    const doc = new MemoryCompanyVerificationDocument(data);
    await doc.save();
    return doc;
  }
};

let MongooseVerificationModel;
try {
  MongooseVerificationModel = mongoose.model('CompanyVerificationRequest', companyVerificationSchema);
} catch (e) {
  MongooseVerificationModel = mongoose.model('CompanyVerificationRequest');
}

const VerificationProxy = new Proxy(MongooseVerificationModel, {
  get(target, prop) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return target[prop];
    }
    if (prop in memoryModel) {
      return memoryModel[prop];
    }
    return target[prop];
  },
  construct(target, args) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return new target(...args);
    }
    return new MemoryCompanyVerificationDocument(args[0]);
  }
});

module.exports = VerificationProxy;
