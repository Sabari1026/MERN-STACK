/**
 * Mongoose Job Model for HireConnect
 * Manages job listings, lifecycle states (draft, published, closed),
 * company relationships, salary/experience parameters, and search indexing.
 */

const mongoose = require('mongoose');
const Company = require('./company.model');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Job title cannot exceed 150 characters'],
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
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Associated company is required'],
      index: true
    },
    companyName: {
      type: String,
      trim: true,
      default: ''
    },
    companyLogo: {
      type: String,
      trim: true,
      default: null
    },
    companyCategory: {
      type: String,
      trim: true,
      default: 'Technology'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    department: {
      type: String,
      trim: true,
      default: 'Engineering'
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'fullstack',
      index: true
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time',
      lowercase: true,
      index: true
    },
    workMode: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      default: 'hybrid',
      lowercase: true,
      index: true
    },
    location: {
      type: String,
      trim: true,
      default: 'Bengaluru, Karnataka',
      index: true
    },
    city: {
      type: String,
      trim: true,
      default: ''
    },
    state: {
      type: String,
      trim: true,
      default: ''
    },
    country: {
      type: String,
      trim: true,
      default: 'India'
    },
    experienceMin: {
      type: Number,
      min: 0,
      default: 0
    },
    experienceMax: {
      type: Number,
      min: 0,
      default: null
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
      default: 'mid'
    },
    experience: {
      type: String,
      trim: true,
      default: ''
    },
    salaryMin: {
      type: Number,
      min: 0,
      default: null
    },
    salaryMax: {
      type: Number,
      min: 0,
      default: null
    },
    salaryCurrency: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'INR'
    },
    salaryPeriod: {
      type: String,
      enum: ['annual', 'monthly', 'hourly'],
      default: 'annual'
    },
    salaryDisclosure: {
      type: String,
      enum: ['disclosed', 'undisclosed'],
      default: 'disclosed'
    },
    salary: {
      type: String,
      trim: true,
      default: 'Competitive'
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      minlength: [20, 'Job description must be at least 20 characters']
    },
    shortDescription: {
      type: String,
      trim: true,
      default: ''
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: []
    },
    preferredSkills: {
      type: [String],
      default: []
    },
    responsibilities: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    perks: {
      type: [String],
      default: []
    },
    benefits: {
      type: [String],
      default: []
    },
    applicationMethod: {
      type: String,
      enum: ['internal', 'external'],
      default: 'internal'
    },
    externalApplicationUrl: {
      type: String,
      trim: true,
      default: null
    },
    applyUrl: {
      type: String,
      trim: true,
      default: null
    },
    source: {
      type: String,
      trim: true,
      default: 'HireConnect Verified Employer'
    },
    applicationDeadline: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed', 'paused'],
      default: 'draft',
      index: true
    },
    publishedAt: {
      type: Date,
      default: null
    },
    closedAt: {
      type: Date,
      default: null
    },
    openingsCount: {
      type: Number,
      min: 1,
      default: 1
    },
    applicantCount: {
      type: Number,
      min: 0,
      default: 0
    },
    viewsCount: {
      type: Number,
      min: 0,
      default: 0
    },
    isModerated: {
      type: Boolean,
      default: false,
      index: true
    },
    moderationStatus: {
      type: String,
      enum: ['approved', 'flagged', 'removed'],
      default: 'approved',
      index: true
    },
    moderationReason: {
      type: String,
      trim: true,
      default: ''
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    moderatedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        if (ret.company && typeof ret.company === 'object') {
          if (!ret.companyName && ret.company.name) {
            ret.companyName = ret.company.name;
          }
          if (!ret.companyLogo && ret.company.logoUrl) {
            ret.companyLogo = ret.company.logoUrl;
          }
        }
        return ret;
      }
    }
  }
);

