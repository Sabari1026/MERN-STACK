import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/interviewService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

export function InterviewBookingModal({ recruiter, isOpen, onClose, onSuccess }) {
  const { user, isAuthenticated, role } = useAuth();
  const { toast } = useToast();

  const [availableHosts, setAvailableHosts] = useState([]);
  const [selectedHostId, setSelectedHostId] = useState(
    recruiter?._id || recruiter?.id || recruiter?.userId || ''
  );

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
  const [timeZone, setTimeZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata');
  const [booking, setBooking] = useState(false);
  const [confirmedMeeting, setConfirmedMeeting] = useState(null);

  // Load available hosts if none was pre-selected
  useEffect(() => {
    if (isOpen && !recruiter) {
      async function loadHosts() {
        try {
          const res = await interviewService.getAvailableHosts();
          const list = res?.data?.hosts || res?.hosts || [];
          setAvailableHosts(list);
          if (list.length > 0 && !selectedHostId) {
            setSelectedHostId(list[0]._id || list[0].id);
          }
        } catch (err) {
          // ignore
        }
      }
      loadHosts();
    } else if (recruiter) {
      setSelectedHostId(recruiter._id || recruiter.id || recruiter.userId || '');
    }
  }, [isOpen, recruiter]);

  // Load available slots
  useEffect(() => {
    async function loadSlots() {
      if (!selectedDate) return;
      setLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const hostId = selectedHostId || recruiter?._id || recruiter?.id || 'default';
        const res = await interviewService.getAvailableSlots(hostId, selectedDate);
        
        // 1. Prefer detailed slots with ISO timestamps
        const detailed = res?.data?.detailedSlots || res?.detailedSlots;
        if (Array.isArray(detailed) && detailed.length > 0) {
          setAvailableSlots(detailed);
        } else {
          // 2. Fall back to string slots
          const rawSlots = res?.data?.slots || res?.slots || [];
          const normalized = rawSlots.map((s, idx) => {
            if (typeof s === 'object' && s !== null) return s;
            return {
              timeSlot: s,
              startAt: s,
              date: selectedDate
            };
          });
          setAvailableSlots(normalized);
        }
      } catch (err) {
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    if (isOpen) {
      loadSlots();
    }
  }, [isOpen, selectedHostId, selectedDate]);

  if (!isOpen) return null;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error('Please select an available time slot.');
      return;
    }

    setBooking(true);
    try {
      const activeHost = selectedHostId || recruiter?._id || recruiter?.id;
      const res = await interviewService.bookInterview({
        recruiterId: activeHost || undefined,
        startAt: selectedSlot.startAt || selectedSlot.startTime,
        startTime: selectedSlot.startTime || selectedSlot.startAt,
        endAt: selectedSlot.endAt || selectedSlot.endTime,
        endTime: selectedSlot.endTime || selectedSlot.endAt,
        date: selectedSlot.date || selectedDate,
        timeSlot: selectedSlot.timeSlot,
        title: meetingTitle.trim() || 'Technical Interview',
        description: meetingDescription.trim(),
        timezone: timeZone,
        timeZone
      });

      const meeting = res?.data?.meeting || res?.meeting || res?.data || res;
      setConfirmedMeeting(meeting);
      toast.success('Interview scheduled successfully!');
      if (onSuccess) onSuccess(meeting);
    } catch (err) {
      toast.error(err.message || 'Failed to schedule interview. The slot may have been taken.');
    } finally {
      setBooking(false);
    }
  };

  const activeHostName =
    recruiter?.name ||
    availableHosts.find((h) => (h._id || h.id) === selectedHostId)?.name ||
    'Senior Technical Recruiter';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="caption" style={{ color: 'var(--color-accent-mint)', marginBottom: '4px' }}>
              Interview Scheduler
            </div>
            <div className="h4" style={{ color: 'var(--text-primary)' }}>
              Schedule Session with {activeHostName}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p className="body-text" style={{ marginBottom: '24px' }}>
              Please sign in to book and manage interview sessions.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/signin" className="btn-primary" onClick={onClose}>
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        ) : confirmedMeeting ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                color: 'var(--color-accent-mint)',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              ✓
            </div>
            <div className="h3" style={{ marginBottom: '8px' }}>
              Interview Confirmed!
            </div>
            <div className="badge badge-purple" style={{ marginBottom: '20px' }}>
              Reference: {confirmedMeeting.reference || confirmedMeeting.meetingReference || confirmedMeeting._id || 'CONFIRMED'}
            </div>
            <p className="body-text" style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your session has been confirmed. Confirmation details and calendar invites have been dispatched. You can review or manage this session anytime in your schedule hub.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setConfirmedMeeting(null);
                onClose();
              }}
            >
              <span>Done</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleBook}>
            <div className="modal-body">
              {/* Host Selector (if multiple available and none fixed) */}
              {!recruiter && availableHosts.length > 1 && (
                <div className="form-group">
                  <label className="form-label">Select Interview Host</label>
                  <select
                    value={selectedHostId}
                    onChange={(e) => setSelectedHostId(e.target.value)}
                  >
                    {availableHosts.map((h) => (
                      <option key={h._id || h.id} value={h._id || h.id}>
                        {h.name} ({h.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  Available Slots{' '}
                  {loadingSlots && <span style={{ color: 'var(--text-muted)' }}>(Checking availability...)</span>}
                </label>

                {loadingSlots ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <span className="spinner" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-muted)',
                      fontSize: '14px'
                    }}
                  >
                    No open interview slots available on this date. Please try another day.
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                      gap: '8px',
                      maxHeight: '180px',
                      overflowY: 'auto'
                    }}
                  >
                    {availableSlots.map((slot, idx) => {
                      const isSelected =
                        selectedSlot &&
                        (selectedSlot.startAt === slot.startAt ||
                          selectedSlot.timeSlot === slot.timeSlot);

                      let label = slot.timeSlot;
                      if (!label && (slot.startTime || slot.startAt)) {
                        const d = new Date(slot.startTime || slot.startAt);
                        if (!isNaN(d.getTime())) {
                          label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        }
                      }
                      if (!label) label = `Slot ${idx + 1}`;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            padding: '10px 8px',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${isSelected ? 'var(--color-accent-mint)' : 'var(--border-subtle)'}`,
                            backgroundColor: isSelected ? 'rgba(52, 211, 153, 0.15)' : 'var(--bg-elevated)',
                            color: isSelected ? 'var(--color-accent-mint)' : 'var(--text-primary)',
                            fontFamily: 'Saans Mono, monospace',
                            fontSize: '13px',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {label}
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
