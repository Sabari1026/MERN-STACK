import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/interviewService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

export function InterviewBookingModal({ recruiter, isOpen, onClose, onSuccess }) {
  const { user, isAuthenticated, role } = useAuth();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState('Technical Interview & Discussion');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [timeZone, setTimeZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [booking, setBooking] = useState(false);
  const [confirmedMeeting, setConfirmedMeeting] = useState(null);

  const recruiterId = recruiter?._id || recruiter?.id || recruiter?.userId;

  useEffect(() => {
    async function loadSlots() {
      if (!recruiterId || !selectedDate) return;
      setLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const res = await interviewService.getAvailableSlots(recruiterId, selectedDate);
        const slots = res?.data?.slots || res?.slots || [];
        setAvailableSlots(slots);
      } catch (err) {
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    if (isOpen && recruiterId) {
      loadSlots();
    }
  }, [isOpen, recruiterId, selectedDate]);

  if (!isOpen) return null;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error('Please select an available time slot.');
      return;
    }

    setBooking(true);
    try {
      const res = await interviewService.bookInterview({
        recruiterId,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        title: meetingTitle,
        description: meetingDescription,
        timeZone
      });

      const meeting = res?.data?.meeting || res?.meeting || res?.data;
      setConfirmedMeeting(meeting);
      toast.success('Interview scheduled successfully!');
      if (onSuccess) onSuccess(meeting);
    } catch (err) {
      toast.error(err.message || 'Failed to schedule interview. The slot may have been taken.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="caption" style={{ color: 'var(--color-accent-mint)', marginBottom: '4px' }}>
              Interview Scheduler
            </div>
            <div className="h4" style={{ color: 'var(--text-primary)' }}>
              Schedule Session with {recruiter?.name || 'Recruiter'}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '40rem 20rem' }}>
            <p className="body-text" style={{ marginBottom: '24rem' }}>
              Please sign in as a candidate to book and manage interview sessions.
            </p>
            <div style={{ display: 'flex', gap: '12rem', justifyContent: 'center' }}>
              <Link to="/signin" className="btn-primary" onClick={onClose}>
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        ) : confirmedMeeting ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '32rem 24rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-mint-bg)',
                color: 'var(--color-accent-mint)',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16rem auto'
              }}
            >
              ✓
            </div>
            <div className="h3" style={{ marginBottom: '8px' }}>
              Interview Confirmed!
            </div>
            <div className="badge badge-purple" style={{ marginBottom: '20rem' }}>
              Reference: {confirmedMeeting.meetingReference || confirmedMeeting.reference || confirmedMeeting._id}
            </div>
            <p className="body-text" style={{ color: 'var(--text-secondary)', marginBottom: '24rem' }}>
              Your session has been recorded and an email notification has been delivered. You can review or reschedule this meeting anytime in your schedule hub.
            </p>
            <button type="button" className="btn-primary" onClick={onClose}>
              <span>Done</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleBook}>
            <div className="modal-body">
              {/* Date selection */}
              <div className="form-group">
                <label className="form-label">Select Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              {/* Time Slots */}
              <div className="form-group">
                <label className="form-label">
                  Available Slots
                  {loadingSlots && <span style={{ color: 'var(--text-muted)' }}>(Checking availability...)</span>}
                </label>

                {loadingSlots ? (
                  <div style={{ padding: '24rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <span className="spinner" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div
                    style={{
                      padding: '20rem',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-muted)',
                      fontSize: '14rem'
                    }}
                  >
                    No open interview slots available on this date. Please try another day.
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                      gap: '8rem',
                      maxHeight: '180px',
                      overflowY: 'auto'
                    }}
                  >
                    {availableSlots.map((slot, idx) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;
                      const timeLabel = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            padding: '10px',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${isSelected ? 'var(--color-accent-purple)' : 'var(--border-subtle)'}`,
                            backgroundColor: isSelected ? 'var(--color-accent-purple-bg)' : 'var(--bg-elevated)',
                            color: isSelected ? 'var(--color-accent-purple-light)' : 'var(--text-primary)',
                            fontFamily: 'Saans Mono, monospace',
                            fontSize: '13rem',
                            cursor: 'pointer'
                          }}
                        >
                          {timeLabel}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Meeting Title */}
              <div className="form-group">
                <label className="form-label">Subject / Purpose</label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  required
                />
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">
                  Discussion Notes <span style={{ color: 'var(--text-muted)' }}>(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Any particular topics, portfolio items, or questions you wish to cover..."
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={booking}>
                <span>Cancel</span>
              </button>
              <button type="submit" className="btn-primary" disabled={booking || !selectedSlot}>
                {booking ? (
                  <>
                    <span className="spinner" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <span>Confirm Booking</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
