/**
 * Persistent In-App Notification Model for HireConnect (Phase 9)
 * Stores notifications for candidates, recruiters, and administrators.
 * Supports read/unread states, deduplication keys, safe resource links,
 * and zero-dependency in-memory fallback.
 */

const mongoose = require('mongoose');

const NOTIFICATION_TYPES = [
  'application_submitted',
  'application_status_changed',
  'application_withdrawn',
  'new_applicant',
  'interview_booked',
  'interview_rescheduled',
  'interview_cancelled',
  'interview_reminder',
  'job_published',
  'job_closed',
  'company_verification_updated',
  'system_announcement'
];

const RESOURCE_TYPES = ['application', 'meeting', 'job', 'company', 'system'];

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient User ID is required'],
      index: true
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: [true, 'Notification type is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    resourceType: {
      type: String,
      enum: RESOURCE_TYPES,
      default: 'system'
    },
    resourceId: {
      type: String,
      default: null,
      trim: true
    },
    actionUrl: {
      type: String,
      default: '/',
      trim: true
    },
    readAt: {
      type: Date,
      default: null,
      index: true
    },
    isDismissed: {
      type: Boolean,
      default: false,
      index: true
    },
    deduplicationKey: {
      type: String,
      default: null,
      trim: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({})
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        ret.isRead = Boolean(ret.readAt);
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Virtual for reading state
notificationSchema.virtual('isRead').get(function () {
  return Boolean(this.readAt);
});

// Indexes for fast lookups
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isDismissed: 1, readAt: 1 });
notificationSchema.index({ deduplicationKey: 1 }, { sparse: true });

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Fallback when MongoDB is disconnected)
// ============================================================================
const memoryNotifications = new Map();

class MemoryNotificationDocument {
  constructor(data = {}) {
    const id = data._id ? data._id.toString() : (data.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    this._id = id;
    this.id = id;
    this.recipient = data.recipient?._id ? data.recipient._id.toString() : (data.recipient ? data.recipient.toString() : null);
    this.type = data.type || 'system_announcement';
    this.title = data.title || '';
    this.message = data.message || '';
    this.resourceType = data.resourceType || 'system';
    this.resourceId = data.resourceId ? data.resourceId.toString() : null;
    this.actionUrl = data.actionUrl || '/';
    this.readAt = data.readAt ? new Date(data.readAt) : null;
    this.isDismissed = Boolean(data.isDismissed);
    this.deduplicationKey = data.deduplicationKey || null;
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  get isRead() {
    return Boolean(this.readAt);
  }

  async save() {
    this.updatedAt = new Date();
    memoryNotifications.set(this._id.toString(), this);
    return this;
  }

  toObject() {
    const copy = { ...this };
    copy.id = this._id.toString();
    copy.isRead = Boolean(this.readAt);
    return copy;
  }

  toJSON() {
    return this.toObject();
  }
}

class MemoryQuery {
  constructor(resultPromise) {
    this.resultPromise = resultPromise;
  }
  populate() {
    return this;
  }
  sort(criteria) {
    const p = this.resultPromise.then((res) => {
      if (!Array.isArray(res)) return res;
      return [...res].sort((a, b) => {
        if (criteria && criteria.createdAt) {
          const dir = criteria.createdAt === -1 ? -1 : 1;
          return (new Date(a.createdAt) - new Date(b.createdAt)) * dir;
        }
        return 0;
      });
    });
    return new MemoryQuery(p);
  }
  skip(num) {
    const p = this.resultPromise.then((res) => {
      if (!Array.isArray(res)) return res;
      return res.slice(num);
    });
    return new MemoryQuery(p);
  }
  limit(num) {
    const p = this.resultPromise.then((res) => {
      if (!Array.isArray(res)) return res;
      return res.slice(0, num);
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

function matchDocQuery(doc, query) {
  for (const [k, v] of Object.entries(query)) {
    if (k === '_id' || k === 'id') {
      const qId = v?._id ? v._id.toString() : (v ? v.toString() : '');
      if (doc._id.toString() !== qId) return false;
    } else if (k === 'recipient') {
      const qRec = v?._id ? v._id.toString() : (v ? v.toString() : '');
      const docRec = doc.recipient?._id ? doc.recipient._id.toString() : (doc.recipient ? doc.recipient.toString() : '');
      if (docRec !== qRec) return false;
    } else if (k === 'type') {
      if (doc.type !== v) return false;
    } else if (k === 'readAt') {
      if (v === null && doc.readAt !== null) return false;
      if (v && v.$ne === null && doc.readAt === null) return false;
    } else if (k === 'isDismissed') {
      if (Boolean(doc.isDismissed) !== Boolean(v)) return false;
    } else if (k === 'deduplicationKey') {
      if (doc.deduplicationKey !== v) return false;
    }
  }
  return true;
}

const memoryNotificationModel = {
  find(query = {}) {
    const promise = Promise.resolve().then(() => {
      const list = [];
      for (const doc of memoryNotifications.values()) {
        if (matchDocQuery(doc, query)) list.push(doc);
      }
      return list;
    });
    return new MemoryQuery(promise);
  },

  findOne(query = {}) {
    const promise = Promise.resolve().then(() => {
      for (const doc of memoryNotifications.values()) {
        if (matchDocQuery(doc, query)) return doc;
      }
      return null;
    });
    return new MemoryQuery(promise);
  },

  findById(id) {
    const promise = Promise.resolve().then(() => {
      if (!id) return null;
      return memoryNotifications.get(id.toString()) || null;
    });
    return new MemoryQuery(promise);
  },

  async create(data) {
    const doc = new MemoryNotificationDocument(data);
    await doc.save();
    return doc;
  },

  async countDocuments(query = {}) {
    let count = 0;
    for (const doc of memoryNotifications.values()) {
      if (matchDocQuery(doc, query)) count++;
    }
    return count;
  },

  async updateMany(query = {}, update = {}) {
    let matchedCount = 0;
    let modifiedCount = 0;
    for (const doc of memoryNotifications.values()) {
      if (matchDocQuery(doc, query)) {
        matchedCount++;
        if (update.$set) {
          for (const [k, v] of Object.entries(update.$set)) {
            doc[k] = v;
          }
          doc.updatedAt = new Date();
          modifiedCount++;
        }
      }
    }
    return { acknowledged: true, matchedCount, modifiedCount };
  },

  async deleteOne(query = {}) {
    for (const [id, doc] of memoryNotifications.entries()) {
      if (matchDocQuery(doc, query)) {
        memoryNotifications.delete(id);
        return { acknowledged: true, deletedCount: 1 };
      }
    }
    return { acknowledged: true, deletedCount: 0 };
  },

  __clearMemoryStore: () => memoryNotifications.clear()
};

const MongooseNotification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

const notificationModelProxy = new Proxy(MongooseNotification, {
  get(target, prop) {
    if (prop === '__clearMemoryStore') {
      return memoryNotificationModel.__clearMemoryStore;
    }
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryNotificationModel) {
      return memoryNotificationModel[prop];
    }
    return target[prop];
  }
});

module.exports = notificationModelProxy;
module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
module.exports.RESOURCE_TYPES = RESOURCE_TYPES;
