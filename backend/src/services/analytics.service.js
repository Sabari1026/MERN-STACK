/**
 * Analytics Service for HireConnect (Phase 11)
 * Computes platform, recruiter, company, and candidate metrics from real database records.
 * Supports date ranges, period comparisons, time-series generation, recruitment funnels,
 * and secure CSV exports with spreadsheet formula injection protection.
 */

const User = require('../models/user.model');
const Company = require('../models/company.model');
const Job = require('../models/job.model');
const Application = require('../models/application.model');
const Meeting = require('../models/meeting.model');
const SavedJob = require('../models/savedJob.model');
const CompanyMembership = require('../models/companyMembership.model');
const RecruiterProfile = require('../models/recruiterProfile.model');
const NotificationOutbox = require('../models/notificationOutbox.model');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Neutralizes spreadsheet formula injection (=, +, -, @) and escapes CSV characters
 */
function sanitizeCsvCell(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (/^[+=@\-\t\r]/.test(str)) {
    str = `'${str}`;
  }
  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Calculates honest percentage change between periods
 * Handles zero baselines gracefully without division by zero
 */
function calculatePercentageChange(current, previous) {
  if (previous === 0) {
    if (current === 0) return 0;
    return null; // Baseline was 0; percentage change is mathematically undefined/infinite
  }
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Generates UTC date range boundaries and daily buckets
 */
function getDateRangeInfo(period = '30d', startDateStr, endDateStr) {
  const now = new Date();
  let currentStart;
  let currentEnd;

  if (period === 'custom' && startDateStr && endDateStr) {
    const s = new Date(startDateStr);
    const e = new Date(endDateStr);
    currentStart = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate(), 0, 0, 0, 0));
    currentEnd = new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), 23, 59, 59, 999));
  } else {
    // End of today UTC
    currentEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    let days = 30;
    if (period === '7d') days = 7;
    if (period === '90d') days = 90;

    const s = new Date(currentEnd);
    s.setUTCDate(s.getUTCDate() - (days - 1));
    currentStart = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate(), 0, 0, 0, 0));
  }

  // Previous equivalent period
  const durationMs = currentEnd.getTime() - currentStart.getTime() + 1;
  const prevEnd = new Date(currentStart.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs + 1);

  // Generate daily bucket date strings (YYYY-MM-DD)
  const buckets = [];
  const curr = new Date(currentStart);
  while (curr <= currentEnd) {
    buckets.push(curr.toISOString().split('T')[0]);
    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  return {
    period,
    currentStart,
    currentEnd,
    prevStart,
    prevEnd,
    buckets
  };
}

class AnalyticsService {
  /**
   * Helper to retrieve all authorized job IDs for a recruiter
   */
  async getRecruiterAuthorizedJobIds(user) {
    const userId = (user._id || user.id).toString();

    // 1. Identify companies recruiter belongs to
    let companyIds = [];
    if (user.role === 'admin') {
      const allCompanies = await Company.find({});
      companyIds = allCompanies.map((c) => (c._id || c.id).toString());
    } else {
      const memberships = await CompanyMembership.find({
        user: userId,
        status: 'active'
      });
      companyIds = memberships.map((m) => (m.company?._id || m.company?.id || m.company).toString());

      if (!companyIds.length) {
        const recProfile = await RecruiterProfile.findOne({ user: userId });
        if (recProfile && recProfile.company) {
          companyIds = [(recProfile.company?._id || recProfile.company).toString()];
        }
      }
    }

    // 2. Query jobs managed by this recruiter
    let jobs = [];
    if (companyIds.length > 0) {
      jobs = await Job.find({
        $or: [
          { company: { $in: companyIds } },
          { recruiter: userId },
          { createdBy: userId }
        ]
      });
    } else {
      jobs = await Job.find({
        $or: [
          { recruiter: userId },
          { createdBy: userId }
        ]
      });
    }

    return {
      jobs,
      jobIds: jobs.map((j) => (j._id || j.id).toString()),
      companyIds
    };
  }

  // ==========================================================================
  // PART B: ADMIN ANALYTICS
  // ==========================================================================

