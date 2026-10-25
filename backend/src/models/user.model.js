/**
 * Mongoose User Model for HireConnect
 * Manages authentication credentials, account roles, OAuth linkages, and session security.
 * Features production-grade MongoDB schema with a zero-dependency in-memory fallback for
 * environments without an active MongoDB daemon.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authProviderSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ['local', 'google'],
      required: true
    },
    providerId: {
      type: String,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    linkedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    userAgent: {
      type: String,
      default: ''
    },
    ip: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      select: false // Never exposed in default queries
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin'],
      default: 'candidate',
      required: true
    },
    avatarUrl: {
      type: String,
      default: null
    },
    authProviders: {
      type: [authProviderSchema],
      default: []
    },
    emailVerifiedAt: {
      type: Date,
      default: null
    },
    accountStatus: {
      type: String,
      enum: ['active', 'pending_verification', 'suspended', 'deactivated'],
      default: 'active'
    },
    lastLoginAt: {
      type: Date,
      default: null
    },
    passwordChangedAt: {
      type: Date,
      default: null
    },
    // Password recovery fields
    passwordResetTokenHash: {
      type: String,
      select: false
    },
    passwordResetExpiresAt: {
      type: Date,
      select: false
    },
    // Email verification fields
    emailVerificationTokenHash: {
      type: String,
      select: false
    },
    emailVerificationExpiresAt: {
      type: Date,
      select: false
    },
    // Server-managed refresh token sessions
    refreshTokens: {
      type: [refreshTokenSchema],
      select: false,
      default: []
    },
    // Notification preferences (Phase 9)
    notificationPreferences: {
      email: {
        applicationStatus: { type: Boolean, default: true },
        newApplicant: { type: Boolean, default: true },
        interviewBooked: { type: Boolean, default: true },
        interviewReminders: { type: Boolean, default: true },
        jobUpdates: { type: Boolean, default: true },
        companyVerification: { type: Boolean, default: true }
      },
      inApp: {
        all: { type: Boolean, default: true }
      }
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.passwordResetTokenHash;
        delete ret.passwordResetExpiresAt;
        delete ret.emailVerificationTokenHash;
        delete ret.emailVerificationExpiresAt;
        delete ret.refreshTokens;
        return ret;
      }
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.passwordResetTokenHash;
        delete ret.passwordResetExpiresAt;
        delete ret.emailVerificationTokenHash;
        delete ret.emailVerificationExpiresAt;
        delete ret.refreshTokens;
        return ret;
      }
    }
  }
);

// Explicit compound/secondary indexes
userSchema.index({ role: 1, accountStatus: 1 });
userSchema.index({ 'authProviders.provider': 1, 'authProviders.providerId': 1 });

/**
 * Hash password static helper using bcrypt
 * @param {string} password
 * @returns {Promise<string>}
 */
userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password instance method
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Check if password was changed after a given timestamp
 * @param {number} jwtTimestamp
 * @returns {boolean}
 */
userSchema.methods.isPasswordChangedAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

/**
 * Clean representation safe for API consumption
 * @returns {object}
 */
userSchema.methods.toSafeObject = function () {
  return this.toJSON();
};

// =========================================================================
// In-Memory Fallback Adapter (for dev/test environments without MongoDB daemon)
// =========================================================================
const memoryStore = new Map();