jobSchema.pre('validate', async function (next) {
  if (!this.slug && this.title) {
    const base = slugify(this.title) || 'job';
    let candidate = base;
    let counter = 1;
    const JobModel = this.constructor;
    while (true) {
      const query = { slug: candidate };
      if (this._id) query._id = { $ne: this._id };
      const existing = await JobModel.findOne(query);
      if (!existing) {
        this.slug = candidate;
        break;
      }
      candidate = `${base}-${counter++}`;
    }
  }
  if (typeof next === 'function') next();
});

// Compound text search index for fast keyword lookup
jobSchema.index({
  title: 'text',
  description: 'text',
  companyName: 'text',
  skills: 'text',
  requiredSkills: 'text'
});

// Indexes for common filter combinations
jobSchema.index({ status: 1, publishedAt: -1 });
jobSchema.index({ status: 1, category: 1 });
jobSchema.index({ status: 1, workMode: 1 });
jobSchema.index({ company: 1, status: 1 });
jobSchema.index({ recruiter: 1, status: 1 });
jobSchema.index({ status: 1, moderationStatus: 1 });

// Helper to format experience string
function formatExperienceString(min, max) {
  if (min != null && max != null) {
    return `${min} - ${max} Years`;
  }
  if (min != null) {
    return `${min}+ Years`;
  }
  if (max != null) {
    return `Up to ${max} Years`;
  }
  return 'Not specified';
}

// Helper to format salary string
function formatSalaryString(min, max, disclosure, currency = '₹', period = 'LPA') {
  if (disclosure === 'undisclosed') return 'Competitive';
  if (min != null && max != null) {
    return `${currency}${min} - ${max} ${period}`;
  }
  if (min != null) {
    return `${currency}${min}+ ${period}`;
  }
  if (max != null) {
    return `Up to ${currency}${max} ${period}`;
  }
  return 'Competitive';
}

// ============================================================================
// ZERO-DEPENDENCY IN-MEMORY ADAPTER (Fallback when MongoDB is disconnected)
// ============================================================================
const memoryJobs = new Map();

function generateUniqueMemorySlug(title, excludeId = null) {
  const base = slugify(title) || 'job';
  let candidate = base;
  let counter = 1;
  while (true) {
    let exists = false;
    for (const [id, job] of memoryJobs.entries()) {
      if (excludeId && id === excludeId.toString()) continue;
      if (job.slug === candidate) {
        exists = true;
        break;
      }
    }
    if (!exists) return candidate;
    candidate = `${base}-${counter++}`;
  }
}