  /**
   * Platform-wide aggregated metrics, growth comparisons, and daily time series
   */
  async getAdminOverview(query = {}) {
    const { period, startDate, endDate } = query;
    const { currentStart, currentEnd, prevStart, prevEnd, buckets } = getDateRangeInfo(period, startDate, endDate);
    const now = new Date();

    // 1. User Metrics
    const [allUsers, newUsersCurrent, newUsersPrev] = await Promise.all([
      User.find({}),
      User.find({ createdAt: { $gte: currentStart, $lte: currentEnd } }),
      User.find({ createdAt: { $gte: prevStart, $lte: prevEnd } })
    ]);

    const usersSummary = {
      total: allUsers.length,
      candidates: allUsers.filter((u) => u.role === 'candidate').length,
      recruiters: allUsers.filter((u) => u.role === 'recruiter').length,
      admins: allUsers.filter((u) => u.role === 'admin').length,
      active: allUsers.filter((u) => u.accountStatus === 'active').length,
      suspended: allUsers.filter((u) => u.accountStatus === 'suspended').length,
      newInPeriod: newUsersCurrent.length,
      previousPeriod: newUsersPrev.length,
      growthPercentage: calculatePercentageChange(newUsersCurrent.length, newUsersPrev.length)
    };

    // 2. Company Metrics
    const [allCompanies, newCompaniesCurrent, newCompaniesPrev] = await Promise.all([
      Company.find({}),
      Company.find({ createdAt: { $gte: currentStart, $lte: currentEnd } }),
      Company.find({ createdAt: { $gte: prevStart, $lte: prevEnd } })
    ]);

    const companiesSummary = {
      total: allCompanies.length,
      verified: allCompanies.filter((c) => c.verificationStatus === 'verified' || c.verified === true).length,
      pendingVerification: allCompanies.filter((c) => c.verificationStatus === 'pending' || c.verificationStatus === 'under_review').length,
      suspended: allCompanies.filter((c) => c.verificationStatus === 'suspended').length,
      newInPeriod: newCompaniesCurrent.length,
      previousPeriod: newCompaniesPrev.length,
      growthPercentage: calculatePercentageChange(newCompaniesCurrent.length, newCompaniesPrev.length)
    };

    // 3. Job Metrics
    const [allJobs, newJobsCurrent, newJobsPrev] = await Promise.all([
      Job.find({}),
      Job.find({ createdAt: { $gte: currentStart, $lte: currentEnd } }),
      Job.find({ createdAt: { $gte: prevStart, $lte: prevEnd } })
    ]);

    const jobsSummary = {
      total: allJobs.length,
      published: allJobs.filter((j) => j.status === 'published' && j.moderationStatus !== 'removed').length,
      draft: allJobs.filter((j) => j.status === 'draft').length,
      closed: allJobs.filter((j) => j.status === 'closed').length,
      moderated: allJobs.filter((j) => j.moderationStatus === 'removed' || j.isModerated === true).length,
      newInPeriod: newJobsCurrent.length,
      previousPeriod: newJobsPrev.length,
      growthPercentage: calculatePercentageChange(newJobsCurrent.length, newJobsPrev.length)
    };

    // 4. Application Metrics
    const [allApplications, newAppsCurrent, newAppsPrev] = await Promise.all([
      Application.find({}),
      Application.find({ createdAt: { $gte: currentStart, $lte: currentEnd } }),
      Application.find({ createdAt: { $gte: prevStart, $lte: prevEnd } })
    ]);

    const statusCounts = {
      applied: 0,
      under_review: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0
    };
    allApplications.forEach((app) => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });

    const applicationsSummary = {
      total: allApplications.length,
      newInPeriod: newAppsCurrent.length,
      previousPeriod: newAppsPrev.length,
      growthPercentage: calculatePercentageChange(newAppsCurrent.length, newAppsPrev.length),
      statusDistribution: statusCounts
    };

    // 5. Meeting / Interview Metrics
    const [allMeetings, periodMeetings] = await Promise.all([
      Meeting.find({}),
      Meeting.find({ createdAt: { $gte: currentStart, $lte: currentEnd } })
    ]);

    const upcomingInterviews = allMeetings.filter(
      (m) => (m.status === 'scheduled' || m.status === 'rescheduled') && new Date(m.startAt) >= now
    ).length;

    const interviewsSummary = {
      total: allMeetings.length,
      scheduledInPeriod: periodMeetings.length,
      upcoming: upcomingInterviews,
      completed: allMeetings.filter((m) => m.status === 'completed').length,
      cancelled: allMeetings.filter((m) => m.status === 'cancelled').length
    };

