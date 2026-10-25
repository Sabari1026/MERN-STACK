/**
 * Mongoose Meeting Model for HireConnect (Phase 8)
 * Stores scheduled interview appointments, meeting modes, video links,
 * immutable audit history, and private recruiter notes.
 * Includes zero-dependency in-memory fallback for testing and offline development.
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const meetingHistorySchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
      enum: ['created', 'rescheduled', 'cancelled', 'completed']
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    actorName: {
      type: String,
      trim: true,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    previousStartAt: {
      type: Date,
      default: null
    },
    newStartAt: {
      type: Date,
      default: null
    },
    previousStatus: {
      type: String,
      default: null
    },
    newStatus: {
      type: String,
      default: null
    },
    reason: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const meetingSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter user reference is required'],
      index: true
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate user reference is required'],
      index: true
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
      index: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: null,
      index: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'CreatedBy user reference is required']
    },
    reference: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
      default: () => `HC-MEET-${Math.floor(100000 + Math.random() * 900000)}`
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      default: 'HireConnect Interview'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: ''
    },
    meetingType: {
      type: String,
      enum: ['interview', 'screening', 'introductory', 'technical', 'general'],
      default: 'interview',
      index: true
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 30
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
    timeZone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true
    },
    meetingMode: {
      type: String,
      enum: ['online', 'in_person'],
      default: 'online'
    },
    meetingLink: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      maxlength: [300, 'Location cannot exceed 300 characters'],
      default: ''
    },
    candidateNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Candidate notes cannot exceed 1000 characters'],
      default: ''
    },
    recruiterNotes: {
      type: String,
      trim: true,
      maxlength: [3000, 'Recruiter notes cannot exceed 3000 characters'],
      default: ''
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: ''
    },
    completedAt: {
      type: Date,
      default: null
    },
    history: {
      type: [meetingHistorySchema],
      default: []
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

// Compound indexes for range queries and conflict detection
meetingSchema.index({ recruiter: 1, startAt: 1, endAt: 1 });
meetingSchema.index({ recruiter: 1, status: 1, startAt: 1, endAt: 1 });
meetingSchema.index({ candidate: 1, startAt: 1 });

/**
 * Strips private recruiter notes for candidate consumption
 */
meetingSchema.methods.toCandidateJSON = function () {
  const obj = this.toJSON ? this.toJSON() : { ...this };
  delete obj.recruiterNotes;
  if (!obj.timezone) obj.timezone = obj.timeZone;
  if (!obj.videoUrl) obj.videoUrl = obj.meetingLink;
  return obj;
};

/**
 * Full representation for authorized recruiter
 */
meetingSchema.methods.toRecruiterJSON = function () {
  const obj = this.toJSON ? this.toJSON() : { ...this };
  if (!obj.timezone) obj.timezone = obj.timeZone;
  if (!obj.videoUrl) obj.videoUrl = obj.meetingLink;
  return obj;
};

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Fallback when MongoDB is disconnected)
// ============================================================================
const memoryMeetings = new Map();

