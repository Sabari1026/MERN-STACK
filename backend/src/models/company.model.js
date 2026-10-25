/**
 * Mongoose Company Model for HireConnect
 * Stores verified tech employers, company profiles, branding assets, and verification state.
 */

const mongoose = require('mongoose');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const headquartersSchema = new mongoose.Schema(
  {
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: 'India' }
  },
  { _id: false }
);

const socialLinksSchema = new mongoose.Schema(
  {
    linkedin: { type: String, trim: true, default: '' },
    twitter: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' },
    youtube: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 120,
      index: true
    },
    normalizedName: {
      type: String,
      trim: true,
      lowercase: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: ''
    },
    culture: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    industry: {
      type: String,
      trim: true,
      default: 'Technology',
      index: true
    },
    category: {
      type: String,
      trim: true,
      default: 'Technology'
    },
    companySize: {
      type: String,
      trim: true,
      default: '51-200 employees'
    },
    teamSize: {
      type: String,
      trim: true,
      default: '51-200 employees'
    },
    foundedYear: {
      type: String,
      trim: true,
      default: ''
    },
    headquarters: {
      type: headquartersSchema,
      default: () => ({ city: 'Bengaluru', state: 'Karnataka', country: 'India' })
    },
    locations: {
      type: [String],
      default: ['Bengaluru, Karnataka']
    },
    workModes: {
      type: [String],
      default: ['Hybrid']
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeAsset',
      default: null
    },
    logoUrl: {
      type: String,
      trim: true,
      default: ''
    },
    logoStorageKey: {
      type: String,
      trim: true,
      default: null
    },
    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeAsset',
      default: null
    },
    coverImageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    coverImageStorageKey: {
      type: String,
      trim: true,
      default: null
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      select: false, // excluded from public responses
      default: ''
    },
    publicContactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    publicPhone: {
      type: String,
      trim: true,
      default: ''
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({})
    },
    benefits: {
      type: [String],
      default: []
    },
    techStack: {
      type: [String],
      default: []
    },
    activeJobsCount: {
      type: Number,
      default: 0
    },
    // Server-Controlled Verification State
    verificationStatus: {
      type: String,
      enum: ['pending', 'under_review', 'verified', 'rejected', 'suspended'],
      default: 'pending',
      index: true
    },
    verified: {
      type: Boolean,
      default: false,
      index: true
    },
    verificationMethod: {
      type: String,
      enum: ['domain_email', 'business_registration', 'manual_audit', 'admin_override', null],
      default: null
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    verificationNotes: {
      type: String,
      select: false, // Internal notes hidden from public responses
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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
        delete ret.contactEmail;
        delete ret.verificationNotes;
        ret.verified = ret.verificationStatus === 'verified';
        return ret;
      }
    }
  }
);

// Pre-save hook to ensure normalizedName, verified sync, and clean locations
companySchema.pre('save', function (next) {
  if (this.name) {
    this.normalizedName = this.name.toLowerCase().trim();
  }
  this.verified = this.verificationStatus === 'verified';
  next();
});

// Method for safe public representation
companySchema.methods.toPublicJSON = function () {
  const json = this.toJSON ? this.toJSON() : { ...this };
  delete json.contactEmail;
  delete json.verificationNotes;
  json.verified = json.verificationStatus === 'verified';
  return json;
};

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Activated when MongoDB is not connected)
// ============================================================================
const memoryCompanies = new Map();

function generateUniqueMemorySlug(name, excludeId = null) {
  const base = slugify(name) || 'company';
  let candidate = base;
  let counter = 1;

  while (true) {
    let clash = false;
    for (const [id, comp] of memoryCompanies.entries()) {
      if (excludeId && id === excludeId) continue;
      if (comp.slug === candidate) {
        clash = true;
        break;
      }
    }
    if (!clash) return candidate;
    candidate = `${base}-${counter++}`;
  }
}