    // 6. Email / Notification Outbox Metrics (real records only)
    let emailSummary = {
      totalQueued: 0,
      sent: 0,
      failed: 0,
      deliverySuccessRate: 100
    };
    try {
      const outboxItems = await NotificationOutbox.find({});
      if (outboxItems && outboxItems.length > 0) {
        const sent = outboxItems.filter((i) => i.status === 'sent').length;
        const failed = outboxItems.filter((i) => i.status === 'failed').length;
        const total = outboxItems.length;
        emailSummary = {
          totalQueued: total,
          sent,
          failed,
          deliverySuccessRate: total > 0 ? Math.round((sent / total) * 100) : 100
        };
      }
    } catch (err) {
      logger.warn('[Analytics] Outbox records unavailable for stats calculation');
    }

    // 7. Daily Time Series
    const dateMap = {};
    buckets.forEach((b) => {
      dateMap[b] = {
        date: b,
        users: 0,
        jobs: 0,
        applications: 0,
        interviews: 0
      };
    });

    const safeDateKey = (val) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
    };

    newUsersCurrent.forEach((u) => {
      const d = safeDateKey(u.createdAt);
      if (d && dateMap[d]) dateMap[d].users++;
    });

    newJobsCurrent.forEach((j) => {
      const d = safeDateKey(j.createdAt || j.publishedAt);
      if (d && dateMap[d]) dateMap[d].jobs++;
    });

    newAppsCurrent.forEach((a) => {
      const d = safeDateKey(a.createdAt || a.submittedAt);
      if (d && dateMap[d]) dateMap[d].applications++;
    });

    periodMeetings.forEach((m) => {
      const d = safeDateKey(m.createdAt || m.startAt);
      if (d && dateMap[d]) dateMap[d].interviews++;
    });

    const timeSeries = buckets.map((b) => dateMap[b]);

    return {
      summary: {
        users: usersSummary,
        companies: companiesSummary,
        jobs: jobsSummary,
        applications: applicationsSummary,
        interviews: interviewsSummary,
        emails: emailSummary
      },
      timeSeries,
      metadata: {
        period: query.period || '30d',
        startDate: currentStart.toISOString(),
        endDate: currentEnd.toISOString(),
        previousPeriod: {
          startDate: prevStart.toISOString(),
          endDate: prevEnd.toISOString()
        },
        reportingTimeZone: 'UTC',
        generatedAt: now.toISOString()
      }
    };
  }

  /**
   * Platform recruitment funnel and stage conversion breakdown
   */
  async getAdminRecruitmentFunnel(query = {}) {
    const { period, startDate, endDate, jobId, companyId } = query;
    const filter = {};

    if (period && period !== 'all') {
      const { currentStart, currentEnd } = getDateRangeInfo(period, startDate, endDate);
      filter.createdAt = { $gte: currentStart, $lte: currentEnd };
    }
    if (jobId) filter.job = jobId;
    if (companyId) filter.company = companyId;

    const applications = await Application.find(filter);

    // Current status counts
    const currentStatusDistribution = {
      applied: 0,
      under_review: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0
    };

    // Stage conversion counts (An application that reached 'offered' has passed through earlier stages)
    const stageReachable = {
      applied: 0,
      reviewed: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0
    };

    let totalReviewTimeHours = 0;
    let reviewedCountWithHistory = 0;

    applications.forEach((app) => {
      const status = app.status;
      if (currentStatusDistribution[status] !== undefined) {
        currentStatusDistribution[status]++;
      }

      stageReachable.applied++;

      // Check status history for accurate transition timestamps
      if (Array.isArray(app.statusHistory) && app.statusHistory.length > 0) {
        const firstReviewEvent = app.statusHistory.find(
          (h) => h.toStatus && h.toStatus !== 'applied' && h.toStatus !== 'withdrawn'
        );
        if (firstReviewEvent && firstReviewEvent.changedAt) {
          const appCreatedAt = new Date(app.createdAt).getTime();
          const changedAt = new Date(firstReviewEvent.changedAt).getTime();
          if (changedAt >= appCreatedAt) {
            totalReviewTimeHours += (changedAt - appCreatedAt) / (1000 * 60 * 60);
            reviewedCountWithHistory++;
          }
        }
      }

      // Progression accumulation
      if (['under_review', 'shortlisted', 'interview', 'offered'].includes(status)) {
        stageReachable.reviewed++;
      }
      if (['shortlisted', 'interview', 'offered'].includes(status)) {
        stageReachable.shortlisted++;
      }
      if (['interview', 'offered'].includes(status)) {
        stageReachable.interview++;
      }
      if (status === 'offered') {
        stageReachable.offered++;
      }
    });

    const totalApplied = stageReachable.applied;
    const conversionRates = {
      appliedToReviewed: totalApplied > 0 ? Math.round((stageReachable.reviewed / totalApplied) * 100) : 0,
      reviewedToShortlisted: stageReachable.reviewed > 0 ? Math.round((stageReachable.shortlisted / stageReachable.reviewed) * 100) : 0,
      shortlistedToInterview: stageReachable.shortlisted > 0 ? Math.round((stageReachable.interview / stageReachable.shortlisted) * 100) : 0,
      interviewToOffered: stageReachable.interview > 0 ? Math.round((stageReachable.offered / stageReachable.interview) * 100) : 0,
      overallConversion: totalApplied > 0 ? Math.round((stageReachable.offered / totalApplied) * 100) : 0
    };

    const avgTimeToFirstReviewHours =
      reviewedCountWithHistory > 0 ? Math.round((totalReviewTimeHours / reviewedCountWithHistory) * 10) / 10 : null;

    return {
      totalApplications: applications.length,
      currentStatusDistribution,
      funnelStages: [
        { stage: 'Applied', count: stageReachable.applied, conversionRate: 100 },
        { stage: 'Under Review', count: stageReachable.reviewed, conversionRate: conversionRates.appliedToReviewed },
        { stage: 'Shortlisted', count: stageReachable.shortlisted, conversionRate: conversionRates.reviewedToShortlisted },
        { stage: 'Interview', count: stageReachable.interview, conversionRate: conversionRates.shortlistedToInterview },
        { stage: 'Offered', count: stageReachable.offered, conversionRate: conversionRates.interviewToOffered }
      ],
      conversionRates,
      metrics: {
        avgTimeToFirstReviewHours,
        avgTimeToFirstReviewDays: avgTimeToFirstReviewHours ? Math.round((avgTimeToFirstReviewHours / 24) * 10) / 10 : null,
        historicalHistoryAvailable: reviewedCountWithHistory > 0
      },
      metadata: {
        filterJobId: jobId || 'all',
        filterCompanyId: companyId || 'all',
        period: query.period || 'all'
      }
    };
  }

  /**
   * Export administrative report as a secure CSV string
   */
  async exportAdminReport(query = {}) {
    const type = query.type || 'platform_summary';
    const overview = await this.getAdminOverview(query);

    if (type === 'platform_summary') {
      const rows = [
        ['HireConnect Platform Administration Analytics Report'],
        [`Generated At: ${new Date().toISOString()} (UTC)`],
        [`Period: ${query.period || '30d'} (${overview.metadata.startDate} to ${overview.metadata.endDate})`],
        [''],
        ['Metric Category', 'Metric Name', 'Current Total / Period', 'Previous Period', 'Growth (%)'],
        ['Users', 'Total Users', overview.summary.users.total, '-', '-'],
        ['Users', 'Candidates', overview.summary.users.candidates, '-', '-'],
        ['Users', 'Recruiters', overview.summary.users.recruiters, '-', '-'],
        ['Users', 'New Users (Period)', overview.summary.users.newInPeriod, overview.summary.users.previousPeriod, overview.summary.users.growthPercentage ?? 'N/A'],
        ['Companies', 'Total Companies', overview.summary.companies.total, '-', '-'],
        ['Companies', 'Verified Companies', overview.summary.companies.verified, '-', '-'],
        ['Companies', 'Pending Verification', overview.summary.companies.pendingVerification, '-', '-'],
        ['Companies', 'New Companies (Period)', overview.summary.companies.newInPeriod, overview.summary.companies.previousPeriod, overview.summary.companies.growthPercentage ?? 'N/A'],
        ['Jobs', 'Total Jobs', overview.summary.jobs.total, '-', '-'],
        ['Jobs', 'Published Active Jobs', overview.summary.jobs.published, '-', '-'],
        ['Jobs', 'New Jobs (Period)', overview.summary.jobs.newInPeriod, overview.summary.jobs.previousPeriod, overview.summary.jobs.growthPercentage ?? 'N/A'],
        ['Applications', 'Total Applications', overview.summary.applications.total, '-', '-'],
        ['Applications', 'New Applications (Period)', overview.summary.applications.newInPeriod, overview.summary.applications.previousPeriod, overview.summary.applications.growthPercentage ?? 'N/A'],
        ['Interviews', 'Interviews Scheduled (Period)', overview.summary.interviews.scheduledInPeriod, '-', '-'],
        ['Interviews', 'Upcoming Active Interviews', overview.summary.interviews.upcoming, '-', '-']
      ];

      return rows.map((r) => r.map(sanitizeCsvCell).join(',')).join('\r\n');
    }

    if (type === 'jobs_summary') {
      const jobs = await Job.find({}).populate('company');
      const rows = [
        ['Job ID', 'Title', 'Company', 'Status', 'Created At', 'Published At']
      ];
      jobs.forEach((j) => {
        rows.push([
          (j._id || j.id).toString(),
          j.title,
          j.company?.name || j.companyName || 'Independent',
          j.status,
          j.createdAt ? new Date(j.createdAt).toISOString() : '',
          j.publishedAt ? new Date(j.publishedAt).toISOString() : ''
        ]);
      });
      return rows.map((r) => r.map(sanitizeCsvCell).join(',')).join('\r\n');
    }

    if (type === 'applications_funnel') {
      const funnel = await this.getAdminRecruitmentFunnel(query);
      const rows = [
        ['Recruitment Funnel Stage', 'Application Count', 'Conversion Rate (%)'],
        ...funnel.funnelStages.map((s) => [s.stage, s.count, `${s.conversionRate}%`]),
        [''],
        ['Status Snapshot Distribution', 'Count'],
        ...Object.entries(funnel.currentStatusDistribution).map(([k, v]) => [k, v])
      ];
      return rows.map((r) => r.map(sanitizeCsvCell).join(',')).join('\r\n');
    }

    // Default users_summary
    const users = await User.find({});
    const rows = [
      ['User ID', 'Name', 'Email', 'Role', 'Account Status', 'Created At']
    ];
    users.forEach((u) => {
      rows.push([
        (u._id || u.id).toString(),
        u.name,
        u.email,
        u.role,
        u.accountStatus,
        u.createdAt ? new Date(u.createdAt).toISOString() : ''
      ]);
    });
    return rows.map((r) => r.map(sanitizeCsvCell).join(',')).join('\r\n');
  }

  // ==========================================================================
  // PART C: RECRUITER ANALYTICS
  // ==========================================================================

  /**
   * Recruiter dashboard overview scoped strictly to authorized jobs
   */
  async getRecruiterOverview(user, query = {}) {
    const { period, startDate, endDate } = query;
    const { currentStart, currentEnd, prevStart, prevEnd, buckets } = getDateRangeInfo(period, startDate, endDate);
    const now = new Date();

    const { jobs, jobIds } = await this.getRecruiterAuthorizedJobIds(user);

    if (jobIds.length === 0) {
      return {
        summary: {
          jobsManaged: 0,
          activeJobs: 0,
          draftJobs: 0,
          closedJobs: 0,
          totalApplications: 0,
          newApplicationsInPeriod: 0,
          previousPeriodApplications: 0,
          applicationGrowthPercentage: 0,
          shortlistedCandidates: 0,
          interviewStageApplications: 0,
          offersMade: 0,
          upcomingInterviews: 0,
          statusDistribution: {
            applied: 0,
            under_review: 0,
            shortlisted: 0,
            interview: 0,
            offered: 0,
            rejected: 0,
            withdrawn: 0
          }
        },
        timeSeries: buckets.map((b) => ({ date: b, applications: 0 })),
        metadata: {
          period: query.period || '30d',
          startDate: currentStart.toISOString(),
          endDate: currentEnd.toISOString(),
          authorizedJobsCount: 0
        }
      };
    }

    // 1. Job Counts
    const activeJobs = jobs.filter((j) => j.status === 'published' && j.moderationStatus !== 'removed').length;
    const draftJobs = jobs.filter((j) => j.status === 'draft').length;
    const closedJobs = jobs.filter((j) => j.status === 'closed').length;

    // 2. Applications Scoped to Recruiter's Jobs
    const [allApps, periodApps, prevApps] = await Promise.all([
      Application.find({ job: { $in: jobIds } }),
      Application.find({ job: { $in: jobIds }, createdAt: { $gte: currentStart, $lte: currentEnd } }),
      Application.find({ job: { $in: jobIds }, createdAt: { $gte: prevStart, $lte: prevEnd } })
    ]);

    const statusCounts = {
      applied: 0,
      under_review: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0
    };
    allApps.forEach((a) => {
      if (statusCounts[a.status] !== undefined) {
        statusCounts[a.status]++;
      }
    });

    // 3. Upcoming Interviews
    const recruiterUserId = (user._id || user.id).toString();
    const meetings = await Meeting.find({
      $or: [
        { recruiterId: recruiterUserId },
        { jobId: { $in: jobIds } }
      ]
    });

    const upcomingInterviews = meetings.filter(
      (m) => (m.status === 'scheduled' || m.status === 'rescheduled') && new Date(m.startAt) >= now
    ).length;

    // 4. Daily Time Series
    const dateMap = {};
    buckets.forEach((b) => {
      dateMap[b] = { date: b, applications: 0 };
    });
    periodApps.forEach((a) => {
      const val = a.createdAt || a.submittedAt;
      if (val) {
        const parsedD = new Date(val);
        if (!isNaN(parsedD.getTime())) {
          const d = parsedD.toISOString().split('T')[0];
          if (dateMap[d]) dateMap[d].applications++;
        }
      }
    });

    return {
      summary: {
        jobsManaged: jobs.length,
        activeJobs,
        draftJobs,
        closedJobs,
        totalApplications: allApps.length,
        newApplicationsInPeriod: periodApps.length,
        previousPeriodApplications: prevApps.length,
        applicationGrowthPercentage: calculatePercentageChange(periodApps.length, prevApps.length),
        shortlistedCandidates: statusCounts.shortlisted,
        interviewStageApplications: statusCounts.interview,
        offersMade: statusCounts.offered,
        upcomingInterviews,
        statusDistribution: statusCounts
      },
      timeSeries: buckets.map((b) => dateMap[b]),
      metadata: {
        period: query.period || '30d',
        startDate: currentStart.toISOString(),
        endDate: currentEnd.toISOString(),
        authorizedJobsCount: jobs.length
      }
    };
  }

  /**
   * Recruiter job performance table with pagination, sorting, and status distribution
   */
  async getRecruiterJobsAnalytics(user, query = {}) {
    const { period, startDate, endDate, page = 1, limit = 10, sort = 'totalApplications:desc', status = 'all' } = query;
    const { currentStart, currentEnd } = getDateRangeInfo(period, startDate, endDate);

    const { jobs, jobIds } = await this.getRecruiterAuthorizedJobIds(user);

    if (jobIds.length === 0) {
      return {
        jobs: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }

    // Filter jobs by status if requested
    let targetJobs = jobs;
    if (status !== 'all') {
      targetJobs = targetJobs.filter((j) => j.status === status);
    }

    // Fetch applications for all authorized jobs
    const [allApps, periodApps] = await Promise.all([
      Application.find({ job: { $in: jobIds } }),
      Application.find({ job: { $in: jobIds }, createdAt: { $gte: currentStart, $lte: currentEnd } })
    ]);

    // Aggregate stats per job
    const jobStats = targetJobs.map((j) => {
      const strId = (j._id || j.id).toString();
      const jobAllApps = allApps.filter((a) => (a.job?._id || a.job?.id || a.job).toString() === strId);
      const jobPeriodApps = periodApps.filter((a) => (a.job?._id || a.job?.id || a.job).toString() === strId);

      const statusBreakdown = {
        applied: 0,
        under_review: 0,
        shortlisted: 0,
        interview: 0,
        offered: 0,
        rejected: 0,
        withdrawn: 0
      };

      let latestAppDate = null;
      jobAllApps.forEach((a) => {
        if (statusBreakdown[a.status] !== undefined) {
          statusBreakdown[a.status]++;
        }
        if (a.createdAt) {
          const dt = new Date(a.createdAt);
          if (!latestAppDate || dt > latestAppDate) {
            latestAppDate = dt;
          }
        }
      });

      return {
        jobId: strId,
        title: j.title,
        companyName: j.company?.name || j.companyName || 'Company',
        status: j.status,
        createdAt: j.createdAt,
        publishedAt: j.publishedAt || j.createdAt,
        totalApplications: jobAllApps.length,
        newApplicationsInPeriod: jobPeriodApps.length,
        statusBreakdown,
        shortlistedCount: statusBreakdown.shortlisted,
        interviewCount: statusBreakdown.interview,
        offersCount: statusBreakdown.offered,
        latestApplicationDate: latestAppDate ? latestAppDate.toISOString() : null
      };
    });

    // Sort jobs
    const [field, direction] = sort.split(':');
    const isDesc = direction === 'desc';

    jobStats.sort((a, b) => {
      let va = a[field];
      let vb = b[field];
      if (va instanceof Date) va = va.getTime();
      if (vb instanceof Date) vb = vb.getTime();
      if (typeof va === 'string') return isDesc ? vb.localeCompare(va) : va.localeCompare(vb);
      return isDesc ? (vb || 0) - (va || 0) : (va || 0) - (vb || 0);
    });

    const total = jobStats.length;
    const skip = (page - 1) * limit;
    const paginatedJobs = jobStats.slice(skip, skip + limit);

    return {
      jobs: paginatedJobs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  /**
   * Single job recruitment funnel
   */
  async getRecruiterJobFunnel(user, jobId) {
    const { jobIds } = await this.getRecruiterAuthorizedJobIds(user);

    if (!jobIds.includes(jobId.toString())) {
      throw ApiError.forbidden('Forbidden: You are not authorized to view analytics for this job posting.');
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      throw ApiError.notFound('Job posting not found.');
    }

    const applications = await Application.find({ job: jobId });

    const statusCounts = {
      applied: 0,
      under_review: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0
    };

    const stageReachable = {
      applied: 0,
      reviewed: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0
    };

    applications.forEach((a) => {
      if (statusCounts[a.status] !== undefined) {
        statusCounts[a.status]++;
      }
      stageReachable.applied++;
      if (['under_review', 'shortlisted', 'interview', 'offered'].includes(a.status)) {
        stageReachable.reviewed++;
      }
      if (['shortlisted', 'interview', 'offered'].includes(a.status)) {
        stageReachable.shortlisted++;
      }
      if (['interview', 'offered'].includes(a.status)) {
        stageReachable.interview++;
      }
      if (a.status === 'offered') {
        stageReachable.offered++;
      }
    });

    const totalApplied = stageReachable.applied;
    const conversionRates = {
      appliedToReviewed: totalApplied > 0 ? Math.round((stageReachable.reviewed / totalApplied) * 100) : 0,
      reviewedToShortlisted: stageReachable.reviewed > 0 ? Math.round((stageReachable.shortlisted / stageReachable.reviewed) * 100) : 0,
      shortlistedToInterview: stageReachable.shortlisted > 0 ? Math.round((stageReachable.interview / stageReachable.shortlisted) * 100) : 0,
      interviewToOffered: stageReachable.interview > 0 ? Math.round((stageReachable.offered / stageReachable.interview) * 100) : 0,
      overallConversion: totalApplied > 0 ? Math.round((stageReachable.offered / totalApplied) * 100) : 0
    };

    return {
      job: {
        id: (job._id || job.id).toString(),
        title: job.title,
        companyName: job.company?.name || job.companyName || 'Company',
        status: job.status
      },
      totalApplications: applications.length,
      currentStatusDistribution: statusCounts,
      funnelStages: [
        { stage: 'Applied', count: stageReachable.applied, conversionRate: 100 },
        { stage: 'Under Review', count: stageReachable.reviewed, conversionRate: conversionRates.appliedToReviewed },
        { stage: 'Shortlisted', count: stageReachable.shortlisted, conversionRate: conversionRates.reviewedToShortlisted },
        { stage: 'Interview', count: stageReachable.interview, conversionRate: conversionRates.shortlistedToInterview },
        { stage: 'Offered', count: stageReachable.offered, conversionRate: conversionRates.interviewToOffered }
      ],
      conversionRates
    };
  }

  /**
   * Export recruiter jobs analytics as CSV
   */
  async exportRecruiterJobsReport(user, query = {}) {
    const result = await this.getRecruiterJobsAnalytics(user, { ...query, limit: 1000, page: 1 });
    const rows = [
      ['Job ID', 'Title', 'Company', 'Status', 'Total Applications', 'New in Period', 'Shortlisted', 'Interview Stage', 'Offered', 'Published Date']
    ];

    result.jobs.forEach((j) => {
      rows.push([
        j.jobId,
        j.title,
        j.companyName,
        j.status,
        j.totalApplications,
        j.newApplicationsInPeriod,
        j.shortlistedCount,
        j.interviewCount,
        j.offersCount,
        j.publishedAt ? new Date(j.publishedAt).toISOString() : ''
      ]);
    });

    return rows.map((r) => r.map(sanitizeCsvCell).join(',')).join('\r\n');
  }

  // ==========================================================================
  // PART D: COMPANY ANALYTICS
  // ==========================================================================

  /**
   * Analytics scoped to a company
   */
  async getCompanyAnalytics(companyId, query = {}) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw ApiError.notFound('Company not found.');
    }

    const { period, startDate, endDate } = query;
    const { currentStart, currentEnd, prevStart, prevEnd } = getDateRangeInfo(period, startDate, endDate);

    const strCompId = (company._id || company.id).toString();

    // Find all jobs for company
    const jobs = await Job.find({ company: strCompId });
    const jobIds = jobs.map((j) => (j._id || j.id).toString());

    const activeJobs = jobs.filter((j) => j.status === 'published' && j.moderationStatus !== 'removed').length;
    const closedJobs = jobs.filter((j) => j.status === 'closed').length;
    const draftJobs = jobs.filter((j) => j.status === 'draft').length;

    // Applications
    const [allApps, periodApps, prevApps] = await Promise.all([
      Application.find({ company: strCompId }),
      Application.find({ company: strCompId, createdAt: { $gte: currentStart, $lte: currentEnd } }),
      Application.find({ company: strCompId, createdAt: { $gte: prevStart, $lte: prevEnd } })
    ]);

    const statusDistribution = {
      applied: 0,
      under_review: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0
    };
    allApps.forEach((a) => {
      if (statusDistribution[a.status] !== undefined) {
        statusDistribution[a.status]++;
      }
    });

    // Top 5 performing jobs by applications
    const jobAppCounts = {};
    allApps.forEach((a) => {
      const jId = (a.job?._id || a.job?.id || a.job).toString();
      jobAppCounts[jId] = (jobAppCounts[jId] || 0) + 1;
    });

    const topJobs = jobs
      .map((j) => {
        const id = (j._id || j.id).toString();
        return {
          id,
          title: j.title,
          status: j.status,
          totalApplications: jobAppCounts[id] || 0
        };
      })
      .sort((a, b) => b.totalApplications - a.totalApplications)
      .slice(0, 5);

    return {
      company: {
        id: strCompId,
        name: company.name,
        verificationStatus: company.verificationStatus
      },
      summary: {
        totalJobs: jobs.length,
        activeJobs,
        closedJobs,
        draftJobs,
        totalApplications: allApps.length,
        newApplicationsInPeriod: periodApps.length,
        previousPeriodApplications: prevApps.length,
        growthPercentage: calculatePercentageChange(periodApps.length, prevApps.length),
        statusDistribution
      },
      topJobs,
      metadata: {
        period: query.period || '30d',
        startDate: currentStart.toISOString(),
        endDate: currentEnd.toISOString()
      }
    };
  }

  // ==========================================================================
  // PART E: CANDIDATE ACTIVITY ANALYTICS
  // ==========================================================================

  /**
   * Candidate personal activity statistics scoped exclusively to the requester
   */
  async getCandidateOverview(candidateUserId) {
    const userId = candidateUserId.toString();
    const now = new Date();

    const [applications, savedJobs, meetings] = await Promise.all([
      Application.find({ candidate: userId }).populate('job'),
      SavedJob.find({ candidate: userId }),
      Meeting.find({ candidateId: userId })
    ]);

    const statusCounts = {
      applied: 0,
      under_review: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0
    };

    applications.forEach((a) => {
      if (statusCounts[a.status] !== undefined) {
        statusCounts[a.status]++;
      }
    });

    const upcomingInterviews = meetings.filter(
      (m) => (m.status === 'scheduled' || m.status === 'rescheduled') && new Date(m.startAt) >= now
    ).length;

    // Recent activity (last 5 applications)
    const recentActivity = applications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((a) => ({
        applicationId: (a._id || a.id).toString(),
        jobTitle: a.job?.title || 'Job Opening',
        companyName: a.job?.company?.name || a.job?.companyName || 'Company',
        status: a.status,
        appliedAt: a.createdAt
      }));

    return {
      totalApplicationsSubmitted: applications.length,
      awaitingReview: statusCounts.applied,
      underReview: statusCounts.under_review,
      shortlisted: statusCounts.shortlisted,
      interviewStage: statusCounts.interview,
      offersReceived: statusCounts.offered,
      closedOrRejected: statusCounts.rejected + statusCounts.withdrawn,
      savedJobsCount: savedJobs.length,
      upcomingInterviewsCount: upcomingInterviews,
      recentActivity,
      statusDistribution: statusCounts
    };
  }
}

const analyticsService = new AnalyticsService();
module.exports = analyticsService;
