/**
 * Meeting & Scheduling Routes for HireConnect (Phase 8)
 * Mounts recruiter availability, candidate slot discovery, meeting bookings,
 * and meeting management endpoints.
 */

const express = require('express');
const {
  getRecruiterAvailability,
  updateRecruiterAvailability,
  getAvailabilityExceptions,
  createAvailabilityException,
  deleteAvailabilityException,
  getAvailableSlots,
  bookMeeting,
  getMyMeetings,
  getMeetingById,
  rescheduleMeeting,
  cancelMeeting
} = require('../controllers/meeting.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const User = require('../models/user.model');

const router = express.Router();

// ============================================================================
// RECRUITER AVAILABILITY CONFIGURATION (Recruiter/Admin only)
// ============================================================================
router.get(
  '/recruiter/availability',
  authenticate,
  requireRole('recruiter', 'admin'),
  getRecruiterAvailability
);

router.put(
  '/recruiter/availability',
  authenticate,
  requireRole('recruiter', 'admin'),
  updateRecruiterAvailability
);

router.get(
  '/recruiter/availability/exceptions',
  authenticate,
  requireRole('recruiter', 'admin'),
  getAvailabilityExceptions
);

router.post(
  '/recruiter/availability/exceptions',
  authenticate,
  requireRole('recruiter', 'admin'),
  createAvailabilityException
);

router.delete(
  '/recruiter/availability/exceptions/:exceptionId',
  authenticate,
  requireRole('recruiter', 'admin'),
  deleteAvailabilityException
);

// ============================================================================
// PUBLIC / CANDIDATE-FACING AVAILABLE SLOTS DISCOVERY
// ============================================================================
router.get('/recruiters/:recruiterId/available-slots', getAvailableSlots);

// Legacy booking availability route compatibility: /api/bookings/availability
router.get('/bookings/availability', async (req, res, next) => {
  try {
    let recruiterId = req.query.recruiterId;
    if (!recruiterId) {
      // Find seed recruiter or any active recruiter
      const rec = await User.findOne({ role: 'recruiter' });
      recruiterId = rec ? (rec._id ? rec._id.toString() : rec.id) : 'user-recruiter-priya';
    }
    req.params.recruiterId = recruiterId;
    return getAvailableSlots(req, res, next);
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// MEETING BOOKING & MANAGEMENT
// ============================================================================
router.post('/meetings', authenticate, bookMeeting);
router.get('/meetings/me', authenticate, getMyMeetings);
router.get('/meetings', authenticate, getMyMeetings);
router.get('/meetings/:meetingId', authenticate, getMeetingById);
router.patch('/meetings/:meetingId/reschedule', authenticate, rescheduleMeeting);
router.patch('/meetings/:meetingId/cancel', authenticate, cancelMeeting);

// Legacy /api/bookings compatibility routes
router.post('/bookings', async (req, res, next) => {
  // If user is logged in, use authenticate middleware; otherwise look up or auto-resolve candidate
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, () => bookMeeting(req, res, next));
  }

  // Guest booking: resolve or create candidate user from email
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(401).json({ success: false, message: 'Authentication or visitor email is required.' });
    }

    let candUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!candUser) {
      candUser = await User.create({
        name: req.body.name || 'HireConnect Visitor',
        email: email.toLowerCase().trim(),
        role: 'candidate',
        isEmailVerified: true
      });
    }

    req.user = candUser;
    return bookMeeting(req, res, next);
  } catch (e) {
    next(e);
  }
});

router.get('/bookings/my', authenticate, getMyMeetings);
router.post('/bookings/reschedule', authenticate, rescheduleMeeting);
router.post('/bookings/cancel', authenticate, cancelMeeting);

module.exports = router;