class MemoryCompanyDocument {
  constructor(data) {
    this._id = data._id || data.id || new mongoose.Types.ObjectId().toString();
    this.id = this._id.toString();
    this.name = (data.name || '').trim();
    this.normalizedName = this.name.toLowerCase();
    this.slug = data.slug || generateUniqueMemorySlug(this.name, this.id);
    this.description = data.description || '';
    this.culture = data.culture || '';
    this.website = data.website || '';
    this.industry = data.industry || data.category || 'Technology';
    this.category = data.category || this.industry;
    this.companySize = data.companySize || data.teamSize || '51-200 employees';
    this.teamSize = this.companySize;
    this.foundedYear = data.foundedYear || '';
    this.headquarters = data.headquarters || { city: 'Bengaluru', state: 'Karnataka', country: 'India' };
    this.locations = Array.isArray(data.locations) ? [...data.locations] : ['Bengaluru, Karnataka'];
    this.workModes = Array.isArray(data.workModes) ? [...data.workModes] : ['Hybrid'];
    this.logo = data.logo || null;
    this.logoUrl = data.logoUrl || '';
    this.logoStorageKey = data.logoStorageKey || null;
    this.coverImage = data.coverImage || null;
    this.coverImageUrl = data.coverImageUrl || '';
    this.coverImageStorageKey = data.coverImageStorageKey || null;
    this.contactEmail = data.contactEmail || '';
    this.publicContactEmail = data.publicContactEmail || '';
    this.publicPhone = data.publicPhone || '';
    this.socialLinks = data.socialLinks || {};
    this.benefits = Array.isArray(data.benefits) ? [...data.benefits] : [];
    this.techStack = Array.isArray(data.techStack) ? [...data.techStack] : [];
    this.activeJobsCount = data.activeJobsCount || 0;
    this.verificationStatus = data.verificationStatus || (data.verified ? 'verified' : 'pending');
    this.verified = this.verificationStatus === 'verified';
    this.verificationMethod = data.verificationMethod || (this.verified ? 'manual_audit' : null);
    this.verifiedAt = data.verifiedAt || (this.verified ? new Date() : null);
    this.verifiedBy = data.verifiedBy || null;
    this.verificationNotes = data.verificationNotes || '';
    this.createdBy = data.createdBy ? data.createdBy.toString() : 'system-seed';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    this.normalizedName = (this.name || '').toLowerCase().trim();
    this.verified = this.verificationStatus === 'verified';
    memoryCompanies.set(this.id, this);
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
    delete obj.contactEmail;
    delete obj.verificationNotes;
    obj.verified = obj.verificationStatus === 'verified';
    return obj;
  }

  toPublicJSON() {
    return this.toJSON();
  }
}

function matchCompanyQuery(comp, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, val] of Object.entries(query)) {
    if (key === '_id' || key === 'id') {
      const targetId = val && val._id ? val._id.toString() : (val ? val.toString() : '');
      if (comp.id !== targetId && comp._id.toString() !== targetId) return false;
      continue;
    }
    if (key === '$or' && Array.isArray(val)) {
      const anyMatches = val.some(subQuery => matchCompanyQuery(comp, subQuery));
      if (!anyMatches) return false;
      continue;
    }
    if (key === 'verificationStatus') {
      if (val && typeof val === 'object' && Array.isArray(val.$in)) {
        if (!val.$in.includes(comp.verificationStatus)) return false;
        continue;
      }
      if (comp.verificationStatus !== val) return false;
      continue;
    }
    if (key === 'verified') {
      if (comp.verified !== val) return false;
      continue;
    }
    if (key === 'createdBy') {
      const createdStr = comp.createdBy ? comp.createdBy.toString() : '';
      const targetCreated = val && val._id ? val._id.toString() : (val ? val.toString() : '');
      if (createdStr !== targetCreated) return false;
      continue;
    }
    if (key === 'slug') {
      if (comp.slug !== (val ? val.toString().toLowerCase() : '')) return false;
      continue;
    }
    if (key === 'normalizedName') {
      if (comp.normalizedName !== (val ? val.toString().toLowerCase() : '')) return false;
      continue;
    }
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if ('$in' in val && Array.isArray(val.$in)) {
        if (!val.$in.includes(comp[key])) return false;
        continue;
      }
      if ('$ne' in val) {
        if (comp[key] === val.$ne) return false;
        continue;
      }
      if ('$gte' in val || '$lte' in val || '$gt' in val || '$lt' in val) {
        let actualVal = comp[key];
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
      if (val instanceof RegExp) {
        if (!val.test(comp[key] || '')) return false;
        continue;
      }
    }
    if (comp[key] !== val) return false;
  }
  return true;
}

