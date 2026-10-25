/**
 * Notification Controller for HireConnect (Phase 9)
 * Handles HTTP requests for notifications, unread counts, status mutations,
 * and user notification preferences.
 */

const notificationService = require('../services/notification.service');
const { getNotificationsQuerySchema, updatePreferencesSchema } = require('../validators/notification.validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/notifications
 * Retrieves paginated notifications for the authenticated user
 */
const getMyNotifications = asyncHandler(async (req, res) => {
  const query = getNotificationsQuerySchema.parse(req.query);
  const userId = req.user._id || req.user.id;

  const result = await notificationService.getUserNotifications(userId, query);
  return res.status(200).json(result);
});

/**
 * GET /api/notifications/unread-count
 * Returns the unread notification count
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const result = await notificationService.getUnreadCount(userId);
  return res.status(200).json(result);
});

/**
 * PATCH /api/notifications/:notificationId/read
 * Marks a single notification as read
 */
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { notificationId } = req.params;

  if (!notificationId) {
    throw ApiError.badRequest('Notification ID is required.');
  }

  const result = await notificationService.markAsRead(userId, notificationId);
  return res.status(200).json(result);
});

/**
 * PATCH /api/notifications/read-all
 * Marks all notifications for authenticated user as read
 */
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const result = await notificationService.markAllAsRead(userId);
  return res.status(200).json(result);
});

/**
 * DELETE /api/notifications/:notificationId
 * Dismisses/archives a notification
 */
const dismissNotification = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { notificationId } = req.params;

  if (!notificationId) {
    throw ApiError.badRequest('Notification ID is required.');
  }

  const result = await notificationService.dismissNotification(userId, notificationId);
  return res.status(200).json(result);
});

/**
 * GET /api/notifications/preferences
 * Retrieves user notification preferences
 */
const getUserPreferences = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const result = await notificationService.getUserPreferences(userId);
  return res.status(200).json(result);
});

/**
 * PUT /api/notifications/preferences
 * Updates user notification preferences
 */
const updateUserPreferences = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const body = updatePreferencesSchema.parse(req.body);

  const result = await notificationService.updateUserPreferences(userId, body);
  return res.status(200).json(result);
});

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  dismissNotification,
  getUserPreferences,
  updateUserPreferences
};
