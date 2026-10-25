/**
 * Notification Outbox Model for HireConnect (Phase 9)
 * Implements the Transactional Outbox pattern for reliable async email delivery,
 * bounded exponential backoff retries, and duplicate prevention.
 */

const mongoose = require('mongoose');

const OUTBOX_STATUSES = ['pending', 'processing', 'sent', 'failed', 'retry_scheduled'];

const notificationOutboxSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: [true, 'Event ID is required'],
      unique: true,
      index: true
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      index: true
    },
    recipient: {
      type: String,
      required: [true, 'Recipient email address is required'],
      lowercase: true,
      trim: true,
      index: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    subject: {
      type: String,
      required: [true, 'Email subject line is required'],
      trim: true
    },
    htmlContent: {
      type: String,
      required: [true, 'HTML content is required']
    },
    textContent: {
      type: String,
      required: [true, 'Plain text content is required']
    },
    status: {
      type: String,
      enum: OUTBOX_STATUSES,
      default: 'pending',
      index: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 5
    },
    nextRetryAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    lastError: {
      type: String,
      default: null
    },
    sentAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

notificationOutboxSchema.index({ status: 1, nextRetryAt: 1 });

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Fallback when MongoDB is disconnected)
// ============================================================================
const memoryOutbox = new Map();

class MemoryOutboxDocument {
  constructor(data = {}) {
    const id = data._id ? data._id.toString() : (data.id || `outbox-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    this._id = id;
    this.id = id;
    this.eventId = data.eventId || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.eventType = data.eventType || 'generic';
    this.recipient = (data.recipient || '').toLowerCase().trim();
    this.recipientId = data.recipientId?._id ? data.recipientId._id.toString() : (data.recipientId ? data.recipientId.toString() : null);
    this.subject = data.subject || '';
    this.htmlContent = data.htmlContent || '';
    this.textContent = data.textContent || '';
    this.status = data.status || 'pending';
    this.attempts = typeof data.attempts === 'number' ? data.attempts : 0;
    this.maxAttempts = typeof data.maxAttempts === 'number' ? data.maxAttempts : 5;
    this.nextRetryAt = data.nextRetryAt ? new Date(data.nextRetryAt) : new Date();
    this.lastError = data.lastError || null;
    this.sentAt = data.sentAt ? new Date(data.sentAt) : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    memoryOutbox.set(this._id.toString(), this);
    return this;
  }

  toObject() {
    return { ...this, id: this._id.toString() };
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
        if (criteria && criteria.nextRetryAt) {
          const dir = criteria.nextRetryAt === -1 ? -1 : 1;
          return (new Date(a.nextRetryAt) - new Date(b.nextRetryAt)) * dir;
        }
        return 0;
      });
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
    } else if (k === 'eventId') {
      if (doc.eventId !== v) return false;
    } else if (k === 'status') {
      if (typeof v === 'object' && v.$in) {
        if (!v.$in.includes(doc.status)) return false;
      } else if (doc.status !== v) {
        return false;
      }
    } else if (k === 'nextRetryAt') {
      const docRetry = new Date(doc.nextRetryAt).getTime();
      if (v.$lte && docRetry > new Date(v.$lte).getTime()) return false;
      if (v.$gte && docRetry < new Date(v.$gte).getTime()) return false;
    }
  }
  return true;
}

const memoryOutboxModel = {
  find(query = {}) {
    const promise = Promise.resolve().then(() => {
      const list = [];
      for (const doc of memoryOutbox.values()) {
        if (matchDocQuery(doc, query)) list.push(doc);
      }
      return list;
    });
    return new MemoryQuery(promise);
  },

  findOne(query = {}) {
    const promise = Promise.resolve().then(() => {
      for (const doc of memoryOutbox.values()) {
        if (matchDocQuery(doc, query)) return doc;
      }
      return null;
    });
    return new MemoryQuery(promise);
  },

  findById(id) {
    const promise = Promise.resolve().then(() => {
      if (!id) return null;
      return memoryOutbox.get(id.toString()) || null;
    });
    return new MemoryQuery(promise);
  },

  async create(data) {
    const doc = new MemoryOutboxDocument(data);
    await doc.save();
    return doc;
  },

  async countDocuments(query = {}) {
    let count = 0;
    for (const doc of memoryOutbox.values()) {
      if (matchDocQuery(doc, query)) count++;
    }
    return count;
  },

  __clearMemoryStore: () => memoryOutbox.clear()
};

const MongooseOutbox = mongoose.models.NotificationOutbox || mongoose.model('NotificationOutbox', notificationOutboxSchema);

const outboxModelProxy = new Proxy(MongooseOutbox, {
  get(target, prop) {
    if (prop === '__clearMemoryStore') {
      return memoryOutboxModel.__clearMemoryStore;
    }
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryOutboxModel) {
      return memoryOutboxModel[prop];
    }
    return target[prop];
  }
});

module.exports = outboxModelProxy;
module.exports.OUTBOX_STATUSES = OUTBOX_STATUSES;
