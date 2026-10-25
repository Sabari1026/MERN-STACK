/**
 * Mongoose ResumeAsset Model for HireConnect
 * Stores metadata for candidate resume documents stored securely in private object storage.
 */

const mongoose = require('mongoose');

const resumeAssetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    storageKey: {
      type: String,
      required: true,
      unique: true
    },
    originalFilename: {
      type: String,
      required: true,
      trim: true
    },
    mimeType: {
      type: String,
      required: true
    },
    sizeBytes: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isCurrent: {
      type: Boolean,
      default: true,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        ret.fileName = ret.originalFilename;
        ret.fileSize = ret.sizeBytes;
        const uid = ret.user ? (ret.user._id ? ret.user._id.toString() : ret.user.toString()) : '';
        ret.fileUrl = uid ? `/api/profile/resume/download/${uid}` : '';
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// =========================================================================
// In-Memory Fallback Adapter (for dev/test environments without MongoDB daemon)
// =========================================================================
const memoryStore = new Map();

class MemoryQuery {
  constructor(resultPromise) {
    this.resultPromise = resultPromise;
  }
  populate() {
    return this;
  }
  select() {
    return this;
  }
  sort() {
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
    if (key === '_id' || key === 'id') {
      if (doc._id.toString() !== val.toString()) return false;
    } else if (key === 'user') {
      if (doc.user.toString() !== val.toString()) return false;
    } else if (doc[key] !== val) {
      return false;
    }
  }
  return true;
}

const originalSave = mongoose.Model.prototype.save;
resumeAssetSchema.method(
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

const ResumeAsset = mongoose.models.ResumeAsset || mongoose.model('ResumeAsset', resumeAssetSchema);

const nativeFindOne = ResumeAsset.findOne;
ResumeAsset.findOne = function (query, projection, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeFindOne.call(ResumeAsset, query, projection, options);
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

const nativeFindById = ResumeAsset.findById;
ResumeAsset.findById = function (id, projection, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeFindById.call(ResumeAsset, id, projection, options);
  }
  const promise = Promise.resolve().then(() => {
    if (!id) return null;
    return memoryStore.get(id.toString()) || null;
  });
  return new MemoryQuery(promise);
};

const nativeUpdateMany = ResumeAsset.updateMany;
ResumeAsset.updateMany = function (query, update, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeUpdateMany.call(ResumeAsset, query, update, options);
  }
  return Promise.resolve().then(() => {
    let count = 0;
    for (const doc of memoryStore.values()) {
      if (query.user && doc.user.toString() !== query.user.toString()) continue;
      if (query._id && query._id.$ne && doc._id.toString() === query._id.$ne.toString()) continue;
      if (update.$set) {
        Object.assign(doc, update.$set);
      } else {
        Object.assign(doc, update);
      }
      count++;
    }
    return { acknowledged: true, modifiedCount: count };
  });
};

const nativeCreate = ResumeAsset.create;
ResumeAsset.create = async function (docs, options) {
  if (mongoose.connection.readyState === 1) {
    return nativeCreate.call(ResumeAsset, docs, options);
  }
  if (Array.isArray(docs)) {
    const list = [];
    for (const d of docs) {
      const doc = new ResumeAsset(d);
      await doc.save();
      list.push(doc);
    }
    return list;
  }
  const doc = new ResumeAsset(docs);
  await doc.save();
  return doc;
};

ResumeAsset.__clearMemoryStore = function () {
  memoryStore.clear();
};

module.exports = ResumeAsset;
