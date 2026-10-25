/**
 * Mongoose CompanyMembership Model for HireConnect
 * Manages authorized recruiter/admin memberships and role permissions per company.
 */

const mongoose = require('mongoose');

const companyMembershipSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    membershipRole: {
      type: String,
      enum: ['owner', 'admin', 'recruiter', 'hiring_manager'],
      default: 'recruiter',
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'revoked'],
      default: 'active',
      index: true
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

// Compound unique index ensuring 1 membership per company/user
companyMembershipSchema.index({ company: 1, user: 1 }, { unique: true });

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Activated when MongoDB is not connected)
// ============================================================================
const memoryMemberships = new Map();

class MemoryCompanyMembershipDocument {
  constructor(data) {
    this._id = data._id || data.id || new mongoose.Types.ObjectId().toString();
    this.id = this._id.toString();
    this.company = data.company ? (data.company._id || data.company).toString() : null;
    this.user = data.user ? (data.user._id || data.user).toString() : null;
    this.membershipRole = data.membershipRole || 'recruiter';
    this.status = data.status || 'active';
    this.invitedBy = data.invitedBy ? data.invitedBy.toString() : null;
    this.approvedBy = data.approvedBy ? data.approvedBy.toString() : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    memoryMemberships.set(this.id, this);
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

const memoryModel = {
  _memoryStore: memoryMemberships,
  __clearMemoryStore: () => memoryMemberships.clear(),

  async findOne(query) {
    for (const mem of memoryMemberships.values()) {
      let matches = true;
      if (query._id && mem.id !== query._id.toString()) matches = false;
      if (query.id && mem.id !== query.id.toString()) matches = false;
      if (query.company && mem.company !== query.company.toString()) matches = false;
      if (query.user && mem.user !== query.user.toString()) matches = false;
      if (query.status && mem.status !== query.status) matches = false;
      if (query.membershipRole && mem.membershipRole !== query.membershipRole) matches = false;
      if (matches) return mem;
    }
    return null;
  },

  async findById(id) {
    if (!id) return null;
    return memoryMemberships.get(id.toString()) || null;
  },

  find(query = {}) {
    const results = [];
    for (const mem of memoryMemberships.values()) {
      let matches = true;
      if (query.company && mem.company !== query.company.toString()) matches = false;
      if (query.user && mem.user !== query.user.toString()) matches = false;
      if (query.status && mem.status !== query.status) matches = false;
      if (matches) results.push(mem);
    }

    const chain = {
      _results: results,
      populate() {
        return chain;
      },
      sort() {
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
    for (const mem of memoryMemberships.values()) {
      let matches = true;
      if (query.company && mem.company !== query.company.toString()) matches = false;
      if (query.user && mem.user !== query.user.toString()) matches = false;
      if (query.status && mem.status !== query.status) matches = false;
      if (query.membershipRole && mem.membershipRole !== query.membershipRole) matches = false;
      if (matches) count++;
    }
    return count;
  },

  async create(data) {
    const doc = new MemoryCompanyMembershipDocument(data);
    await doc.save();
    return doc;
  },

  async deleteOne(query) {
    for (const [id, mem] of memoryMemberships.entries()) {
      let matches = true;
      if (query._id && id !== query._id.toString()) matches = false;
      if (query.company && mem.company !== query.company.toString()) matches = false;
      if (query.user && mem.user !== query.user.toString()) matches = false;
      if (matches) {
        memoryMemberships.delete(id);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  }
};

let MongooseMembershipModel;
try {
  MongooseMembershipModel = mongoose.model('CompanyMembership', companyMembershipSchema);
} catch (e) {
  MongooseMembershipModel = mongoose.model('CompanyMembership');
}

const MembershipProxy = new Proxy(MongooseMembershipModel, {
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
    return new MemoryCompanyMembershipDocument(args[0]);
  }
});

module.exports = MembershipProxy;
