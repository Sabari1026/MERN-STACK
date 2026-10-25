/**
 * Admin Audit Service for HireConnect (Phase 10)
 * Append-only persistent audit logger capturing privileged platform operations.
 */

const AdminAuditLog = require('../models/adminAuditLog.model');
const logger = require('../utils/logger');

class AdminAuditService {
  /**
   * Record an immutable administrative action
   */
  async record({
    actor,
    action,
    resourceType,
    resourceId,
    previousState = null,
    newState = null,
    reason = '',
    req = null
  }) {
    try {
      const actorId = actor?._id || actor?.id || (typeof actor === 'string' ? actor : null);
      const actorName = actor?.name || 'Administrator';
      const actorEmail = actor?.email || '';
      const actorRole = actor?.role || 'admin';

      let ipAddress = '';
      let userAgent = '';
      if (req) {
        ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
        userAgent = req.headers['user-agent'] || '';
      }

      const log = await AdminAuditLog.create({
        actor: actorId,
        actorName,
        actorEmail,
        actorRole,
        action,
        resourceType,
        resourceId: resourceId ? resourceId.toString() : '',
        previousState,
        newState,
        reason,
        ipAddress,
        userAgent
      });

      return log;
    } catch (err) {
      // Audit failure should be logged loudly
      logger.error(`[AdminAuditService] Failed to record audit log for action "${action}": ${err.message}`);
      return null;
    }
  }

  /**
   * Retrieve paginated audit logs with validated filters
   */
  async listLogs(filters = {}) {
    const page = Math.max(1, parseInt(filters.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(filters.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const query = {};
    if (filters.action && filters.action !== 'all') {
      query.action = filters.action;
    }
    if (filters.resourceType && filters.resourceType !== 'all') {
      query.resourceType = filters.resourceType;
    }
    if (filters.actorId) {
      query.actor = filters.actorId;
    }
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const total = await AdminAuditLog.countDocuments(query);
    const logs = await AdminAuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      logs: logs.map(l => (l.toObject ? l.toObject() : l)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: page < (Math.ceil(total / limit) || 1)
      }
    };
  }
}

module.exports = new AdminAuditService();
