/**
 * File Upload Middleware for HireConnect
 * Uses Multer with in-memory buffering for signature validation prior to persistence.
 */

const multer = require('multer');
const ApiError = require('../utils/ApiError');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB maximum
  }
});

/**
 * Avatar single-file middleware with field fallback
 */
function handleAvatarUpload(req, res, next) {
  const uploadSingle = upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]);

  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(ApiError.badRequest('File size exceeds maximum 5 MB limit for profile photos.'));
      }
      return next(ApiError.badRequest(err.message || 'File upload failed.'));
    }

    // Normalize req.file
    if (req.files) {
      if (req.files.avatar && req.files.avatar[0]) {
        req.file = req.files.avatar[0];
      } else if (req.files.file && req.files.file[0]) {
        req.file = req.files.file[0];
      }
    }

    next();
  });
}

/**
 * Resume single-file middleware with field fallback
 */
function handleResumeUpload(req, res, next) {
  const uploadSingle = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]);

  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(ApiError.badRequest('Resume size exceeds maximum 10 MB limit.'));
      }
      return next(ApiError.badRequest(err.message || 'File upload failed.'));
    }

    // Normalize req.file
    if (req.files) {
      if (req.files.resume && req.files.resume[0]) {
        req.file = req.files.resume[0];
      } else if (req.files.file && req.files.file[0]) {
        req.file = req.files.file[0];
      }
    }

    next();
  });
}

module.exports = {
  handleAvatarUpload,
  handleResumeUpload
};
