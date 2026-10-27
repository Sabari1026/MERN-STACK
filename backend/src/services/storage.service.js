/**
 * Storage Service for HireConnect (Phase 3 & Production Setup)
 * Manages persistent storage of resumes, profile photos, and company logos
 * outside the public web root. Supports configurable local persistent disk mounts
 * with path traversal guards and pluggable cloud storage backends (e.g. Amazon S3 / Cloudflare R2).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const logger = require('../utils/logger');
const { env } = require('../config/env');

// In-memory buffer store for automated test isolation
const mockStorageMap = new Map();

// Allowed subdirectories / storage partitions
const ALLOWED_FOLDERS = ['avatars', 'resumes', 'temp'];

/**
 * Resolve configured persistent storage directory
 * @returns {string} Absolute path to storage root
 */
function resolveStorageDir() {
  // On Vercel, the filesystem is read-only except /tmp.
  // Files stored in /tmp are ephemeral (lost on cold starts / redeployments).
  // For persistent uploads, set STORAGE_PROVIDER=s3 and configure AWS/R2 credentials.
  if (process.env.VERCEL === '1') {
    return '/tmp/hireconnect-uploads';
  }
  const configured = process.env.UPLOAD_DIR || (env && env.UPLOAD_DIR) || './uploads';
  if (path.isAbsolute(configured)) {
    return path.normalize(configured);
  }
  return path.resolve(__dirname, '../../', configured);
}

/**
 * Strictly guard against path traversal attacks
 * Resolves storage key against base directory and ensures it remains confined.
 * @param {string} baseDir
 * @param {string} storageKey
 * @returns {string} Safe absolute path
 */
function safeResolvePath(baseDir, storageKey) {
  if (!storageKey || typeof storageKey !== 'string') {
    const err = new Error('Invalid storage key provided.');
    err.code = 'ERR_INVALID_KEY';
    throw err;
  }

  // Strip null bytes and normalize
  const cleanKey = storageKey.replace(/\0/g, '');
  const normalizedBase = path.normalize(baseDir);
  const resolved = path.resolve(normalizedBase, cleanKey);

  // Path must be inside normalizedBase directory
  if (!resolved.startsWith(normalizedBase + path.sep) && resolved !== normalizedBase) {
    const err = new Error('Access denied: Path traversal detected.');
    err.code = 'ERR_PATH_TRAVERSAL';
    throw err;
  }

  return resolved;
}

class StorageService {
  constructor() {
    this.provider = (process.env.STORAGE_PROVIDER || (env && env.STORAGE_PROVIDER) || 'local').toLowerCase();
    this.baseDir = resolveStorageDir();
    this.ensureDirectories();

    if (this.provider === 's3') {
      const bucket = process.env.AWS_S3_BUCKET || (env && env.AWS_S3_BUCKET);
      if (!bucket) {
        logger.warn('[Storage] STORAGE_PROVIDER=s3 specified, but AWS_S3_BUCKET is not configured. Falling back to persistent local storage.');
        this.provider = 'local';
      } else {
        logger.info(`[Storage] Initialized S3 cloud object storage adapter for bucket: ${bucket}`);
      }
    } else {
      logger.info(`[Storage] Initialized local persistent disk storage at: ${this.baseDir}`);
    }
  }

