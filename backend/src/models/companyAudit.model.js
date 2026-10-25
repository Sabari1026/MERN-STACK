/**
 * Mongoose CompanyAuditLog Model for HireConnect
 * Records immutable audit trails for sensitive corporate and membership lifecycle events.
 */

const mongoose = require('mongoose');

const companyAuditSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      index: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    actorEmail: {
      type: String,
      default: ''
    },
    actorRole: {
      type: String,
      default: ''
    },
    outcome: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success'
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({})
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
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

// In-Memory store
const memoryAuditLogs = [];

const memoryModel = {
  _memoryStore: memoryAuditLogs,
  __clearMemoryStore: () => { memoryAuditLogs.length = 0; },

  async create(data) {
    const record = {
      id: new mongoose.Types.ObjectId().toString(),
      ...data,
      createdAt: new Date()
    };
    memoryAuditLogs.push(record);
    return record;
  },

  find(query = {}) {
    const results = memoryAuditLogs.filter(log => {
      if (query.company && log.company.toString() !== query.company.toString()) return false;
      if (query.eventType && log.eventType !== query.eventType) return false;
      return true;
    });
    return {
      _results: results,
      sort() { return this; },
      then(resolve) { return Promise.resolve(results).then(resolve); }
    };
  }
};

let MongooseAuditModel;
try {
  MongooseAuditModel = mongoose.model('CompanyAuditLog', companyAuditSchema);
} catch (e) {
  MongooseAuditModel = mongoose.model('CompanyAuditLog');
}

const AuditProxy = new Proxy(MongooseAuditModel, {
  get(target, prop) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return target[prop];
    }
    if (prop in memoryModel) {
      return memoryModel[prop];
    }
    return target[prop];
  }
});

module.exports = AuditProxy;
