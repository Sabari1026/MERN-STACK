import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { interviewService } from '../services/interviewService';
import { InterviewBookingModal } from '../components/interviews/InterviewBookingModal';
import { Link } from 'react-router-dom';

export function InterviewSchedulerPage() {
  const { user, isAuthenticated, role } = useAuth();
  const { toast } = useToast();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Recruiter Availability State
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' }
  });
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata');
  const [slotDuration, setSlotDuration] = useState(30);
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Load Meetings
  const loadMeetings = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await interviewService.getMyInterviews();
      const list = res?.data?.meetings || res?.meetings || res?.data || [];
      setMeetings(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error('Unable to load interview sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();

    // If recruiter, load current availability
    if (isAuthenticated && role === 'recruiter') {
      async function loadAvailability() {
        try {
          const res = await interviewService.getRecruiterAvailability();
          const data = res?.data?.availability || res?.availability || res?.data || res;
          if (data.weeklySchedule) setWeeklySchedule(data.weeklySchedule);
          if (data.timeZone || data.timezone) setTimezone(data.timeZone || data.timezone);
          if (data.slotDurationMinutes) setSlotDuration(data.slotDurationMinutes);
        } catch (err) {
          // ignore
        }
      }
      loadAvailability();
    }
  }, [isAuthenticated, role]);

  const handleCancelMeeting = async (meetingId) => {
    const reason = window.prompt('Please provide a cancellation reason (optional):');
    if (reason === null) return;

    try {
      await interviewService.cancelInterview(meetingId, reason);
      toast.info('Interview cancelled.');
      loadMeetings();
    } catch (err) {
      toast.error(err.message || 'Could not cancel interview.');
    }
  };

  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    setSavingSchedule(true);
    try {
      // Format weeklyRules if needed
      const weeklyRules = Object.entries(weeklySchedule)
        .filter(([_, val]) => val && val.enabled !== false)
        .map(([day, val]) => ({
          weekday: day.toLowerCase(),
          startTime: val.start || '09:00',
          endTime: val.end || '17:00'
        }));

      await interviewService.updateRecruiterAvailability({
        weeklyRules: weeklyRules.length > 0 ? weeklyRules : undefined,
        timeZone: timezone,
        timezone,
        slotDurationMinutes: Number(slotDuration)
      });
      toast.success('Recruiter availability schedule updated!');
    } catch (err) {
      toast.error('Failed to update availability.');
    } finally {
      setSavingSchedule(false);
    }
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container">
          <div style={{ marginBottom: '36px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-mint)', display: 'block', marginBottom: '8px' }}>
              Real-Time Calendar Workflows
            </span>
            <h1 className="h1" style={{ marginBottom: '12px' }}>
              Interview Scheduling
            </h1>
            <p className="body-text">
              Direct booking, atomic double-booking protection, and timezone coordination.
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="surface-card" style={{ padding: '48px', textAlign: 'center' }}>
              <h3 className="h3" style={{ marginBottom: '16px' }}>Sign in to View Scheduled Sessions</h3>
              <p className="body-text" style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                Manage your technical interview bookings and configure booking slots.
              </p>
              <Link to="/signin" className="btn-primary">
                <span>Sign In</span>
              </Link>
            </div>
          ) : (
            <div className="grid-12">
              {/* Upcoming Meetings List */}
              <div className={role === 'recruiter' ? 'col-7' : 'col-12'}>
                <div className="surface-card" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 className="h3">Your Scheduled Sessions ({meetings.length})</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-primary btn-sm"
                        onClick={() => setIsBookingOpen(true)}
                      >
                        <span>+ Schedule Interview</span>
                      </button>
                      <button type="button" className="btn-secondary btn-sm" onClick={loadMeetings}>
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <span className="spinner" />
                    </div>
                  ) : meetings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                      <p className="body-text">No active interview bookings found.</p>
                      <button
                        type="button"
                        className="btn-primary btn-sm"
                        style={{ marginTop: '16px' }}
                        onClick={() => setIsBookingOpen(true)}
                      >
                        <span>Book an Interview Now</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {meetings.map((m) => {
                        const start = new Date(m.startAt || m.startTime);
                        const end = new Date(m.endAt || m.endTime);
                        const isValidDate = !isNaN(start.getTime());
                        const dateStr = isValidDate
                          ? start.toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Scheduled Date';
                        const timeStr = isValidDate
                          ? `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : 'TBD';

                        const otherParty =
                          role === 'recruiter'
                            ? m.candidate?.name || 'Candidate'
                            : m.recruiter?.name || 'Technical Recruiter';

                        return (
                          <div
                            key={m._id || m.id}
                            style={{
                              padding: '20px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '16px'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                                <span
                                  className={`badge ${
                                    m.status === 'confirmed' || m.status === 'scheduled'
                                      ? 'badge-mint'
                                      : m.status === 'cancelled'
                                      ? 'badge-red'
                                      : 'badge-purple'
                                  }`}
                                >
                                  {m.status ? m.status.toUpperCase() : 'SCHEDULED'}
                                </span>
                                <span className="caption" style={{ color: 'var(--text-muted)' }}>
                                  Ref: {m.reference || m.meetingReference || m._id}
                                </span>
                              </div>
                              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                {m.title || 'Technical Interview'}
                              </div>
                              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                📅 {dateStr} • ⏰ {timeStr}
                              </div>
                              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                👤 Participant: <strong>{otherParty}</strong>
                              </div>
                              {m.meetingLink && m.status !== 'cancelled' && (
                                <div style={{ marginTop: '8px' }}>
                                  <a
                                    href={m.meetingLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-secondary btn-sm"
                                    style={{ display: 'inline-flex', fontSize: '12px' }}
                                  >
                                    <span>🎥 Join Video Room</span>
                                  </a>
                                </div>
                              )}
                            </div>

                            {m.status !== 'cancelled' && (
                              <button
                                type="button"
                                className="btn-danger btn-sm"
                                onClick={() => handleCancelMeeting(m._id || m.id)}
                              >
                                <span>Cancel Session</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Recruiter Availability Editor */}
              {role === 'recruiter' && (
                <div className="col-5">
                  <div className="surface-card" style={{ padding: '32px' }}>
                    <h3 className="h3" style={{ marginBottom: '16px' }}>Configure Booking Availability</h3>
                    <p className="body-small" style={{ marginBottom: '24px' }}>
                      Set your bookable hours so candidates can self-service interview slots without email friction.
                    </p>

                    <form onSubmit={handleSaveAvailability}>
                      <div className="form-group">
                        <label className="form-label">Timezone</label>
                        <input
                          type="text"
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Slot Duration (Minutes)</label>
                        <select value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)}>
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="45">45 minutes</option>
                          <option value="60">60 minutes</option>
                        </select>
                      </div>

                      <div style={{ marginTop: '20px' }}>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={savingSchedule}>
                          {savingSchedule ? <span>Updating...</span> : <span>Save Schedule</span>}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {isBookingOpen && (
        <InterviewBookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={() => {
            setIsBookingOpen(false);
            loadMeetings();
          }}
        />
      )}
    </div>
  );
}
