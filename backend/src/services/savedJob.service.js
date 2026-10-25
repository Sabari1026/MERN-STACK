/**
 * Saved Jobs Service for HireConnect
 * Manages candidate bookmarks, unique compound state, and active listing availability.
 */

const SavedJob = require('../models/savedJob.model');
const Job = require('../models/job.model');
const ApiError = require('../utils/ApiError');

class SavedJobService {
  /**
   * Save / bookmark a job for the authenticated candidate.
   */
  async saveJob(jobId, candidateUser) {
    if (!jobId) throw ApiError.badRequest('Job ID is required.');
    const candidateId = candidateUser._id || candidateUser.id;

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      throw ApiError.notFound('Job listing not found.');
    }

    if (job.status !== 'published') {
      throw ApiError.badRequest('Cannot save an inactive or unpublished job listing.');
    }

    // Check if already saved (idempotent)
    const existing = await SavedJob.findOne({ candidate: candidateId, job: job._id || job.id });
    if (existing) {
      return {
        success: true,
        isSaved: true,
        savedAt: existing.savedAt,
        message: 'Job is already saved in your bookmarks'
      };
    }

    const saved = await SavedJob.create({
      candidate: candidateId,
      job: job._id || job.id,
      savedAt: new Date()
    });

    return {
      success: true,
      isSaved: true,
      savedAt: saved.savedAt,
      message: 'Job saved successfully'
    };
  }

  /**
   * Remove / unbookmark a job for the authenticated candidate.
   */
  async unsaveJob(jobId, candidateUser) {
    if (!jobId) throw ApiError.badRequest('Job ID is required.');
    const candidateId = candidateUser._id || candidateUser.id;

    const job = await Job.findById(jobId);
    const targetJobId = job ? (job._id || job.id) : jobId;

    await SavedJob.deleteOne({ candidate: candidateId, job: targetJobId });

    return {
      success: true,
      isSaved: false,
      message: 'Job removed from saved jobs'
    };
  }

  /**
   * Retrieve all saved jobs for current candidate.
   */
  async getSavedJobs(candidateUser, options = {}) {
    const candidateId = candidateUser._id || candidateUser.id;
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(options.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const total = await SavedJob.countDocuments({ candidate: candidateId });
    const records = await SavedJob.find({ candidate: candidateId })
      .sort({ savedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('job');

    const savedJobs = records.map((rec) => {
      const jobDoc = rec.job;
      const isPublished = jobDoc && jobDoc.status === 'published';
      return {
        id: rec._id ? rec._id.toString() : rec.id,
        savedAt: rec.savedAt,
        jobId: jobDoc ? (jobDoc._id ? jobDoc._id.toString() : jobDoc.id) : rec.job,
        job: jobDoc ? {
          id: jobDoc._id ? jobDoc._id.toString() : jobDoc.id,
          title: jobDoc.title,
          slug: jobDoc.slug,
          company: jobDoc.companyName || (jobDoc.company?.name || 'Company'),
          companyLogo: jobDoc.companyLogo || (jobDoc.company?.logoUrl || null),
          location: jobDoc.location,
          workMode: jobDoc.workMode,
          employmentType: jobDoc.employmentType,
          salary: jobDoc.salary,
          category: jobDoc.category,
          status: jobDoc.status,
          isClosed: !isPublished,
          canApply: isPublished && jobDoc.applicationMethod !== 'external',
          applyUrl: jobDoc.applyUrl || jobDoc.externalApplicationUrl
        } : null
      };
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      savedJobs,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Check if a job is saved by the candidate.
   */
  async isJobSaved(jobId, candidateUser) {
    if (!candidateUser || !jobId) return false;
    const candidateId = candidateUser._id || candidateUser.id;
    const count = await SavedJob.countDocuments({ candidate: candidateId, job: jobId });
    return count > 0;
  }
}

module.exports = new SavedJobService();