class MemoryJobDocument {
  constructor(data = {}) {
    const id = data._id ? data._id.toString() : (data.id || `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    this._id = id;
    this.id = id;
    this.title = data.title || '';
    this.slug = data.slug || generateUniqueMemorySlug(this.title, this._id);
    this.company = data.company || data.companyId || null;
    this.companyName = data.companyName || (typeof data.company === 'string' ? data.company : '');
    this.companyLogo = data.companyLogo || null;
    this.companyCategory = data.companyCategory || 'Technology';
    this.createdBy = data.createdBy || data.recruiter || data.recruiterId || null;
    this.recruiter = data.recruiter || data.createdBy || data.recruiterId || null;
    this.department = data.department || 'Engineering';
    this.category = (data.category || 'fullstack').toLowerCase();
    this.employmentType = (data.employmentType || 'full-time').toLowerCase();
    this.workMode = (data.workMode || 'hybrid').toLowerCase();
    this.location = data.location || 'Bengaluru, Karnataka';
    this.city = data.city || '';
    this.state = data.state || '';
    this.country = data.country || 'India';
    this.experienceMin = data.experienceMin != null ? Number(data.experienceMin) : 0;
    this.experienceMax = data.experienceMax != null ? Number(data.experienceMax) : null;
    this.experienceLevel = data.experienceLevel || 'mid';
    this.experience = data.experience || formatExperienceString(this.experienceMin, this.experienceMax);
    this.salaryMin = data.salaryMin != null ? Number(data.salaryMin) : null;
    this.salaryMax = data.salaryMax != null ? Number(data.salaryMax) : null;
    this.salaryCurrency = data.salaryCurrency || 'INR';
    this.salaryPeriod = data.salaryPeriod || 'annual';
    this.salaryDisclosure = data.salaryDisclosure || (data.salaryDisclosed === false ? 'undisclosed' : 'disclosed');
    this.salary = data.salary || formatSalaryString(this.salaryMin, this.salaryMax, this.salaryDisclosure);
    this.description = data.description || '';
    this.shortDescription = data.shortDescription || (this.description ? this.description.slice(0, 160) : '');
    
    // Skills sync
    const skillsList = Array.isArray(data.skills) ? data.skills : (Array.isArray(data.requiredSkills) ? data.requiredSkills : []);
    this.skills = [...skillsList];
    this.requiredSkills = Array.isArray(data.requiredSkills) ? [...data.requiredSkills] : [...skillsList];
    this.preferredSkills = Array.isArray(data.preferredSkills) ? [...data.preferredSkills] : [];

    // Responsibilities, requirements, benefits/perks sync
    this.responsibilities = Array.isArray(data.responsibilities) ? [...data.responsibilities] : [];
    this.requirements = Array.isArray(data.requirements) ? [...data.requirements] : [];
    const perksList = Array.isArray(data.perks) ? data.perks : (Array.isArray(data.benefits) ? data.benefits : []);
    this.perks = [...perksList];
    this.benefits = Array.isArray(data.benefits) ? [...data.benefits] : [...perksList];

    this.applicationMethod = data.applicationMethod || (data.applyUrl || data.externalApplicationUrl ? 'external' : 'internal');
    this.externalApplicationUrl = data.externalApplicationUrl || data.applyUrl || null;
    this.applyUrl = this.externalApplicationUrl;
    this.source = data.source || 'HireConnect Verified Employer';
    this.applicationDeadline = data.applicationDeadline || (data.deadline ? new Date(data.deadline) : null);
    this.status = data.status || 'draft';
    this.publishedAt = data.publishedAt ? new Date(data.publishedAt) : (this.status === 'published' ? new Date() : null);
    this.closedAt = data.closedAt ? new Date(data.closedAt) : null;
    this.openingsCount = data.openingsCount != null ? Number(data.openingsCount) : 1;
    this.applicantCount = data.applicantCount != null ? Number(data.applicantCount) : 0;
    this.viewsCount = data.viewsCount != null ? Number(data.viewsCount) : 0;
    this.isModerated = data.isModerated != null ? Boolean(data.isModerated) : false;
    this.moderationStatus = data.moderationStatus || 'approved';
    this.moderationReason = data.moderationReason || '';
    this.moderatedBy = data.moderatedBy ? (data.moderatedBy._id || data.moderatedBy).toString() : null;
    this.moderatedAt = data.moderatedAt ? new Date(data.moderatedAt) : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    if (!this.slug) {
      this.slug = generateUniqueMemorySlug(this.title, this._id);
    }
    // Normalize string representation of workMode, employmentType
    if (this.workMode) this.workMode = this.workMode.toLowerCase();
    if (this.employmentType) this.employmentType = this.employmentType.toLowerCase();

    // Re-sync skills and perks
    if (this.skills && !this.requiredSkills?.length) this.requiredSkills = [...this.skills];
    if (this.requiredSkills && !this.skills?.length) this.skills = [...this.requiredSkills];
    if (this.perks && !this.benefits?.length) this.benefits = [...this.perks];
    if (this.benefits && !this.perks?.length) this.perks = [...this.benefits];
    if (this.externalApplicationUrl && !this.applyUrl) this.applyUrl = this.externalApplicationUrl;
    if (this.applyUrl && !this.externalApplicationUrl) this.externalApplicationUrl = this.applyUrl;

    memoryJobs.set(this._id.toString(), this);
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
}

function matchJobQuery(job, query) {
  for (const [key, val] of Object.entries(query)) {
    if (key === '_id') {
      const targetId = val._id ? val._id.toString() : val.toString();
      if (job._id.toString() !== targetId && job.id !== targetId) return false;
      continue;
    }
    if (key === '$or') {
      const anyMatches = val.some(subQuery => matchJobQuery(job, subQuery));
      if (!anyMatches) return false;
      continue;
    }
    if (key === '$text') {
      const search = val.$search ? val.$search.toLowerCase() : '';
      const haystack = `${job.title} ${job.description} ${job.companyName} ${(job.skills || []).join(' ')}`.toLowerCase();
      if (!haystack.includes(search)) return false;
      continue;
    }
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if ('$in' in val) {
        const allowed = val.$in.map(v => (v._id ? v._id.toString() : v.toString()));
        const actual = job[key] ? (job[key]._id ? job[key]._id.toString() : job[key].toString()) : '';
        if (!allowed.includes(actual)) return false;
        continue;
      }
      if ('$ne' in val) {
        const targetVal = val.$ne ? (val.$ne._id ? val.$ne._id.toString() : val.$ne.toString()) : val.$ne;
        const actualVal = job[key] ? (job[key]._id ? job[key]._id.toString() : job[key].toString()) : job[key];
        if (actualVal === targetVal) return false;
        continue;
      }
      if ('$gte' in val || '$lte' in val || '$gt' in val || '$lt' in val) {
        let actualVal = job[key];
        if (actualVal instanceof Date) actualVal = actualVal.getTime();
        let gteVal = val.$gte instanceof Date ? val.$gte.getTime() : (val.$gte != null ? Number(val.$gte) : undefined);
        let lteVal = val.$lte instanceof Date ? val.$lte.getTime() : (val.$lte != null ? Number(val.$lte) : undefined);
        let gtVal = val.$gt instanceof Date ? val.$gt.getTime() : (val.$gt != null ? Number(val.$gt) : undefined);
        let ltVal = val.$lt instanceof Date ? val.$lt.getTime() : (val.$lt != null ? Number(val.$lt) : undefined);

        const num = actualVal != null ? Number(actualVal) : null;
        if (num == null || Number.isNaN(num)) return false;
        if (gteVal !== undefined && num < gteVal) return false;
        if (lteVal !== undefined && num > lteVal) return false;
        if (gtVal !== undefined && num <= gtVal) return false;
        if (ltVal !== undefined && num >= ltVal) return false;
        continue;
      }
      if (val instanceof RegExp) {
        if (Array.isArray(job[key])) {
          if (!job[key].some(item => val.test(item))) return false;
        } else if (!val.test(job[key] || '')) {
          return false;
        }
        continue;
      }
    }
    const actual = job[key];
    const expected = (val && val._id) ? val._id.toString() : val;
    if (actual !== expected && (actual && actual.toString() !== (expected && expected.toString()))) {
      return false;
    }
  }
  return true;
}

class MemoryJobQueryChain {
  constructor(results, isSingle = false) {
    this._results = results;
    this._isSingle = isSingle;
    this._populateCompany = false;
  }

  populate(field) {
    if (field === 'company') {
      this._populateCompany = true;
    }
    return this;
  }

  sort(sortObj) {
    if (!sortObj) return this;
    const entries = Object.entries(sortObj);
    if (!entries.length) return this;
    const [field, dir] = entries[0];
    const mult = dir === -1 || dir === 'desc' ? -1 : 1;

    this._results.sort((a, b) => {
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
    return this;
  }

  skip(n) {
    this._results = this._results.slice(n);
    return this;
  }

  limit(n) {
    this._results = this._results.slice(0, n);
    return this;
  }

  async exec() {
    if (this._isSingle) {
      const doc = this._results[0] || null;
      if (!doc) return null;
      if (this._populateCompany && doc.company) {
        const compDoc = await Company.findById(doc.company);
        if (compDoc) {
          const clone = new MemoryJobDocument(doc.toObject());
          clone.company = compDoc;
          return clone;
        }
      }
      return doc;
    }

    if (this._populateCompany) {
      return Promise.all(
        this._results.map(async (doc) => {
          if (doc.company) {
            const compDoc = await Company.findById(doc.company);
            if (compDoc) {
              const clone = new MemoryJobDocument(doc.toObject());
              clone.company = compDoc;
              return clone;
            }
          }
          return doc;
        })
      );
    }
    return this._results;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

const memoryJobModel = {
  _jobs: memoryJobs,

  find(query = {}) {
    const matched = [];
    for (const job of memoryJobs.values()) {
      if (matchJobQuery(job, query)) {
        matched.push(job);
      }
    }
    return new MemoryJobQueryChain(matched, false);
  },

  findOne(query = {}) {
    for (const job of memoryJobs.values()) {
      if (matchJobQuery(job, query)) {
        return new MemoryJobQueryChain([job], true);
      }
    }
    return new MemoryJobQueryChain([], true);
  },

  findById(id) {
    if (!id) return new MemoryJobQueryChain([], true);
    const strId = id._id ? id._id.toString() : id.toString();
    const doc = memoryJobs.get(strId);
    if (doc) {
      return new MemoryJobQueryChain([doc], true);
    }
    for (const j of memoryJobs.values()) {
      if (j.id === strId || j._id.toString() === strId) {
        return new MemoryJobQueryChain([j], true);
      }
    }
    return new MemoryJobQueryChain([], true);
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const doc = await this.findById(id);
    if (!doc) return null;

    const data = update.$set || update;
    Object.assign(doc, data);
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) {
        doc[k] = (doc[k] || 0) + v;
      }
    }
    await doc.save();
    return doc;
  },

  async countDocuments(query = {}) {
    let count = 0;
    for (const job of memoryJobs.values()) {
      if (matchJobQuery(job, query)) count++;
    }
    return count;
  },

  async create(data) {
    const doc = new MemoryJobDocument(data);
    await doc.save();
    return doc;
  },

  async deleteOne(query) {
    for (const [id, job] of memoryJobs.entries()) {
      if (matchJobQuery(job, query)) {
        memoryJobs.delete(id);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  },

  async deleteMany(query = {}) {
    let deletedCount = 0;
    for (const [id, job] of memoryJobs.entries()) {
      if (matchJobQuery(job, query)) {
        memoryJobs.delete(id);
        deletedCount++;
      }
    }
    return { deletedCount };
  },

  generateUniqueSlug(title, excludeId = null) {
    return generateUniqueMemorySlug(title, excludeId);
  },

  __clearMemoryStore: () => memoryJobs.clear()
};

let MongooseJobModel;
try {
  MongooseJobModel = mongoose.model('Job', jobSchema);
} catch (e) {
  MongooseJobModel = mongoose.model('Job');
}

// Proxy wrapper that routes to memory adapter when MongoDB connection is not active
const JobProxy = new Proxy(MongooseJobModel, {
  get(target, prop) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      if (prop === 'findById') {
        return function (id, ...rest) {
          if (id && !mongoose.Types.ObjectId.isValid(id)) {
            return target.findOne(
              {
                $or: [{ slug: id }, { id: id }]
              },
              ...rest
            );
          }
          return target.findById(id, ...rest);
        };
      }
      if (prop === 'generateUniqueSlug') {
        return async function (title, excludeId = null) {
          const base = slugify(title) || 'job';
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

    if (prop in memoryJobModel) {
      return memoryJobModel[prop];
    }
    return target[prop];
  },

  construct(target, args) {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return new target(...args);
    }
    return new MemoryJobDocument(args[0]);
  }
});

module.exports = JobProxy;
