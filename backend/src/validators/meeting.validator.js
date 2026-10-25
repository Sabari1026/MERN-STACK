/**
 * Zod Validation Schemas for HireConnect Scheduling & Meetings (Phase 8)
 */

const { z } = require('zod');
const { isValidTimeZone } = require('../utils/timeZone');

const weekdayEnum = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]);

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const weeklyRuleSchema = z.object({
  weekday: weekdayEnum,
  startTime: z.string().regex(timeFormatRegex, 'startTime must be formatted as HH:mm (24-hour)'),
  endTime: z.string().regex(timeFormatRegex, 'endTime must be formatted as HH:mm (24-hour)')
}).refine((data) => data.startTime < data.endTime, {
  message: 'startTime must precede endTime',
  path: ['endTime']
});

const updateAvailabilitySchema = z.object({
  timeZone: z
    .string()
    .trim()
    .refine(isValidTimeZone, { message: 'Invalid IANA time zone identifier' })
    .default('Asia/Kolkata'),
  weeklyRules: z.array(weeklyRuleSchema).min(1, 'At least one weekly rule is required'),
  slotDurations: z
    .array(z.number().positive())
    .min(1, 'At least one slot duration must be configured')
    .default([15, 30, 45, 60]),
  bufferBeforeMinutes: z.number().min(0).max(60).default(0),
  bufferAfterMinutes: z.number().min(0).max(60).default(0),
  minimumNoticeMinutes: z.number().min(0).default(120),
  maximumBookingDaysAhead: z.number().min(1).max(90).default(30),
  active: z.boolean().default(true)
});

const createExceptionSchema = z.object({
  startAt: z.string().datetime({ message: 'startAt must be a valid ISO 8601 UTC date string' }),
  endAt: z.string().datetime({ message: 'endAt must be a valid ISO 8601 UTC date string' }),
  type: z.enum(['unavailable', 'override']).default('unavailable'),
  reason: z.string().trim().max(500).optional().default('')
}).refine((data) => new Date(data.startAt) < new Date(data.endAt), {
  message: 'startAt must be earlier than endAt',
  path: ['endAt']
});

const availableSlotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format').optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be in YYYY-MM-DD format').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be in YYYY-MM-DD format').optional(),
  duration: z.coerce.number().positive().optional().default(30),
  timeZone: z.string().trim().refine(isValidTimeZone, { message: 'Invalid IANA time zone' }).optional().default('Asia/Kolkata')
});

const createMeetingSchema = z.object({
  recruiterId: z.string().trim().min(1, 'recruiterId is required').optional(),
  startAt: z.string().datetime({ message: 'startAt must be a valid ISO 8601 date string' }).optional(),
  durationMinutes: z.number().positive().optional().default(30),
  title: z.string().trim().max(200).optional().default('HireConnect Interview'),
  description: z.string().trim().max(2000).optional().default(''),
  meetingType: z.enum(['interview', 'screening', 'introductory', 'technical', 'general']).default('interview'),
  meetingMode: z.enum(['online', 'in_person']).default('online'),
  meetingLink: z.string().trim().optional().default(''),
  location: z.string().trim().max(300).optional().default(''),
  candidateNotes: z.string().trim().max(1000).optional().default(''),
  recruiterNotes: z.string().trim().max(3000).optional().default(''),
  applicationId: z.string().trim().optional(),
  jobId: z.string().trim().optional(),

  // Legacy booking form fields compatibility
  name: z.string().trim().optional(),
  email: z.string().email().optional(),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  purpose: z.string().trim().optional(),
  date: z.string().optional(),
  timeSlot: z.string().optional(),
  timezone: z.string().optional(),
  agenda: z.string().trim().optional()
});

const rescheduleMeetingSchema = z.object({
  newStartAt: z.string().datetime({ message: 'newStartAt must be a valid ISO 8601 date string' }).optional(),
  durationMinutes: z.number().positive().optional(),
  reason: z.string().trim().max(500).optional().default(''),

  // Legacy reschedule fields compatibility
  reference: z.string().trim().optional(),
  newDate: z.string().optional(),
  newSlot: z.string().optional()
});

const cancelMeetingSchema = z.object({
  reason: z.string().trim().max(500).optional().default(''),
  reference: z.string().trim().optional()
});

module.exports = {
  updateAvailabilitySchema,
  createExceptionSchema,
  availableSlotsQuerySchema,
  createMeetingSchema,
  rescheduleMeetingSchema,
  cancelMeetingSchema
};