class MemoryQuery {
  constructor(resultPromise) {
    this.resultPromise = resultPromise;
  }
  select() {
    return this;
  }
  sort(sortObj) {
    this.resultPromise = this.resultPromise.then((res) => {
      if (!Array.isArray(res)) return res;
      const copy = [...res];
      const entries = Object.entries(sortObj || {});
      if (!entries.length) return copy;
      const [field, dir] = entries[0];
      const mult = dir === -1 || dir === 'desc' ? -1 : 1;
      copy.sort((a, b) => {
        let va = a[field];
        let vb = b[field];
        if (va instanceof Date) va = va.getTime();
        if (vb instanceof Date) vb = vb.getTime();
        if (va == null && vb == null) return 0;
        if (va == null) return 1 * mult;
        if (vb == null) return -1 * mult;
        if (typeof va === 'string') return va.localeCompare(vb) * mult;
        return (va - vb) * mult;
      });
      return copy;
    });
    return this;
  }
  skip(n) {
    this.resultPromise = this.resultPromise.then((res) => (Array.isArray(res) ? res.slice(n) : res));
    return this;
  }
  limit(n) {
    this.resultPromise = this.resultPromise.then((res) => (Array.isArray(res) ? res.slice(0, n) : res));
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
  for (const [key, val] of Object.entries(query)) {
    if (key === '$or') {
      const anyMatches = val.some((subQuery) => matchQuery(doc, subQuery));
      if (!anyMatches) return false;
      continue;
    }
    if (key === 'email') {
      if (val instanceof RegExp) {
        if (!val.test(doc.email || '')) return false;
      } else if (doc.email.toLowerCase() !== String(val).toLowerCase()) {
        return false;
      }
    } else if (key === 'name') {
      if (val instanceof RegExp) {
        if (!val.test(doc.name || '')) return false;
      } else if (doc.name !== val) {
        return false;
      }
    } else if (key === '_id' || key === 'id') {
      const targetId = val._id ? val._id.toString() : val.toString();
      if (doc._id.toString() !== targetId && doc.id !== targetId) return false;
    } else if (key === 'refreshTokens.tokenHash') {
      const has = (doc.refreshTokens || []).some((t) => t.tokenHash === val);
      if (!has) return false;
    } else if (key === 'passwordResetTokenHash') {
      if (doc.passwordResetTokenHash !== val) return false;
    } else if (key === 'passwordResetExpiresAt') {
      if (val.$gt && (!doc.passwordResetExpiresAt || doc.passwordResetExpiresAt <= val.$gt)) {
        return false;
      }
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      if ('$in' in val) {
        if (!val.$in.includes(doc[key])) return false;
        continue;
      }
      if ('$ne' in val) {
        if (doc[key] === val.$ne) return false;
        continue;
      }
      if ('$gte' in val || '$lte' in val || '$gt' in val || '$lt' in val) {
        let actualVal = doc[key];
        if (actualVal instanceof Date) actualVal = actualVal.getTime();
        let gteVal = val.$gte instanceof Date ? val.$gte.getTime() : val.$gte;
        let lteVal = val.$lte instanceof Date ? val.$lte.getTime() : val.$lte;
        let gtVal = val.$gt instanceof Date ? val.$gt.getTime() : val.$gt;
        let ltVal = val.$lt instanceof Date ? val.$lt.getTime() : val.$lt;

        if (gteVal !== undefined && actualVal < gteVal) return false;
        if (lteVal !== undefined && actualVal > lteVal) return false;
        if (gtVal !== undefined && actualVal <= gtVal) return false;
        if (ltVal !== undefined && actualVal >= ltVal) return false;
        continue;
      }
    } else if (doc[key] !== val) {
      return false;
    }
  }
  return true;
}

const originalSave = mongoose.Model.prototype.save;
userSchema.method(
  'save',
  async function (options) {
    if (mongoose.connection.readyState === 1) {
      return originalSave.call(this, options);
    }
    await this.validate();
    this.updatedAt = new Date();
    if (!this.createdAt) this.createdAt = new Date();
    memoryStore.set(this._id.toString(), this);
    return this;
  },
  { suppressWarning: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const nativeFind = User.find;
User.find = function (query = {}, projection, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeFind.call(User, query, projection, options);
  }
  const promise = Promise.resolve().then(() => {
    const list = [];
    for (const doc of memoryStore.values()) {
      if (matchQuery(doc, query)) {
        list.push(doc);
      }
    }
    return list;
  });
  return new MemoryQuery(promise);
};

const nativeCountDocuments = User.countDocuments;
User.countDocuments = function (query = {}) {
  if (mongoose.connection.readyState === 1) {
    return nativeCountDocuments.call(User, query);
  }
  return Promise.resolve().then(() => {
    let count = 0;
    for (const doc of memoryStore.values()) {
      if (matchQuery(doc, query)) count++;
    }
    return count;
  });
};

const nativeFindOne = User.findOne;
User.findOne = function (query, projection, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeFindOne.call(User, query, projection, options);
  }
  const promise = Promise.resolve().then(() => {
    for (const doc of memoryStore.values()) {
      if (matchQuery(doc, query)) {
        return doc;
      }
    }
    return null;
  });
  return new MemoryQuery(promise);
};

const nativeFindById = User.findById;
User.findById = function (id, projection, options) {
  if (mongoose.connection.readyState === 1) {
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return User.findOne({
        $or: [{ email: String(id).toLowerCase() }]
      }, projection, options);
    }
    return nativeFindById.call(User, id, projection, options);
  }
  const promise = Promise.resolve().then(() => {
    if (!id) return null;
    const doc = memoryStore.get(id.toString());
    return doc || null;
  });
  return new MemoryQuery(promise);
};

