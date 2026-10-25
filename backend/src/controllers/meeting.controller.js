/**
 * Meeting and Scheduling Controller for HireConnect (Phase 8)
 * Exposes availability configuration, available slot discovery,
 * atomic interview booking, meeting management, rescheduling, and cancellation.
 */

const schedulingService = require('../services/scheduling.service');
const {
  updateAvailabilitySchema,
  createExceptionSchema,
  availableSlotsQuerySchema,
  createMeetingSchema,
  rescheduleMeetingSchema,
  cancelMeetingSchema
} = require('../validators/meeting.validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/recruiter/availability
 * Authenticated recruiter retrieves their own availability configuration
 */
const getRecruiterAvailability = asyncHandler(async (req, res) => {
  const result = await schedulingService.getRecruiterAvailability(req.user._id);
  return res.status(200).json({ success: true, availability: result });
});

/**
 * PUT /api/recruiter/availability
 * Authenticated recruiter updates weekly working rules, time zone, and slot settings
 */
const updateRecruiterAvailability = asyncHandler(async (req, res) => {
  const parsed = updateAvailabilitySchema.parse(req.body);
  const result = await schedulingService.updateRecruiterAvailability(req.user._id, parsed);
  return res.status(200).json({ success: true, message: 'Availability updated successfully.', availability: result });
});

/**
 * GET /api/recruiter/availability/exceptions
 * Authenticated recruiter lists their scheduled unavailable periods
 */
const getAvailabilityExceptions = asyncHandler(async (req, res) => {
  const result = await schedulingService.getAvailabilityExceptions(req.user._id);
  return res.status(200).json({ success: true, exceptions: result });
});

/**
 * POST /api/recruiter/availability/exceptions
 * Authenticated recruiter creates a new unavailable exception
 */
const createAvailabilityException = asyncHandler(async (req, res) => {
  const parsed = createExceptionSchema.parse(req.body);
  const result = await schedulingService.createAvailabilityException(req.user._id, parsed);
  return res.status(201).json({ success: true, message: 'Availability exception created.', exception: result });
});

/**
 * DELETE /api/recruiter/availability/exceptions/:exceptionId
 * Authenticated recruiter deletes an availability exception
 */
const deleteAvailabilityException = asyncHandler(async (req, res) => {
  const result = await schedulingService.deleteAvailabilityException(req.user._id, req.params.exceptionId);
  return res.status(200).json(result);
});

/**
 * GET /api/recruiters/:recruiterId/available-slots
 * Public / candidate-facing bookable slot lookup
 */
const getAvailableSlots = asyncHandler(async (req, res) => {
  const parsed = availableSlotsQuerySchema.parse(req.query);
  const result = await schedulingService.getAvailableSlots(req.params.recruiterId, parsed);
  return res.status(200).json({ success: true, ...result });
});

/**
 * POST /api/meetings & POST /api/bookings
 * Authenticated candidate books an interview
 */
const bookMeeting = asyncHandler(async (req, res) => {
  const parsed = createMeetingSchema.parse(req.body);
  const result = await schedulingService.bookMeeting(req.user, parsed);
  return res.status(result.status || 201).json(result);
});

/**
 * GET /api/meetings/me & GET /api/meetings
 * Lists meetings for authenticated candidate or recruiter
 */
const getMyMeetings = asyncHandler(async (req, res) => {
  const result = await schedulingService.getMyMeetings(req.user, req.query);
  return res.status(200).json(result);
});

/**
 * GET /api/meetings/:meetingId
 * Retrieves detailed meeting view for authorized participant
 */
const getMeetingById = asyncHandler(async (req, res) => {
  const result = await schedulingService.getMeetingById(req.params.meetingId, req.user);
  return res.status(200).json({ success: true, meeting: result });
});

/**
 * PATCH /api/meetings/:meetingId/reschedule & POST /api/bookings/reschedule
 * Reschedules an eligible meeting
 */
const rescheduleMeeting = asyncHandler(async (req, res) => {
  const parsed = rescheduleMeetingSchema.parse(req.body);
  const meetingTargetId = req.params.meetingId || parsed.reference;
  if (!meetingTargetId) {
    throw ApiError.badRequest('Meeting ID or booking reference is required.');
  }

  const result = await schedulingService.rescheduleMeeting(meetingTargetId, req.user, parsed);
  return res.status(200).json(result);
});

/**
 * PATCH /api/meetings/:meetingId/cancel & POST /api/bookings/cancel
 * Cancels an eligible meeting
 */
const cancelMeeting = asyncHandler(async (req, res) => {
  const parsed = cancelMeetingSchema.parse(req.body);
  const meetingTargetId = req.params.meetingId || parsed.reference;
  if (!meetingTargetId) {
    throw ApiError.badRequest('Meeting ID or booking reference is required.');
  }

  const result = await schedulingService.cancelMeeting(meetingTargetId, req.user, parsed.reason);
  return res.status(200).json(result);
});

module.exports = {
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
};
