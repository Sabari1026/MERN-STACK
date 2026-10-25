/**
 * Mongoose CompanyInvitation Model for HireConnect
 * Stores secure single-use hashed invitations for recruiter/team member onboarding.
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const companyInvitationSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    role: {
      type: String,
      enum: ['admin', 'recruiter', 'hiring_manager'],
      default: 'recruiter'
    },
    tokenHash: {
      type: String,
      required: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'revoked', 'expired'],
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        delete ret.tokenHash;
        return ret;
      }
    }
  }
);

// Helper to hash token
companyInvitationSchema.statics.hashToken = function (token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Activated when MongoDB is not connected)
// ============================================================================
const memoryInvitations = new Map();

class MemoryCompanyInvitationDocument {
  constructor(data) {
    this._id = data._id || data.id || new mongoose.Types.ObjectId().toString();
    this.id = this._id.toString();
    this.company = data.company ? (data.company._id || data.company).toString() : null;
    this.email = (data.email || '').toLowerCase().trim();
    this.role = data.role || 'recruiter';
    this.tokenHash = data.tokenHash || '';
    this.expiresAt = data.expiresAt ? new Date(data.expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    this.invitedBy = data.invitedBy ? data.invitedBy.toString() : null;
    this.status = data.status || 'pending';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    memoryInvitations.set(this.id, this);
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
    delete obj.tokenHash;
    return obj;
  }
}

const memoryModel = {
  _memoryStore: memoryInvitations,
  __clearMemoryStore: () => memoryInvitations.clear(),

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  },

  async findOne(query) {
    for (const inv of memoryInvitations.values()) {
      let matches = true;
      if (query._id && inv.id !== query._id.toString()) matches = false;
      if (query.tokenHash && inv.tokenHash !== query.tokenHash) matches = false;
      if (query.company && inv.company !== query.company.toString()) matches = false;
      if (query.email && inv.email !== query.email.toLowerCase()) matches = false;
      if (query.status && inv.status !== query.status) matches = false;
      if (matches) return inv;
    }
    return null;
  },

  async findById(id) {
    if (!id) return null;
    return memoryInvitations.get(id.toString()) || null;
  },

  find(query = {}) {
    const results = [];
    for (const inv of memoryInvitations.values()) {
      let matches = true;
      if (query.company && inv.company !== query.company.toString()) matches = false;
      if (query.status && inv.status !== query.status) matches = false;
      if (matches) results.push(inv);
    }
    return {
      _results: results,
      then(resolve) {
        return Promise.resolve(results).then(resolve);
      }
    };
  },

  async create(data) {
    const doc = new MemoryCompanyInvitationDocument(data);
    await doc.save();
    return doc;
  }
};

let MongooseInvitationModel;
try {
  MongooseInvitationModel = mongoose.model('CompanyInvitation', companyInvitationSchema);
} catch (e) {
  MongooseInvitationModel = mongoose.model('CompanyInvitation');
}

const InvitationProxy = new Proxy(MongooseInvitationModel, {
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
    return new MemoryCompanyInvitationDocument(args[0]);
  }
});

module.exports = InvitationProxy;