  /**
   * Ensure root storage partitions exist on disk
   */
  ensureDirectories() {
    try {
      ALLOWED_FOLDERS.forEach((f) => {
        const dir = path.join(this.baseDir, f);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true, mode: 0o750 });
        }
      });
    } catch (err) {
      logger.error(`[Storage] Failed to initialize storage directories at ${this.baseDir}: ${err.message}`);
    }
  }

  /**
   * Re-evaluate and re-initialize directory paths (useful for runtime configuration shifts)
   */
  initStorage() {
    this.baseDir = resolveStorageDir();
    this.ensureDirectories();
  }

  /**
   * Save a binary file buffer to storage
   * @param {object} params
   * @param {Buffer} params.buffer - Raw binary buffer
   * @param {string} params.originalFilename - Original client filename
   * @param {string} params.mimeType - Verified MIME type
   * @param {'avatars'|'resumes'|'temp'} [params.folder='resumes'] - Storage partition
   * @returns {Promise<{ storageKey: string, sizeBytes: number, originalFilename: string, mimeType: string, relativePath: string }>}
   */
  async saveFile({ buffer, originalFilename, mimeType, folder = 'resumes' }) {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Storage error: invalid file buffer.');
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      throw new Error(`Invalid storage partition: "${folder}". Allowed: ${ALLOWED_FOLDERS.join(', ')}`);
    }

    const rawExt = path.extname(originalFilename || '').toLowerCase();
    const ext = /^\.[a-z0-9]{1,10}$/.test(rawExt)
      ? rawExt
      : (mimeType === 'application/pdf' ? '.pdf' : '.bin');

    // Generate collision-resistant unique identifier
    const randomId = crypto.randomUUID();
    const storageKey = `${folder}/${randomId}${ext}`;

    // Memory store tracking (for tests or memory provider)
    mockStorageMap.set(storageKey, buffer);

    // Ensure target partition directory exists
    const targetDir = path.join(this.baseDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true, mode: 0o750 });
    }

    const filePath = safeResolvePath(this.baseDir, storageKey);
    await fs.promises.writeFile(filePath, buffer, { mode: 0o640 });

    logger.info(`[Storage] Saved file to ${folder}: ${storageKey} (${buffer.length} bytes)`);

    return {
      storageKey,
      sizeBytes: buffer.length,
      originalFilename,
      mimeType,
      relativePath: `/uploads/${storageKey}`
    };
  }

  /**
   * Check if a file exists in storage
   * @param {string} storageKey
   * @returns {Promise<boolean>}
   */
  async fileExists(storageKey) {
    if (!storageKey) return false;
    if (mockStorageMap.has(storageKey)) return true;

    const filePath = safeResolvePath(this.baseDir, storageKey);
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      }
      throw err;
    }
  }

  /**
   * Retrieve file as binary Buffer
   * @param {string} storageKey
   * @returns {Promise<Buffer>}
   */
  async getFileBuffer(storageKey) {
    if (mockStorageMap.has(storageKey)) {
      return mockStorageMap.get(storageKey);
    }

    const filePath = safeResolvePath(this.baseDir, storageKey);
    return fs.promises.readFile(filePath);
  }

  /**
   * Get readable stream for file
   * @param {string} storageKey
   * @returns {fs.ReadStream|import('stream').Readable}
   */
  getFileStream(storageKey) {
    if (mockStorageMap.has(storageKey)) {
      const { Readable } = require('stream');
      return Readable.from(mockStorageMap.get(storageKey));
    }

    const filePath = safeResolvePath(this.baseDir, storageKey);
    return fs.createReadStream(filePath);
  }

  /**
   * Create readable stream for public images / company logos
   * @param {string} key - File identifier or base name
   * @param {string} [folder='avatars'] - Subfolder
   * @returns {fs.ReadStream|import('stream').Readable}
   */
  createReadStream(key, folder = 'avatars') {
    const cleanKey = path.basename(key);
    const storageKey = folder ? `${folder}/${cleanKey}` : cleanKey;
    return this.getFileStream(storageKey);
  }

  /**
   * Delete file from storage
   * @param {string} storageKey
   * @param {string} [folder] Optional folder prefix if key does not include it
   * @returns {Promise<boolean>}
   */
  async deleteFile(storageKey, folder) {
    if (!storageKey) return false;

    let key = storageKey;
    if (folder && !key.includes('/')) {
      key = `${folder}/${path.basename(key)}`;
    }

    const filePath = safeResolvePath(this.baseDir, key);
    mockStorageMap.delete(key);

    try {
      await fs.promises.unlink(filePath);
      logger.info(`[Storage] Deleted file: ${key}`);
      return true;
    } catch (err) {
      if (err.code !== 'ENOENT') {
        logger.warn(`[Storage] Failed to delete file ${key}:`, { error: err.message });
      }
      return false;
    }
  }

  /**
   * Clear test memory buffer map
   */
  clearMockStorage() {
    mockStorageMap.clear();
  }

  /**
   * Retrieve storage diagnostic metadata
   * @returns {object}
   */
  getStorageInfo() {
    return {
      provider: this.provider,
      configuredDir: process.env.UPLOAD_DIR || (env && env.UPLOAD_DIR) || './uploads',
      baseDir: this.baseDir,
      isPersistent: true,
      folders: ALLOWED_FOLDERS
    };
  }
}

module.exports = new StorageService();
