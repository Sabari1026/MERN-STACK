/**
 * User & Avatar Routes for HireConnect
 * Endpoints for avatar upload, deletion, and public image streaming.
 */

const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { handleAvatarUpload } = require('../middleware/upload.middleware');

const router = express.Router();

// Avatar management (authenticated, rate-limited)
router.post('/me/avatar', authenticate, uploadLimiter, handleAvatarUpload, userController.uploadAvatar);
router.delete('/me/avatar', authenticate, userController.deleteAvatar);

// Public avatar streaming
router.get('/avatar/:key', userController.serveAvatar);

module.exports = router;