const nativeUpdateOne = User.updateOne;
User.updateOne = function (query, update, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeUpdateOne.call(User, query, update, options);
  }
  return Promise.resolve().then(() => {
    for (const doc of memoryStore.values()) {
      if (matchQuery(doc, query)) {
        if (update.$pull && update.$pull.refreshTokens) {
          const targetHash = update.$pull.refreshTokens.tokenHash;
          doc.refreshTokens = (doc.refreshTokens || []).filter(
            (t) => t.tokenHash !== targetHash
          );
        }
        return { acknowledged: true, modifiedCount: 1, matchedCount: 1 };
      }
    }
    return { acknowledged: true, modifiedCount: 0, matchedCount: 0 };
  });
};

const nativeFindByIdAndUpdate = User.findByIdAndUpdate;
User.findByIdAndUpdate = function (id, update, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeFindByIdAndUpdate.call(User, id, update, options);
  }
  return Promise.resolve().then(() => {
    if (!id) return null;
    const doc = memoryStore.get(id.toString());
    if (doc) {
      if (update.$set) {
        Object.assign(doc, update.$set);
      } else {
        Object.assign(doc, update);
      }
    }
    return doc || null;
  });
};

const nativeCreate = User.create;
User.create = function (data) {
  if (mongoose.connection.readyState === 1) {
    return nativeCreate.call(User, data);
  }
  return Promise.resolve().then(async () => {
    const doc = new User(data);
    await doc.save();
    return doc;
  });
};

/**
 * Seed initial evaluation accounts with real bcrypt hashes
 */
User.__seedMemoryDefaults = async function () {
  const candidateHash = await bcrypt.hash('Candidate@123', 10);
  const recruiterHash = await bcrypt.hash('Recruiter@123', 10);
  const adminHash = await bcrypt.hash('Admin@123', 10);

  const candidate = new User({
    name: 'Aarav Sharma',
    email: 'candidate@hireconnect.io',
    passwordHash: candidateHash,
    role: 'candidate',
    accountStatus: 'active',
    emailVerifiedAt: new Date()
  });

  const recruiter = new User({
    name: 'Priya Mehta',
    email: 'recruiter@hireconnect.io',
    passwordHash: recruiterHash,
    role: 'recruiter',
    accountStatus: 'active',
    emailVerifiedAt: new Date()
  });

  const admin = new User({
    name: 'Platform Admin',
    email: 'admin@hireconnect.io',
    passwordHash: adminHash,
    role: 'admin',
    accountStatus: 'active',
    emailVerifiedAt: new Date()
  });

  memoryStore.set(candidate._id.toString(), candidate);
  memoryStore.set(recruiter._id.toString(), recruiter);
  memoryStore.set(admin._id.toString(), admin);
};

User.__seedDatabaseIfEmpty = async function () {
  try {
    const count = await User.countDocuments({});
    if (count === 0) {
      const candidateHash = await bcrypt.hash('Candidate@123', 10);
      const recruiterHash = await bcrypt.hash('Recruiter@123', 10);
      const adminHash = await bcrypt.hash('Admin@123', 10);

      await User.create([
        {
          name: 'Aarav Sharma',
          email: 'candidate@hireconnect.io',
          passwordHash: candidateHash,
          role: 'candidate',
          accountStatus: 'active',
          emailVerifiedAt: new Date()
        },
        {
          name: 'Priya Mehta',
          email: 'recruiter@hireconnect.io',
          passwordHash: recruiterHash,
          role: 'recruiter',
          accountStatus: 'active',
          emailVerifiedAt: new Date()
        },
        {
          name: 'Platform Admin',
          email: 'admin@hireconnect.io',
          passwordHash: adminHash,
          role: 'admin',
          accountStatus: 'active',
          emailVerifiedAt: new Date()
        }
      ]);
    }
  } catch (err) {
    // Graceful no-op if database operation fails
  }
};

User.__clearMemoryStore = function () {
  memoryStore.clear();
};

// Seed on startup for immediate dev usage
User.__seedMemoryDefaults().catch(() => {});

module.exports = User;
