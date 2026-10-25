/**
 * File Validation Utility for HireConnect
 * Validates actual binary file signatures (magic bytes), file sizes, and sanitizes filenames.
 */

const path = require('path');

// Supported image types and signatures
const IMAGE_SIGNATURES = {
  jpeg: [
    [0xff, 0xd8, 0xff]
  ],
  png: [
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  ],
  webp: [
    // RIFF....WEBP: bytes 0-3 = "RIFF", bytes 8-11 = "WEBP"
    {
      check: (buf) =>
        buf.length >= 12 &&
        buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
        buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
    }
  ]
};

// Supported resume types and signatures
const RESUME_SIGNATURES = {
  pdf: [
    [0x25, 0x50, 0x44, 0x46] // %PDF
  ],
  // DOCX is a zipped XML package starting with PK..
  docx: [
    [0x50, 0x4b, 0x03, 0x04],
    [0x50, 0x4b, 0x05, 0x06],
    [0x50, 0x4b, 0x07, 0x08]
  ]
};

/**
 * Check if a buffer starts with matching sequence
 * @param {Buffer} buffer
 * @param {number[]} signature
 * @returns {boolean}
 */
function bufferStartsWith(buffer, signature) {
  if (buffer.length < signature.length) return false;
  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) return false;
  }
  return true;
}

/**
 * Validate Avatar Image Buffer
 * Supported: JPEG, PNG, WebP (Max 5MB)
 * @param {Buffer} buffer
 * @param {number} [maxBytes=5242880] 5MB
 * @returns {{ valid: boolean, format?: string, mimeType?: string, error?: string }}
 */
function validateImageBuffer(buffer, maxBytes = 5 * 1024 * 1024) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    return { valid: false, error: 'Invalid or missing file buffer.' };
  }

  if (buffer.length === 0) {
    return { valid: false, error: 'Uploaded file is empty.' };
  }

  if (buffer.length > maxBytes) {
    return {
      valid: false,
      error: `File size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds maximum limit of ${(maxBytes / (1024 * 1024)).toFixed(0)} MB.`
    };
  }

  // Check JPEG
  for (const sig of IMAGE_SIGNATURES.jpeg) {
    if (bufferStartsWith(buffer, sig)) {
      return { valid: true, format: 'jpeg', mimeType: 'image/jpeg' };
    }
  }

  // Check PNG
  for (const sig of IMAGE_SIGNATURES.png) {
    if (bufferStartsWith(buffer, sig)) {
      return { valid: true, format: 'png', mimeType: 'image/png' };
    }
  }

  // Check WebP
  for (const item of IMAGE_SIGNATURES.webp) {
    if (item.check(buffer)) {
      return { valid: true, format: 'webp', mimeType: 'image/webp' };
    }
  }

  return {
    valid: false,
    error: 'Unsupported image format. Only authentic JPEG, PNG, or WebP files are accepted.'
  };
}

/**
 * Validate Resume Document Buffer
 * Supported: PDF, DOCX (Max 10MB)
 * @param {Buffer} buffer
 * @param {number} [maxBytes=10485760] 10MB
 * @returns {{ valid: boolean, format?: string, mimeType?: string, error?: string }}
 */
function validateResumeBuffer(buffer, maxBytes = 10 * 1024 * 1024) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    return { valid: false, error: 'Invalid or missing file buffer.' };
  }

  if (buffer.length === 0) {
    return { valid: false, error: 'Uploaded resume is empty.' };
  }

  if (buffer.length > maxBytes) {
    return {
      valid: false,
      error: `Resume file size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds maximum limit of ${(maxBytes / (1024 * 1024)).toFixed(0)} MB.`
    };
  }

  // Check PDF
  for (const sig of RESUME_SIGNATURES.pdf) {
    if (bufferStartsWith(buffer, sig)) {
      return { valid: true, format: 'pdf', mimeType: 'application/pdf' };
    }
  }

  // Check DOCX
  for (const sig of RESUME_SIGNATURES.docx) {
    if (bufferStartsWith(buffer, sig)) {
      return {
        valid: true,
        format: 'docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
    }
  }

  return {
    valid: false,
    error: 'Unsupported document format. Only authentic PDF or DOCX files are accepted.'
  };
}

/**
 * Sanitize filename to prevent path traversal and shell injection
 * @param {string} originalName
 * @returns {string}
 */
function sanitizeFilename(originalName) {
  if (!originalName || typeof originalName !== 'string') {
    return 'document.pdf';
  }

  const base = path.basename(originalName);
  // Remove non-alphanumeric characters except dots, hyphens, and underscores
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  // Truncate to reasonable length
  return cleaned.slice(0, 120);
}

module.exports = {
  validateImageBuffer,
  validateResumeBuffer,
  sanitizeFilename
};
