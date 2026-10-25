/**
 * Dedicated Scheduling Service for HireConnect (Phase 8)
 * Handles recruiter availability calculations, slot generation, buffer and exception handling,
 * atomic concurrency-safe booking, double-booking prevention, meeting rescheduling, and cancellation.
 */

const RecruiterAvailability = require('../models/recruiterAvailability.model');
const AvailabilityException = require('../models/availabilityException.model');
const Meeting = require('../models/meeting.model');
const User = require('../models/user.model');
const Application = require('../models/application.model');
const Job = require('../models/job.model');
const Company = require('../models/company.model');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const notificationService = require('./notification.service');
const {
  isValidTimeZone,
  zonedTimeToUtc,
  getZonedDateTimeParts,
  formatTimeSlotLabel
} = require('../utils/timeZone');

// In-process mutex map to serialize concurrent booking and rescheduling operations per recruiter
const recruiterLocks = new Map();

async function acquireLock(recruiterId) {
  const key = recruiterId.toString();
  while (recruiterLocks.has(key)) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  recruiterLocks.set(key, true);
}

function releaseLock(recruiterId) {
  recruiterLocks.delete(recruiterId.toString());
}

class SchedulingService {
  /**
   * Retrieves recruiter availability configuration or initializes defaults
   */
  async getRecruiterAvailability(recruiterId) {
    if (!recruiterId) throw ApiError.badRequest('Recruiter ID is required.');
    const rId = recruiterId._id ? recruiterId._id.toString() : recruiterId.toString();

    let avail = await RecruiterAvailability.findOne({ recruiter: rId });
    if (!avail) {
      avail = await RecruiterAvailability.create({
        recruiter: rId,
        timeZone: 'Asia/Kolkata',
        weeklyRules: [
          { weekday: 'monday', startTime: '09:00', endTime: '17:00' },
          { weekday: 'tuesday', startTime: '09:00', endTime: '17:00' },
          { weekday: 'wednesday', startTime: '09:00', endTime: '17:00' },
          { weekday: 'thursday', startTime: '09:00', endTime: '17:00' },
          { weekday: 'friday', startTime: '09:00', endTime: '17:00' }
        ],
        slotDurations: [15, 30, 45, 60],
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
        minimumNoticeMinutes: 120,
        maximumBookingDaysAhead: 30,
        active: true
      });
    }

    return avail.toObject ? avail.toObject() : avail;
  }

  /**
   * Updates recruiter availability settings
   */
  async updateRecruiterAvailability(recruiterId, updateData) {
    if (!recruiterId) throw ApiError.badRequest('Recruiter ID is required.');
    const rId = recruiterId._id ? recruiterId._id.toString() : recruiterId.toString();

    let avail = await RecruiterAvailability.findOne({ recruiter: rId });
    if (!avail) {
      avail = new RecruiterAvailability({ recruiter: rId, ...updateData });
    } else {
      if (updateData.timeZone) avail.timeZone = updateData.timeZone;
      if (Array.isArray(updateData.weeklyRules)) avail.weeklyRules = updateData.weeklyRules;
      if (Array.isArray(updateData.slotDurations)) avail.slotDurations = updateData.slotDurations;
      if (typeof updateData.bufferBeforeMinutes === 'number') avail.bufferBeforeMinutes = updateData.bufferBeforeMinutes;
      if (typeof updateData.bufferAfterMinutes === 'number') avail.bufferAfterMinutes = updateData.bufferAfterMinutes;
      if (typeof updateData.minimumNoticeMinutes === 'number') avail.minimumNoticeMinutes = updateData.minimumNoticeMinutes;
      if (typeof updateData.maximumBookingDaysAhead === 'number') avail.maximumBookingDaysAhead = updateData.maximumBookingDaysAhead;
      if (updateData.active !== undefined) avail.active = Boolean(updateData.active);
    }

    await avail.save();
    return avail.toObject ? avail.toObject() : avail;
  }

