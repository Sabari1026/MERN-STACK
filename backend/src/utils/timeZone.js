/**
 * Time Zone Utility Functions for HireConnect Scheduling Engine (Phase 8)
 * Provides deterministic IANA time zone validation, conversion, and wall-clock calculations.
 */

/**
 * Validates whether an IANA time zone identifier is supported by the runtime
 * @param {string} tz - IANA time zone identifier (e.g. 'Asia/Kolkata', 'America/New_York', 'UTC')
 * @returns {boolean}
 */
function isValidTimeZone(tz) {
  if (!tz || typeof tz !== 'string') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Converts a local wall-clock date string and time string in a specific time zone to a UTC Date object.
 * Handles daylight saving time transitions cleanly without external libraries.
 *
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @param {string} timeStr - 'HH:mm'
 * @param {string} timeZone - IANA time zone identifier
 * @returns {Date} UTC Date instant
 */
function zonedTimeToUtc(dateStr, timeStr, timeZone = 'Asia/Kolkata') {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  const approx = new Date(Date.UTC(y, m - 1, d, h, min));

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23'
  });

  const parts = Object.fromEntries(formatter.formatToParts(approx).map((p) => [p.type, p.value]));
  const formattedUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  const offsetMs = formattedUtc - approx.getTime();

  return new Date(approx.getTime() - offsetMs);
}

/**
 * Extracts wall-clock components of a UTC Date in a given time zone
 * @param {Date} date - UTC Date
 * @param {string} timeZone - IANA time zone
 * @returns {{ year: number, month: number, day: number, hour: number, minute: number, weekday: string, dateStr: string, timeStr: string }}
 */
function getZonedDateTimeParts(date, timeZone = 'Asia/Kolkata') {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
    hourCycle: 'h23'
  });

  const parts = Object.fromEntries(formatter.formatToParts(date).map((p) => [p.type, p.value]));
  const weekday = parts.weekday ? parts.weekday.toLowerCase() : '';
  const dateStr = `${parts.year}-${parts.month}-${parts.day}`;
  const timeStr = `${parts.hour}:${parts.minute}`;

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday,
    dateStr,
    timeStr
  };
}

/**
 * Formats a UTC Date range into a user-friendly local time label (e.g. "10:00 AM - 10:30 AM")
 * @param {Date} startAt
 * @param {Date} endAt
 * @param {string} timeZone
 * @returns {string}
 */
function formatTimeSlotLabel(startAt, endAt, timeZone = 'Asia/Kolkata') {
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const startFormatted = timeFormatter.format(startAt);
  const endFormatted = timeFormatter.format(endAt);
  return `${startFormatted} - ${endFormatted}`;
}

module.exports = {
  isValidTimeZone,
  zonedTimeToUtc,
  getZonedDateTimeParts,
  formatTimeSlotLabel
};