class MemoryMeetingDocument {
  constructor(data = {}) {
    const id = data._id ? data._id.toString() : (data.id || `meet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    this._id = id;
    this.id = id;
    this.recruiter = data.recruiter || null;
    this.candidate = data.candidate || null;
    this.application = data.application || null;
    this.job = data.job || null;
    this.company = data.company || null;
    this.createdBy = data.createdBy || null;
    this.reference = data.reference || `HC-MEET-${Math.floor(100000 + Math.random() * 900000)}`;
    this.title = data.title || 'HireConnect Interview';
    this.description = data.description || '';
    this.meetingType = data.meetingType || 'interview';
    this.durationMinutes = typeof data.durationMinutes === 'number' ? data.durationMinutes : 30;
    this.startAt = data.startAt ? new Date(data.startAt) : new Date();
    this.endAt = data.endAt ? new Date(data.endAt) : new Date(this.startAt.getTime() + this.durationMinutes * 60000);
    this.timeZone = data.timeZone || 'Asia/Kolkata';
    this.status = data.status || 'scheduled';
    this.meetingMode = data.meetingMode || 'online';
    this.meetingLink = data.meetingLink || (this.reference ? `https://meet.hireconnect.io/room-${this.reference.toLowerCase()}` : '');
    this.location = data.location || '';
    this.candidateNotes = data.candidateNotes || '';
    this.recruiterNotes = data.recruiterNotes || '';
    this.cancelledAt = data.cancelledAt ? new Date(data.cancelledAt) : null;
    this.cancelledBy = data.cancelledBy || null;
    this.cancellationReason = data.cancellationReason || '';
    this.completedAt = data.completedAt ? new Date(data.completedAt) : null;
    this.history = Array.isArray(data.history) ? [...data.history] : [];
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    memoryMeetings.set(this._id.toString(), this);
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

  toCandidateJSON() {
    const obj = this.toObject();
    delete obj.recruiterNotes;
    if (!obj.timezone) obj.timezone = obj.timeZone;
    if (!obj.videoUrl) obj.videoUrl = obj.meetingLink;
    return obj;
  }

  toRecruiterJSON() {
    const obj = this.toObject();
    if (!obj.timezone) obj.timezone = obj.timeZone;
    if (!obj.videoUrl) obj.videoUrl = obj.meetingLink;
    return obj;
  }
}

class MemoryQuery {
  constructor(resultPromise) {
    this.resultPromise = resultPromise;
  }
  populate() {
    return this;
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
      const docRec = doc.recruiter?._id ? doc.recruiter._id.toString() : (doc.recruiter ? doc.recruiter.toString() : '');
      if (docRec !== qRec) return false;
    } else if (k === 'candidate') {
      const qCand = v?._id ? v._id.toString() : (v ? v.toString() : '');
      const docCand = doc.candidate?._id ? doc.candidate._id.toString() : (doc.candidate ? doc.candidate.toString() : '');
      if (docCand !== qCand) return false;
    } else if (k === 'reference') {
      if (doc.reference !== v) return false;
    } else if (k === 'status') {
      if (typeof v === 'object' && v.$ne) {
        if (doc.status === v.$ne) return false;
      } else if (doc.status !== v) {
        return false;
      }
    } else if (k === '$or') {
      const matched = v.some((subQ) => matchDocQuery(doc, subQ));
      if (!matched) return false;
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
    } else if (k === 'createdAt') {
      const docCreated = new Date(doc.createdAt).getTime();
      if (v.$gte && docCreated < new Date(v.$gte).getTime()) return false;
      if (v.$lte && docCreated > new Date(v.$lte).getTime()) return false;
      if (v.$lt && docCreated >= new Date(v.$lt).getTime()) return false;
      if (v.$gt && docCreated <= new Date(v.$gt).getTime()) return false;
    }
  }
  return true;
}

const memoryMeetingModel = {
  find(query = {}) {
    const promise = Promise.resolve().then(() => {
      const list = [];
      for (const doc of memoryMeetings.values()) {
        if (matchDocQuery(doc, query)) list.push(doc);
      }
      return list;
    });
    return new MemoryQuery(promise);
  },

  findOne(query = {}) {
    const promise = Promise.resolve().then(() => {
      for (const doc of memoryMeetings.values()) {
        if (matchDocQuery(doc, query)) return doc;
      }
      return null;
    });
    return new MemoryQuery(promise);
  },

  findById(id) {
    const promise = Promise.resolve().then(() => {
      if (!id) return null;
      return memoryMeetings.get(id.toString()) || null;
    });
    return new MemoryQuery(promise);
  },

  async countDocuments(query = {}) {
    let count = 0;
    for (const doc of memoryMeetings.values()) {
      if (matchDocQuery(doc, query)) count++;
    }
    return count;
  },

  async create(data) {
    const doc = new MemoryMeetingDocument(data);
    await doc.save();
    return doc;
  },

  __clearMemoryStore: () => memoryMeetings.clear()
};

let MongooseMeetingModel;
try {
  MongooseMeetingModel = mongoose.model('Meeting', meetingSchema);
} catch (e) {
  MongooseMeetingModel = mongoose.model('Meeting');
}

const MeetingProxy = new Proxy(MongooseMeetingModel, {
  get(target, prop) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return target[prop];
    }
    if (prop in memoryMeetingModel) {
      return memoryMeetingModel[prop];
    }
    return target[prop];
  },

  construct(target, args) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return new target(...args);
    }
    return new MemoryMeetingDocument(args[0]);
  }
});

module.exports = MeetingProxy;
