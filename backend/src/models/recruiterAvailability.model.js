/**
 * Mongoose RecruiterAvailability Model for HireConnect (Phase 8)
 * Stores recruiter working hours, weekly recurring rules, and scheduling constraints.
 * Includes zero-dependency in-memory fallback for testing and offline development.
 */

const mongoose = require('mongoose');
const { isValidTimeZone } = require('../utils/timeZone');

const weeklyRuleSchema = new mongoose.Schema(
  {
    weekday: {
      type: String,
      required: true,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      lowercase: true,
      trim: true
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'startTime must be formatted as HH:mm (24-hour)']
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'endTime must be formatted as HH:mm (24-hour)']
    }
  },
  { _id: false }
);

const recruiterAvailabilitySchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter user reference is required'],
      unique: true,
      index: true
    },
    timeZone: {
      type: String,
      required: true,
      default: 'Asia/Kolkata',
      validate: {
        validator: isValidTimeZone,
        message: 'Invalid IANA time zone identifier'
      }
    },
    weeklyRules: {
      type: [weeklyRuleSchema],
      default: () => [
        { weekday: 'monday', startTime: '09:00', endTime: '17:00' },
        { weekday: 'tuesday', startTime: '09:00', endTime: '17:00' },
        { weekday: 'wednesday', startTime: '09:00', endTime: '17:00' },
        { weekday: 'thursday', startTime: '09:00', endTime: '17:00' },
        { weekday: 'friday', startTime: '09:00', endTime: '17:00' }
      ]
    },
    slotDurations: {
      type: [Number],
      default: [15, 30, 45, 60],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0 && arr.every((d) => d > 0),
        message: 'slotDurations must contain at least one positive minute duration'
      }
    },
    bufferBeforeMinutes: {
      type: Number,
      default: 0,
      min: 0,
      max: 60
    },
    bufferAfterMinutes: {
      type: Number,
      default: 0,
      min: 0,
      max: 60
    },
    minimumNoticeMinutes: {
      type: Number,
      default: 120,
      min: 0
    },
    maximumBookingDaysAhead: {
      type: Number,
      default: 30,
      min: 1,
      max: 90
    },
    active: {
      type: Boolean,
      default: true
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

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Fallback when MongoDB is disconnected)
// ============================================================================
const memoryAvailabilities = new Map();

class MemoryAvailabilityDocument {
  constructor(data = {}) {
    const id = data._id ? data._id.toString() : (data.id || `avail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    this._id = id;
    this.id = id;
    this.recruiter = data.recruiter || data.recruiterId || null;
    this.recruiterId = data.recruiterId || (this.recruiter ? (this.recruiter._id ? this.recruiter._id.toString() : this.recruiter.toString()) : null);
    this.timeZone = data.timeZone || 'Asia/Kolkata';
    this.weeklyRules = Array.isArray(data.weeklyRules)
      ? data.weeklyRules.map((r) => ({ ...r }))
      : [
          { weekday: 'monday', startTime: '09:00', endTime: '17:00' },
          { weekday: 'tuesday', startTime: '09:00', endTime: '17:00' },
          { weekday: 'wednesday', startTime: '09:00', endTime: '17:00' },
          { weekday: 'thursday', startTime: '09:00', endTime: '17:00' },
          { weekday: 'friday', startTime: '09:00', endTime: '17:00' }
        ];
    this.slotDurations = Array.isArray(data.slotDurations) ? [...data.slotDurations] : [15, 30, 45, 60];
    this.bufferBeforeMinutes = typeof data.bufferBeforeMinutes === 'number' ? data.bufferBeforeMinutes : 0;
    this.bufferAfterMinutes = typeof data.bufferAfterMinutes === 'number' ? data.bufferAfterMinutes : 0;
    this.minimumNoticeMinutes = typeof data.minimumNoticeMinutes === 'number' ? data.minimumNoticeMinutes : 120;
    this.maximumBookingDaysAhead = typeof data.maximumBookingDaysAhead === 'number' ? data.maximumBookingDaysAhead : 30;
    this.active = data.active !== undefined ? Boolean(data.active) : true;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    if (this.recruiter) {
      this.recruiterId = this.recruiter._id ? this.recruiter._id.toString() : this.recruiter.toString();
    }

    // Check unique recruiter
    for (const [id, existing] of memoryAvailabilities.entries()) {
      if (id !== this._id.toString()) {
        const existRec = existing.recruiterId || (existing.recruiter ? existing.recruiter.toString() : '');
        if (existRec && this.recruiterId && existRec === this.recruiterId) {
          const err = new Error('E11000 duplicate key error collection: recruiteravailabilities index: recruiter_1 dup key');
          err.code = 11000;
          throw err;
        }
      }
    }

    memoryAvailabilities.set(this._id.toString(), this);
    return this;
  }

  toObject() {
    return {
      id: this._id.toString(),
      _id: this._id,
      recruiter: this.recruiter,
      timeZone: this.timeZone,
      weeklyRules: [...this.weeklyRules],
      slotDurations: [...this.slotDurations],
      bufferBeforeMinutes: this.bufferBeforeMinutes,
      bufferAfterMinutes: this.bufferAfterMinutes,
      minimumNoticeMinutes: this.minimumNoticeMinutes,
      maximumBookingDaysAhead: this.maximumBookingDaysAhead,
      active: this.active,
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
  select() {
    return this;
  }
  populate() {
    return this;
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
      const qId = v?._id ? v._id.toString() : (v ? v.toString() : '');
      if (doc._id.toString() !== qId) return false;
    } else if (k === 'recruiter') {
      const qRec = v?._id ? v._id.toString() : (v ? v.toString() : '');
      const docRec = doc.recruiterId || (doc.recruiter ? (doc.recruiter._id ? doc.recruiter._id.toString() : doc.recruiter.toString()) : '');
      if (docRec !== qRec) return false;
    } else if (k === 'active') {
      if (doc.active !== v) return false;
    }
  }
  return true;
}

const memoryAvailabilityModel = {
  findOne(query = {}) {
    const promise = Promise.resolve().then(() => {
      for (const doc of memoryAvailabilities.values()) {
        if (matchQuery(doc, query)) return doc;
      }
      return null;
    });
    return new MemoryQuery(promise);
  },

  findById(id) {
    const promise = Promise.resolve().then(() => {
      if (!id) return null;
      return memoryAvailabilities.get(id.toString()) || null;
    });
    return new MemoryQuery(promise);
  },

  async create(data) {
    const doc = new MemoryAvailabilityDocument(data);
    await doc.save();
    return doc;
  },

  __clearMemoryStore: () => memoryAvailabilities.clear()
};

let MongooseRecruiterAvailabilityModel;
try {
  MongooseRecruiterAvailabilityModel = mongoose.model('RecruiterAvailability', recruiterAvailabilitySchema);
} catch (e) {
  MongooseRecruiterAvailabilityModel = mongoose.model('RecruiterAvailability');
}

const RecruiterAvailabilityProxy = new Proxy(MongooseRecruiterAvailabilityModel, {
  get(target, prop) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return target[prop];
    }
    if (prop in memoryAvailabilityModel) {
      return memoryAvailabilityModel[prop];
    }
    return target[prop];
  },

  construct(target, args) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return new target(...args);
    }
    return new MemoryAvailabilityDocument(args[0]);
  }
});

module.exports = RecruiterAvailabilityProxy;
