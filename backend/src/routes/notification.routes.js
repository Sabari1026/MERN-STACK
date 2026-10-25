/**
 * Notification Routes for HireConnect (Phase 9)
 * Mounts notification retrieval, unread counts, status mutations, and preferences.
 */

const express = require('express');
const {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  dismissNotification,
  getUserPreferences,
  updateUserPreferences
} = require('../controllers/notification.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All notification endpoints strictly require authentication
router.use(authenticate);

// Unread count & Preferences routes (placed above :notificationId parameters)
router.get('/unread-count', getUnreadCount);
router.get('/preferences', getUserPreferences);
router.put('/preferences', updateUserPreferences);
router.patch('/read-all', markAllNotificationsAsRead);

// Paginated notification list
router.get('/', getMyNotifications);

// Individual notification actions
router.patch('/:notificationId/read', markNotificationAsRead);
router.delete('/:notificationId', dismissNotification);

module.exports = router;
