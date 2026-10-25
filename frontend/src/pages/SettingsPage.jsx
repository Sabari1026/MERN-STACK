import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';
import { useNavigate, Link } from 'react-router-dom';

export function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification Preferences
  const [emailOnApplication, setEmailOnApplication] = useState(true);
  const [emailOnInterview, setEmailOnInterview] = useState(true);
  const [emailOnMatch, setEmailOnMatch] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Delete Account
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function loadPrefs() {
      try {
        const res = await notificationService.getPreferences();
        const prefs = res?.data || res;
        if (prefs.emailOnApplication !== undefined) setEmailOnApplication(prefs.emailOnApplication);
        if (prefs.emailOnInterview !== undefined) setEmailOnInterview(prefs.emailOnInterview);
        if (prefs.emailOnMatch !== undefined) setEmailOnMatch(prefs.emailOnMatch);
      } catch (err) {
        // ignore
      }
    }
    loadPrefs();
  }, [isAuthenticated]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password. Verify your current password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    try {
      await notificationService.updatePreferences({
        emailOnApplication,
        emailOnInterview,
        emailOnMatch
      });
      toast.success('Notification preferences updated successfully!');
    } catch (err) {
      toast.error('Failed to update notification preferences.');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleting(true);
    try {
      await authService.deleteAccount(deletePassword);
      toast.info('Account deleted. We are sorry to see you go.');
      await logout();
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to delete account. Password may be incorrect.');
    } finally {
      setDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <main className="main-content" style={{ textAlign: 'center', padding: '120px 20px' }}>
          <div className="surface-card" style={{ maxWidth: '440px', margin: '0 auto', padding: '40px' }}>
            <h2 className="h3" style={{ marginBottom: '16px' }}>Sign In Required</h2>
            <p className="body-text" style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Please sign in to access your security and notification settings.
            </p>
            <Link to="/signin" className="btn-primary">
              <span>Sign In</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container-narrow">
          <div style={{ marginBottom: '36px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-purple-light)', display: 'block', marginBottom: '8px' }}>
              Security & Notifications
            </span>
            <h1 className="h1" style={{ marginBottom: '8px' }}>
              Account Settings
            </h1>
            <p className="body-text">
              Manage your credentials, delivery preferences, and security privacy controls.
            </p>
          </div>

          {/* Change Password Card */}
          <div className="surface-card" style={{ padding: '32px', marginBottom: '32px' }}>
            <h3 className="h3" style={{ marginBottom: '20px' }}>Change Account Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={changingPassword}>
                {changingPassword ? <span>Updating...</span> : <span>Update Password</span>}
              </button>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="surface-card" style={{ padding: '32px', marginBottom: '32px' }}>
            <h3 className="h3" style={{ marginBottom: '20px' }}>Email & In-App Notification Preferences</h3>
            <form onSubmit={handleSavePreferences}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emailOnApplication}
                    onChange={(e) => setEmailOnApplication(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '15px' }}>Application Status Updates</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Receive email alerts whenever an application status progresses or receives recruiter review.
                    </div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emailOnInterview}
                    onChange={(e) => setEmailOnInterview(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '15px' }}>Interview Bookings & Reminders</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Receive 24h and 1h email calendar reminders via Resend SMTP for scheduled interviews.
                    </div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emailOnMatch}
                    onChange={(e) => setEmailOnMatch(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '15px' }}>Talent Match Recommendations</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Receive notifications when high-precision role matches align with your technical skillset.
                    </div>
                  </div>
                </label>
              </div>

              <button type="submit" className="btn-primary" disabled={savingPrefs}>
                {savingPrefs ? <span>Saving...</span> : <span>Save Preferences</span>}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="surface-card" style={{ padding: '32px', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <h3 className="h3" style={{ color: 'var(--color-danger)', marginBottom: '12px' }}>Danger Zone</h3>
            <p className="body-text" style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Permanently delete your user profile, resume documents, and all active recruitment application history. This action cannot be reversed.
            </p>
            <button type="button" className="btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div className="h4" style={{ color: 'var(--color-danger)' }}>Confirm Account Deletion</div>
              <button className="modal-close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleDeleteAccount}>
              <div className="modal-body">
                <p className="body-small" style={{ marginBottom: '16px' }}>
                  To verify your identity and confirm deletion, enter your current account password:
                </p>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  <span>Cancel</span>
                </button>
                <button type="submit" className="btn-danger" disabled={deleting}>
                  {deleting ? <span>Deleting...</span> : <span>Permanently Delete</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
