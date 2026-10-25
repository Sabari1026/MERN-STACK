/**
 * Mongoose AdminAuditLog Model for HireConnect (Phase 10)
 * Stores immutable, append-only audit records for all privileged administrative operations.
 */

const mongoose = require('mongoose');

const adminAuditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Acting administrator is required'],
      index: true
    },
    actorName: {
      type: String,
      trim: true,
      default: 'Administrator'
    },
    actorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    actorRole: {
      type: String,
      default: 'admin'
    },
    action: {
      type: String,
      required: [true, 'Audit action is required'],
      trim: true,
      index: true
    },
    resourceType: {
      type: String,
      required: [true, 'Target resource type is required'],
      enum: ['user', 'company', 'job', 'verification_request', 'report', 'system'],
      index: true
    },
    resourceId: {
      type: String,
      required: [true, 'Target resource ID is required'],
      index: true
    },
    previousState: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    newState: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    reason: {
      type: String,
      trim: true,
      default: ''
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Append-only: updatedAt not supported
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

// Compound indexing for high-performance administrative filtering & time ranges
adminAuditLogSchema.index({ action: 1, createdAt: -1 });
adminAuditLogSchema.index({ resourceType: 1, resourceId: 1 });
adminAuditLogSchema.index({ actor: 1, createdAt: -1 });

// =========================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Activated when MongoDB is not connected)
// =========================================================================
const memoryAuditLogs = [];

class MemoryAdminAuditLogDocument {
  constructor(data = {}) {
    const id = data._id ? data._id.toString() : (data.id || `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    this._id = id;
    this.id = id;
    this.actor = data.actor ? (data.actor._id ? data.actor._id.toString() : data.actor.toString()) : null;
    this.actorName = data.actorName || 'Administrator';
    this.actorEmail = (data.actorEmail || '').toLowerCase();
    this.actorRole = data.actorRole || 'admin';
    this.action = data.action || '';
    this.resourceType = data.resourceType || 'system';
    this.resourceId = data.resourceId ? data.resourceId.toString() : '';
    this.previousState = data.previousState || null;
    this.newState = data.newState || null;
    this.reason = data.reason || '';
    this.ipAddress = data.ipAddress || '';
    this.userAgent = data.userAgent || '';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }

  async save() {
    memoryAuditLogs.push(this);
    return this;
  }

  toObject() {
    return {
      id: this.id,
      _id: this._id,
      actor: this.actor,
      actorName: this.actorName,
      actorEmail: this.actorEmail,
      actorRole: this.actorRole,
      action: this.action,
      resourceType: this.resourceType,
      resourceId: this.resourceId,
      previousState: this.previousState,
      newState: this.newState,
      reason: this.reason,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      createdAt: this.createdAt
    };
  }

  toJSON() {
    return this.toObject();
  }
}

class MemoryAuditQuery {
  constructor(resultsPromise) {
    this._promise = resultsPromise;
  }
  populate() {
    return this;
  }
  sort(sortObj) {
    this._promise = this._promise.then(list => {
      const copy = [...list];
      if (sortObj && sortObj.createdAt === -1) {
        copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortObj && sortObj.createdAt === 1) {
        copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
      return copy;
    });
    return this;
  }
  skip(n) {
    this._promise = this._promise.then(list => list.slice(n));
    return this;
  }
  limit(n) {
    this._promise = this._promise.then(list => list.slice(0, n));
    return this;
  }
  then(resolve, reject) {
    return this._promise.then(resolve, reject);
  }
  catch(reject) {
    return this._promise.catch(reject);
  }
  finally(callback) {
    return this._promise.finally(callback);
  }
}

function matchAuditQuery(log, query) {
  for (const [key, val] of Object.entries(query)) {
    if (key === 'action') {
      if (log.action !== val) return false;
    } else if (key === 'resourceType') {
      if (log.resourceType !== val) return false;
    } else if (key === 'resourceId') {
      if (log.resourceId !== val.toString()) return false;
    } else if (key === 'actor') {
      const qActor = val._id ? val._id.toString() : val.toString();
      if (log.actor !== qActor) return false;
    } else if (key === 'createdAt') {
      const logTime = new Date(log.createdAt).getTime();
      if (val.$gte && logTime < new Date(val.$gte).getTime()) return false;
      if (val.$lte && logTime > new Date(val.$lte).getTime()) return false;
    }
  }
  return true;
}

const memoryAuditModel = {
  find(query = {}) {
    const p = Promise.resolve().then(() => {
      return memoryAuditLogs.filter(log => matchAuditQuery(log, query));
    });
    return new MemoryAuditQuery(p);
  },

  findOne(query = {}) {
    const p = Promise.resolve().then(() => {
      return memoryAuditLogs.find(log => matchAuditQuery(log, query)) || null;
    });
    return new MemoryAuditQuery(p);
  },

  findById(id) {
    const p = Promise.resolve().then(() => {
      if (!id) return null;
      const strId = id._id ? id._id.toString() : id.toString();
      return memoryAuditLogs.find(log => log.id === strId || log._id.toString() === strId) || null;
    });
    return new MemoryAuditQuery(p);
  },

  async create(data) {
    const doc = new MemoryAdminAuditLogDocument(data);
    await doc.save();
    return doc;
  },

  async countDocuments(query = {}) {
    return memoryAuditLogs.filter(log => matchAuditQuery(log, query)).length;
  },

  __clearMemoryStore: () => {
    memoryAuditLogs.length = 0;
  }
};

let MongooseAuditModel;
try {
  MongooseAuditModel = mongoose.model('AdminAuditLog', adminAuditLogSchema);
} catch (e) {
  MongooseAuditModel = mongoose.model('AdminAuditLog');
}

const AuditLogProxy = new Proxy(MongooseAuditModel, {
  get(target, prop) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return target[prop];
    }
    if (prop in memoryAuditModel) {
      return memoryAuditModel[prop];
    }
    return target[prop];
  },

  construct(target, args) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return new target(...args);
    }
    return new MemoryAdminAuditLogDocument(args[0]);
  }
});

module.exports = AuditLogProxy;
