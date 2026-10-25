/**
 * Structured logger for HireConnect backend
 * Safely formats logs, associates request correlation IDs, and redacts sensitive credentials.
 */

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'set-cookie',
  'jwt_secret',
  'cookie_secret'
];

/**
 * Redact connection strings containing credentials (e.g. mongodb://user:pass@host)
 * Handles passwords containing special characters (including @ symbols).
 * @param {string} str
 * @returns {string}
 */
function redactConnectionString(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/(mongodb(?:\+srv)?:\/\/[^:/@\s]+:)(.*)(@[^/@\s]+)/gi, '$1***$3');
}

/**
 * Deeply redact sensitive keys in objects
 * @param {*} data
 * @param {number} depth
 * @returns {*}
 */
function redact(data, depth = 0) {
  if (depth > 5) return '[Truncated]';
  if (!data || typeof data !== 'object') {
    if (typeof data === 'string') {
      return redactConnectionString(data);
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => redact(item, depth + 1));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some(k => lowerKey.includes(k))) {
      sanitized[key] = '***REDACTED***';
    } else {
      sanitized[key] = redact(value, depth + 1);
    }
  }
  return sanitized;
}

function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const sanitizedMeta = redact(meta);
  const logObj = {
    timestamp,
    level,
    message: redactConnectionString(message),
    ...(Object.keys(sanitizedMeta).length > 0 ? { context: sanitizedMeta } : {})
  };

  if (process.env.NODE_ENV === 'test') {
    // Keep test output clean unless explicit debugging is on
    if (process.env.DEBUG_LOGS === 'true') {
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${logObj.message}`);
    }
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify(logObj));
  } else {
    // Development readable format
    const metaStr = Object.keys(sanitizedMeta).length > 0 ? ' ' + JSON.stringify(sanitizedMeta) : '';
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    if (level === 'error') {
      console.error(`${prefix} ${logObj.message}${metaStr}`);
    } else if (level === 'warn') {
      console.warn(`${prefix} ${logObj.message}${metaStr}`);
    } else {
      console.log(`${prefix} ${logObj.message}${metaStr}`);
    }
  }
}

const logger = {
  info: (msg, meta) => formatLog('info', msg, meta),
  warn: (msg, meta) => formatLog('warn', msg, meta),
  error: (msg, meta) => formatLog('error', msg, meta),
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
      formatLog('debug', msg, meta);
    }
  },
  redact,
  redactConnectionString
};

module.exports = logger;