  /**
   * Retrieves availability exceptions for a recruiter
   */
  async getAvailabilityExceptions(recruiterId) {
    const rId = recruiterId._id ? recruiterId._id.toString() : recruiterId.toString();
    const exceptions = await AvailabilityException.find({ recruiter: rId }).sort({ startAt: 1 });
    return exceptions.map((e) => (e.toObject ? e.toObject() : e));
  }

  /**
   * Creates an availability exception (e.g. time off, unavailable afternoon)
   */
  async createAvailabilityException(recruiterId, data) {
    const rId = recruiterId._id ? recruiterId._id.toString() : recruiterId.toString();
    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);

    if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
      throw ApiError.badRequest('Invalid startAt or endAt timestamp.');
    }
    if (endAt <= startAt) {
      throw ApiError.badRequest('endAt must be later than startAt.');
    }

    const exception = await AvailabilityException.create({
      recruiter: rId,
      startAt,
      endAt,
      type: data.type || 'unavailable',
      reason: data.reason || ''
    });

    return exception.toObject ? exception.toObject() : exception;
  }

  /**
   * Deletes an availability exception
   */
  async deleteAvailabilityException(recruiterId, exceptionId) {
    const rId = recruiterId._id ? recruiterId._id.toString() : recruiterId.toString();
    const exception = await AvailabilityException.findById(exceptionId);
    if (!exception) {
      throw ApiError.notFound('Availability exception not found.');
    }
    const excRec = exception.recruiter?._id ? exception.recruiter._id.toString() : exception.recruiter.toString();
    if (excRec !== rId) {
      throw ApiError.forbidden('You are not authorized to delete this exception.');
    }

    await AvailabilityException.findByIdAndDelete(exceptionId);
    return { success: true, message: 'Availability exception deleted.' };
  }

  /**
   * Public / candidate-facing calculation of available meeting slots
   */
  async getAvailableSlots(recruiterId, query = {}) {
    if (!recruiterId) throw ApiError.badRequest('Recruiter ID is required.');
    const rId = recruiterId._id ? recruiterId._id.toString() : recruiterId.toString();

    // 1. Locate recruiter user
    let recruiterUser = await User.findById(rId);
    if (!recruiterUser) {
      // Check legacy host id or mock lookup
      recruiterUser = await User.findOne({ email: 'recruiter@hireconnect.io' });
    }
    if (!recruiterUser) {
      recruiterUser = { _id: rId, name: 'HireConnect Recruiter', email: 'recruiter@hireconnect.io' };
    }

    // 2. Retrieve recruiter availability rules
    const avail = await this.getRecruiterAvailability(rId);
    if (!avail.active) {
      return {
        available: false,
        timezone: avail.timeZone,
        slots: [],
        bookedSlots: [],
        reason: 'Recruiter is not currently accepting meeting bookings.'
      };
    }

    const timeZone = query.timeZone || avail.timeZone || 'Asia/Kolkata';
    const durationMinutes = Number(query.duration) || 30;

    if (!avail.slotDurations.includes(durationMinutes)) {
      throw ApiError.badRequest(`Requested duration (${durationMinutes}m) is not supported. Configured durations: [${avail.slotDurations.join(', ')}]`);
    }

    // 3. Resolve target dates
    const now = new Date();
    const nowParts = getZonedDateTimeParts(now, timeZone);
    const todayStr = nowParts.dateStr;

    let targetDates = [];
    if (query.date) {
      targetDates = [query.date];
    } else if (query.startDate && query.endDate) {
      let cur = new Date(query.startDate + 'T00:00:00Z');
      const end = new Date(query.endDate + 'T00:00:00Z');
      while (cur <= end) {
        targetDates.push(cur.toISOString().split('T')[0]);
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
    } else {
      // Default to today and next 7 days
      let cur = new Date(todayStr + 'T00:00:00Z');
      for (let i = 0; i < 7; i++) {
        targetDates.push(cur.toISOString().split('T')[0]);
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
    }

    // Booking horizon limit
    const maxHorizonDate = new Date();
    maxHorizonDate.setUTCDate(maxHorizonDate.getUTCDate() + avail.maximumBookingDaysAhead);
    const maxHorizonStr = maxHorizonDate.toISOString().split('T')[0];

    if (query.date && query.date > maxHorizonStr) {
      throw ApiError.badRequest(`Requested date is outside the recruiter's maximum booking window of ${avail.maximumBookingDaysAhead} days.`);
    }

    // Minimum notice threshold
    const minNoticeInstant = new Date(now.getTime() + (avail.minimumNoticeMinutes || 0) * 60000);

    // 4. Retrieve exceptions and existing meetings for the candidate period
    const minQueryDate = new Date(targetDates[0] + 'T00:00:00Z');
    const maxQueryDate = new Date(targetDates[targetDates.length - 1] + 'T23:59:59Z');

    const exceptions = await AvailabilityException.find({
      recruiter: rId,
      type: 'unavailable',
      startAt: { $lte: maxQueryDate },
      endAt: { $gte: minQueryDate }
    });

    const activeMeetings = await Meeting.find({
      recruiter: rId,
      status: 'scheduled',
      startAt: { $lte: maxQueryDate },
      endAt: { $gte: minQueryDate }
    });

    const allSlots = [];
    const bookedSlotLabels = [];

    for (const dateStr of targetDates) {
      if (dateStr < todayStr || dateStr > maxHorizonStr) {
        continue;
      }

      // Determine weekday in recruiter time zone
      const dummyUtc = zonedTimeToUtc(dateStr, '12:00', timeZone);
      const dayParts = getZonedDateTimeParts(dummyUtc, timeZone);
      const weekday = dayParts.weekday; // 'monday', 'tuesday', etc.

      const rulesForDay = avail.weeklyRules.filter((r) => r.weekday === weekday);
      if (rulesForDay.length === 0) {
        continue;
      }

      for (const rule of rulesForDay) {
        const [startHour, startMin] = rule.startTime.split(':').map(Number);
        const [endHour, endMin] = rule.endTime.split(':').map(Number);
        const windowStartMinutes = startHour * 60 + startMin;
        const windowEndMinutes = endHour * 60 + endMin;

        let slotStartMinutes = windowStartMinutes;
        while (slotStartMinutes + durationMinutes <= windowEndMinutes) {
          const slotEndMinutes = slotStartMinutes + durationMinutes;

          const slotStartH = String(Math.floor(slotStartMinutes / 60)).padStart(2, '0');
          const slotStartM = String(slotStartMinutes % 60).padStart(2, '0');
          const slotEndH = String(Math.floor(slotEndMinutes / 60)).padStart(2, '0');
          const slotEndM = String(slotEndMinutes % 60).padStart(2, '0');

          const slotStartInstant = zonedTimeToUtc(dateStr, `${slotStartH}:${slotStartM}`, timeZone);
          const slotEndInstant = zonedTimeToUtc(dateStr, `${slotEndH}:${slotEndM}`, timeZone);
          const slotLabel = formatTimeSlotLabel(slotStartInstant, slotEndInstant, timeZone);

          // 1. Notice threshold check
          if (slotStartInstant.getTime() < minNoticeInstant.getTime()) {
            slotStartMinutes += durationMinutes;
            continue;
          }

          // 2. Exception check (must not overlap unavailable exception)
          const inException = exceptions.some((exc) => {
            const eStart = new Date(exc.startAt).getTime();
            const eEnd = new Date(exc.endAt).getTime();
            return slotStartInstant.getTime() < eEnd && slotEndInstant.getTime() > eStart;
          });

          if (inException) {
            slotStartMinutes += durationMinutes;
            continue;
          }

          // 3. Existing meeting check (including buffers)
          const bufferBeforeMs = (avail.bufferBeforeMinutes || 0) * 60000;
          const bufferAfterMs = (avail.bufferAfterMinutes || 0) * 60000;

          const conflictMeeting = activeMeetings.find((m) => {
            const mStart = new Date(m.startAt).getTime();
            const mEnd = new Date(m.endAt).getTime();
            const effectiveStart = slotStartInstant.getTime() - bufferBeforeMs;
            const effectiveEnd = slotEndInstant.getTime() + bufferAfterMs;
            return effectiveStart < mEnd && effectiveEnd > mStart;
          });

          if (conflictMeeting) {
            bookedSlotLabels.push(slotLabel);
          } else {
            allSlots.push({
              startAt: slotStartInstant.toISOString(),
              endAt: slotEndInstant.toISOString(),
              timeSlot: slotLabel,
              date: dateStr,
              durationMinutes
            });
          }

          slotStartMinutes += durationMinutes;
        }
      }
    }

    return {
      available: allSlots.length > 0,
      date: query.date || targetDates[0],
      timezone: timeZone,
      slots: allSlots.map((s) => s.timeSlot),
      detailedSlots: allSlots,
      bookedSlots: bookedSlotLabels,
      assignedHost: {
        id: recruiterUser._id ? recruiterUser._id.toString() : rId,
        name: recruiterUser.name || 'HireConnect Recruiter',
        role: 'Senior Technical Recruiter',
        email: recruiterUser.email
      }
    };
  }

  /**
   * Concurrency-safe, atomic interview booking endpoint
   */
  async bookMeeting(candidateUser, bookingData) {
    if (!candidateUser) throw ApiError.unauthorized('Candidate authentication required.');
    const candidateId = candidateUser._id || candidateUser.id;

    // Resolve recruiter
    let recruiterId = bookingData.recruiterId;
    if (!recruiterId) {
      // Fallback: look for seed recruiter or company recruiter
      const recUser = await User.findOne({ role: 'recruiter' });
      if (recUser) {
        recruiterId = recUser._id.toString();
      } else {
        throw ApiError.badRequest('recruiterId is required.');
      }
    }

    const recruiterUser = await User.findById(recruiterId);
    if (!recruiterUser) {
      throw ApiError.notFound('Recruiter account not found.');
    }

    // Resolve slot start and end
    let startAt;
    let endAt;
    const durationMinutes = Number(bookingData.durationMinutes) || 30;

    if (bookingData.startAt) {
      startAt = new Date(bookingData.startAt);
      if (isNaN(startAt.getTime())) {
        throw ApiError.badRequest('Invalid startAt timestamp.');
      }
      endAt = new Date(startAt.getTime() + durationMinutes * 60000);
    } else if (bookingData.date && bookingData.timeSlot) {
      // Legacy format: e.g. "10:00 AM - 10:15 AM"
      const timeZone = bookingData.timezone || 'Asia/Kolkata';
      const rawTime = bookingData.timeSlot.split(' - ')[0].trim(); // "10:00 AM"
      const timeMatch = rawTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1], 10);
        const minute = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3].toUpperCase();
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        startAt = zonedTimeToUtc(bookingData.date, timeStr, timeZone);
        endAt = new Date(startAt.getTime() + durationMinutes * 60000);
      } else {
        throw ApiError.badRequest('Invalid timeSlot format.');
      }
    } else {
      throw ApiError.badRequest('startAt or date + timeSlot is required.');
    }

    // Acquire mutex lock for this recruiter to serialize concurrent booking checks
    await acquireLock(recruiterId);

    try {
      // 1. Minimum notice and past-date check
      const now = new Date();
      if (startAt <= now) {
        throw ApiError.badRequest('Cannot book interview in the past.');
      }

      // 2. Validate recruiter availability
      const avail = await this.getRecruiterAvailability(recruiterId);
      if (!avail.active) {
        throw ApiError.badRequest('Recruiter is not currently accepting interview bookings.');
      }

      const noticeMinutes = avail.minimumNoticeMinutes || 0;
      if (startAt.getTime() < now.getTime() + noticeMinutes * 60000) {
        throw ApiError.badRequest(`Bookings require at least ${noticeMinutes} minutes advance notice.`);
      }

      // Validate working hours in recruiter time zone
      const recTimeZone = avail.timeZone || bookingData.timezone || 'Asia/Kolkata';
      const localParts = getZonedDateTimeParts(startAt, recTimeZone);
      const weekday = localParts.weekday;
      const dayRules = (avail.weeklyRules || []).filter((r) => r.weekday === weekday);
      if (dayRules.length === 0) {
        throw ApiError.badRequest(`Recruiter has no working hours configured on ${weekday}.`);
      }

      const slotStartMinutes = localParts.hour * 60 + localParts.minute;
      const slotEndMinutes = slotStartMinutes + durationMinutes;

      const fitsWorkingHours = dayRules.some((r) => {
        const [sh, sm] = r.startTime.split(':').map(Number);
        const [eh, em] = r.endTime.split(':').map(Number);
        const ruleStart = sh * 60 + sm;
        const ruleEnd = eh * 60 + em;
        return slotStartMinutes >= ruleStart && slotEndMinutes <= ruleEnd;
      });

      if (!fitsWorkingHours) {
        throw ApiError.badRequest("Selected slot falls outside recruiter's working hours.");
      }

      // 3. Exception overlap check
      const exceptionOverlap = await AvailabilityException.findOne({
        recruiter: recruiterId,
        type: 'unavailable',
        startAt: { $lt: endAt },
        endAt: { $gt: startAt }
      });

      if (exceptionOverlap) {
        throw ApiError.conflict('The selected time slot is blocked due to recruiter unavailable schedule.');
      }

      // 4. Overlapping active meeting check (Double-booking prevention)
      const bufferBeforeMs = (avail.bufferBeforeMinutes || 0) * 60000;
      const bufferAfterMs = (avail.bufferAfterMinutes || 0) * 60000;

      const conflictingMeeting = await Meeting.findOne({
        recruiter: recruiterId,
        status: 'scheduled',
        $or: [
          {
            startAt: { $lt: new Date(endAt.getTime() + bufferAfterMs) },
            endAt: { $gt: new Date(startAt.getTime() - bufferBeforeMs) }
          }
        ]
      });

      if (conflictingMeeting) {
        throw ApiError.conflict('This time slot is no longer available. Please select another slot.');
      }

      // 5. Application ownership check if linked to application
      let applicationDoc = null;
      let jobDoc = null;
      let companyDoc = null;

      if (bookingData.applicationId) {
        applicationDoc = await Application.findById(bookingData.applicationId);
        if (!applicationDoc) {
          throw ApiError.notFound('Associated application not found.');
        }
        const appCandId = applicationDoc.candidate?._id ? applicationDoc.candidate._id.toString() : applicationDoc.candidate.toString();
        if (appCandId !== candidateId.toString()) {
          throw ApiError.forbidden('You can only book interviews for applications you own.');
        }
        jobDoc = await Job.findById(applicationDoc.job);
        companyDoc = applicationDoc.company;
      } else if (bookingData.jobId) {
        jobDoc = await Job.findById(bookingData.jobId);
        if (jobDoc) companyDoc = jobDoc.company;
      }

      const reference = `HC-MEET-${Math.floor(100000 + Math.random() * 900000)}`;
      const meetingLink = bookingData.meetingLink || `https://meet.hireconnect.io/room-${reference.toLowerCase()}`;

      // 6. Persist Meeting
      const meeting = await Meeting.create({
        recruiter: recruiterId,
        candidate: candidateId,
        application: applicationDoc ? applicationDoc._id : null,
        job: jobDoc ? jobDoc._id : null,
        company: companyDoc ? (companyDoc._id || companyDoc) : null,
        createdBy: candidateId,
        reference,
        title: bookingData.title || (jobDoc ? `Interview: ${jobDoc.title}` : 'HireConnect Interview'),
        description: bookingData.description || bookingData.agenda || '',
        meetingType: bookingData.meetingType || 'interview',
        durationMinutes,
        startAt,
        endAt,
        timeZone: avail.timeZone || bookingData.timezone || 'Asia/Kolkata',
        status: 'scheduled',
        meetingMode: bookingData.meetingMode || 'online',
        meetingLink,
        location: bookingData.location || '',
        candidateNotes: bookingData.candidateNotes || bookingData.agenda || '',
        recruiterNotes: bookingData.recruiterNotes || '',
        history: [
          {
            event: 'created',
            actor: candidateId,
            actorName: candidateUser.name || 'Candidate',
            newStatus: 'scheduled',
            newStartAt: startAt,
            reason: 'Interview booked via HireConnect Scheduler'
          }
        ]
      });

      logger.info(`[SchedulingService] Meeting ${reference} booked between candidate ${candidateId} and recruiter ${recruiterId}`);

      // Dispatch in-app notifications and confirmation emails to both participants (Phase 9)
      try {
        await notificationService.notifyInterviewBooked({
          meeting,
          candidate: candidateUser,
          recruiter: recruiterUser,
          job: jobDoc,
          company: companyDoc
        });
      } catch (e) {
        logger.warn(`[SchedulingService] Meeting notification error: ${e.message}`);
      }

      return {
        success: true,
        status: 201,
        message: 'Interview successfully scheduled! Confirmation details generated.',
        meeting: {
          id: meeting._id ? meeting._id.toString() : meeting.id,
          reference: meeting.reference,
          title: meeting.title,
          meetingType: meeting.meetingType,
          durationMinutes: meeting.durationMinutes,
          startAt: meeting.startAt,
          endAt: meeting.endAt,
          timeZone: meeting.timeZone,
          status: meeting.status,
          meetingMode: meeting.meetingMode,
          videoUrl: meeting.meetingLink,
          meetingLink: meeting.meetingLink,
          hostName: recruiterUser.name || 'Recruiter',
          hostRole: 'Senior Technical Recruiter',
          hostEmail: recruiterUser.email,
          email: candidateUser.email,
          candidateName: candidateUser.name,
          date: bookingData.date || meeting.startAt.toISOString().split('T')[0],
          timeSlot: bookingData.timeSlot || formatTimeSlotLabel(startAt, endAt, meeting.timeZone)
        }
      };
    } finally {
      releaseLock(recruiterId);
    }
  }

  /**
   * Reschedules an existing meeting to a new start time
   */
  async rescheduleMeeting(meetingId, user, { newStartAt, newDate, newSlot, durationMinutes, reason }) {
    if (!user) throw ApiError.unauthorized('Authentication required.');
    const userId = (user._id || user.id).toString();

    let meeting = null;
    if (meetingId && meetingId.startsWith('HC-MEET-')) {
      meeting = await Meeting.findOne({ reference: meetingId });
    } else if (meetingId) {
      meeting = await Meeting.findById(meetingId);
      if (!meeting) meeting = await Meeting.findOne({ reference: meetingId });
    }

    if (!meeting) {
      throw ApiError.notFound('Meeting not found.');
    }

    const recId = (meeting.recruiter?._id || meeting.recruiter).toString();
    const candId = (meeting.candidate?._id || meeting.candidate).toString();

    // Verify participant authorization
    if (userId !== recId && userId !== candId && user.role !== 'admin') {
      throw ApiError.forbidden('You are not authorized to reschedule this meeting.');
    }

    if (meeting.status !== 'scheduled') {
      throw ApiError.badRequest(`Cannot reschedule a meeting with status "${meeting.status}".`);
    }

    // Resolve new timestamps
    const dur = durationMinutes || meeting.durationMinutes || 30;
    let start;
    let end;

    if (newStartAt) {
      start = new Date(newStartAt);
      if (isNaN(start.getTime())) throw ApiError.badRequest('Invalid newStartAt date.');
      end = new Date(start.getTime() + dur * 60000);
    } else if (newDate && newSlot) {
      const timeZone = meeting.timeZone || 'Asia/Kolkata';
      const rawTime = newSlot.split(' - ')[0].trim();
      const timeMatch = rawTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1], 10);
        const minute = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3].toUpperCase();
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        start = zonedTimeToUtc(newDate, timeStr, timeZone);
        end = new Date(start.getTime() + dur * 60000);
      } else {
        throw ApiError.badRequest('Invalid newSlot format.');
      }
    } else {
      throw ApiError.badRequest('newStartAt or newDate + newSlot is required.');
    }

    if (start <= new Date()) {
      throw ApiError.badRequest('Cannot reschedule to a past time.');
    }

    await acquireLock(recId);
    try {
      // Check conflict excluding this meeting
      const conflict = await Meeting.findOne({
        recruiter: recId,
        status: 'scheduled',
        _id: { $ne: meeting._id || meeting.id },
        startAt: { $lt: end },
        endAt: { $gt: start }
      });

      if (conflict) {
        throw ApiError.conflict('The requested new time slot is already booked.');
      }

      // Check exception
      const exc = await AvailabilityException.findOne({
        recruiter: recId,
        type: 'unavailable',
        startAt: { $lt: end },
        endAt: { $gt: start }
      });
      if (exc) {
        throw ApiError.conflict('The requested time slot falls inside an unavailable period.');
      }

      const prevStart = meeting.startAt;
      meeting.startAt = start;
      meeting.endAt = end;
      meeting.durationMinutes = dur;

      meeting.history.push({
        event: 'rescheduled',
        actor: user._id || user.id,
        actorName: user.name || 'User',
        previousStartAt: prevStart,
        newStartAt: start,
        reason: reason || 'Rescheduled by participant'
      });

      await meeting.save();

      // Dispatch reschedule notifications to both participants (Phase 9)
      try {
        const [candidateUser, recruiterUser] = await Promise.all([
          User.findById(meeting.candidate?._id || meeting.candidate),
          User.findById(meeting.recruiter?._id || meeting.recruiter)
        ]);
        if (candidateUser && recruiterUser) {
          await notificationService.notifyInterviewRescheduled({
            meeting,
            candidate: candidateUser,
            recruiter: recruiterUser,
            previousStartAt: prevStart,
            reason
          });
        }
      } catch (e) {
        logger.warn(`[SchedulingService] Reschedule notification error: ${e.message}`);
      }

      return {
        success: true,
        message: 'Meeting successfully rescheduled.',
        meeting: user.role === 'candidate' ? meeting.toCandidateJSON() : meeting.toRecruiterJSON()
      };
    } finally {
      releaseLock(recId);
    }
  }

  /**
   * Cancels an existing meeting
   */
  async cancelMeeting(meetingId, user, reason = '') {
    if (!user) throw ApiError.unauthorized('Authentication required.');
    const userId = (user._id || user.id).toString();

    let meeting = null;
    if (meetingId && meetingId.startsWith('HC-MEET-')) {
      meeting = await Meeting.findOne({ reference: meetingId });
    } else if (meetingId) {
      meeting = await Meeting.findById(meetingId);
      if (!meeting) meeting = await Meeting.findOne({ reference: meetingId });
    }

    if (!meeting) {
      throw ApiError.notFound('Meeting not found.');
    }

    const recId = (meeting.recruiter?._id || meeting.recruiter).toString();
    const candId = (meeting.candidate?._id || meeting.candidate).toString();

    // Verify participant authorization
    if (userId !== recId && userId !== candId && user.role !== 'admin') {
      throw ApiError.forbidden('You are not authorized to cancel this meeting.');
    }

    if (meeting.status === 'cancelled') {
      throw ApiError.badRequest('This meeting has already been cancelled.');
    }
    if (meeting.status === 'completed') {
      throw ApiError.badRequest('Cannot cancel an already completed meeting.');
    }

    meeting.status = 'cancelled';
    meeting.cancelledAt = new Date();
    meeting.cancelledBy = user._id || user.id;
    meeting.cancellationReason = reason;

    meeting.history.push({
      event: 'cancelled',
      actor: user._id || user.id,
      actorName: user.name || 'User',
      previousStatus: 'scheduled',
      newStatus: 'cancelled',
      reason: reason || 'Cancelled by participant'
    });

    await meeting.save();

    // Dispatch cancellation notifications to both participants (Phase 9)
    try {
      const [candidateUser, recruiterUser] = await Promise.all([
        User.findById(meeting.candidate?._id || meeting.candidate),
        User.findById(meeting.recruiter?._id || meeting.recruiter)
      ]);
      if (candidateUser && recruiterUser) {
        await notificationService.notifyInterviewCancelled({
          meeting,
          candidate: candidateUser,
          recruiter: recruiterUser,
          actor: user,
          reason
        });
      }
    } catch (e) {
      logger.warn(`[SchedulingService] Cancel notification error: ${e.message}`);
    }

    return {
      success: true,
      message: 'Meeting successfully cancelled.',
      meeting: user.role === 'candidate' ? meeting.toCandidateJSON() : meeting.toRecruiterJSON()
    };
  }

  /**
   * Retrieves user's meetings (candidate or recruiter)
   */
  async getMyMeetings(user, options = {}) {
    if (!user) throw ApiError.unauthorized('Authentication required.');
    const userId = (user._id || user.id).toString();
    const isCandidate = user.role === 'candidate' || user.role === 'employee';

    const query = isCandidate ? { candidate: userId } : { recruiter: userId };

    if (options.status && options.status !== 'all') {
      query.status = options.status;
    }

    const now = new Date();
    if (options.timeframe === 'upcoming') {
      query.startAt = { $gte: now };
      query.status = 'scheduled';
    } else if (options.timeframe === 'past') {
      query.startAt = { $lt: now };
    }

    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(options.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const total = await Meeting.countDocuments(query);
    const records = await Meeting.find(query)
      .sort({ startAt: options.timeframe === 'upcoming' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('recruiter')
      .populate('candidate')
      .populate('job')
      .populate('company');

    const meetings = records.map((m) =>
      isCandidate && m.toCandidateJSON ? m.toCandidateJSON() : (m.toRecruiterJSON ? m.toRecruiterJSON() : m)
    );

    return {
      success: true,
      meetings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  /**
   * Retrieves a single meeting by ID with role-based redactions
   */
  async getMeetingById(meetingId, user) {
    if (!meetingId) throw ApiError.badRequest('Meeting ID is required.');
    let meeting = await Meeting.findById(meetingId)
      .populate('recruiter')
      .populate('candidate')
      .populate('job')
      .populate('company');

    if (!meeting) {
      meeting = await Meeting.findOne({ reference: meetingId })
        .populate('recruiter')
        .populate('candidate')
        .populate('job')
        .populate('company');
    }

    if (!meeting) {
      throw ApiError.notFound('Meeting not found.');
    }

    if (user) {
      const userId = (user._id || user.id).toString();
      const recId = (meeting.recruiter?._id || meeting.recruiter).toString();
      const candId = (meeting.candidate?._id || meeting.candidate).toString();

      if (userId !== recId && userId !== candId && user.role !== 'admin') {
        throw ApiError.forbidden('You are not authorized to view this meeting.');
      }

      if (user.role === 'candidate' || user.role === 'employee') {
        return meeting.toCandidateJSON ? meeting.toCandidateJSON() : meeting;
      }
    }

    return meeting.toRecruiterJSON ? meeting.toRecruiterJSON() : meeting;
  }
}

module.exports = new SchedulingService();