const memoryModel = {
  slugify,
  _memoryStore: memoryCompanies,
  __clearMemoryStore: () => memoryCompanies.clear(),

  async findOne(query = {}) {
    for (const comp of memoryCompanies.values()) {
      if (matchCompanyQuery(comp, query)) return comp;
    }
    return null;
  },

  async findById(id) {
    if (!id) return null;
    return memoryCompanies.get(id.toString()) || null;
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const doc = await this.findById(id);
    if (!doc) return null;
    const fields = update.$set || update;
    Object.assign(doc, fields);
    await doc.save();
    return doc;
  },

  async countDocuments(query = {}) {
    let count = 0;
    for (const comp of memoryCompanies.values()) {
      if (matchCompanyQuery(comp, query)) count++;
    }
    return count;
  },

  find(query = {}) {
    const results = [];
    for (const comp of memoryCompanies.values()) {
      if (matchCompanyQuery(comp, query)) results.push(comp);
    }

    const chain = {
      _results: results,
      sort(sortObj) {
        return chain;
      },
      skip(n) {
        chain._results = chain._results.slice(n);
        return chain;
      },
      limit(n) {
        chain._results = chain._results.slice(0, n);
        return chain;
      },
      then(resolve) {
        return Promise.resolve(chain._results).then(resolve);
      }
    };
    return chain;
  },

  async create(data) {
    const doc = new MemoryCompanyDocument(data);
    await doc.save();
    return doc;
  },

  async deleteOne(query) {
    for (const [id, comp] of memoryCompanies.entries()) {
      if ((query._id && id === query._id.toString()) || (query.slug && comp.slug === query.slug)) {
        memoryCompanies.delete(id);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  },

  async generateUniqueSlug(name, excludeId = null) {
    return generateUniqueMemorySlug(name, excludeId);
  }
};

let MongooseCompanyModel;
try {
  MongooseCompanyModel = mongoose.model('Company', companySchema);
} catch (e) {
  MongooseCompanyModel = mongoose.model('Company');
}

// Proxy wrapper that activates in-memory adapter if MongoDB is disconnected
const CompanyProxy = new Proxy(MongooseCompanyModel, {
  get(target, prop) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      if (prop === 'findById') {
        return function (id, ...rest) {
          if (id && !mongoose.Types.ObjectId.isValid(id)) {
            const cleanSlug = String(id).replace(/^comp-/, '');
            return target.findOne(
              {
                $or: [{ slug: id }, { slug: cleanSlug }, { id: id }, { normalizedName: cleanSlug }]
              },
              ...rest
            );
          }
          return target.findById(id, ...rest);
        };
      }
      if (prop === 'generateUniqueSlug') {
        return async function (name, excludeId = null) {
          const base = slugify(name) || 'company';
          let candidate = base;
          let counter = 1;
          while (true) {
            const query = { slug: candidate };
            if (excludeId) query._id = { $ne: excludeId };
            const existing = await target.findOne(query);
            if (!existing) return candidate;
            candidate = `${base}-${counter++}`;
          }
        };
      }
      return target[prop];
    }

    // Otherwise use memory adapter
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
    return new MemoryCompanyDocument(args[0]);
  }
});

module.exports = CompanyProxy;
