import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

export function SignInPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();

  const [role, setRole] = useState(searchParams.get('role') || 'candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await login(email.trim(), password, role, rememberMe);
      toast.success('Signed in successfully!');

      const userRole = res.role || role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email, password, or role selection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await authService.forgotPassword(forgotEmail.trim());
      toast.success('Password reset instructions delivered to your email!');
      setIsForgotModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Could not send reset link.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="page-container">
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ width: '100%', maxWidth: '440px', padding: '0 16px', boxSizing: 'border-box' }}>
          {/* Card */}
          <div className="surface-card" style={{ padding: '36px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div className="caption" style={{ color: 'var(--color-accent-purple-light)', marginBottom: '8px' }}>
                HireConnect Portal
              </div>
              <h1 className="h3" style={{ marginBottom: '8px' }}>
                Sign In to Account
              </h1>
              <p className="body-small" style={{ margin: 0 }}>
                Access your profile, job pipeline, or platform management.
              </p>
            </div>

            {/* Role Switcher */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '4px',
                backgroundColor: 'var(--bg-elevated)',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '24px'
              }}
            >
              <button
                type="button"
                onClick={() => setRole('candidate')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: role === 'candidate' ? 'var(--bg-surface)' : 'transparent',
                  color: role === 'candidate' ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontFamily: 'Saans Mono, monospace',
                  cursor: 'pointer',
                  fontWeight: role === 'candidate' ? 600 : 400
                }}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: role === 'recruiter' ? 'var(--bg-surface)' : 'transparent',
                  color: role === 'recruiter' ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontFamily: 'Saans Mono, monospace',
                  cursor: 'pointer',
                  fontWeight: role === 'recruiter' ? 600 : 400
                }}
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: role === 'admin' ? 'var(--bg-surface)' : 'transparent',
                  color: role === 'admin' ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontFamily: 'Saans Mono, monospace',
                  cursor: 'pointer',
                  fontWeight: role === 'admin' ? 600 : 400
                }}
              >
                Admin
              </button>
            </div>

            {errorMsg && (
              <div className="alert alert-error" style={{ fontSize: '14px', marginBottom: '20px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div className="form-label">
                  <span>Password</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setIsForgotModalOpen(true);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-accent-purple-light)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="rememberMe" style={{ fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Remember this device for 7 days
                </label>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginBottom: '20px' }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
              Don't have an account yet?{' '}
              <Link to={`/signup?role=${role === 'admin' ? 'candidate' : role}`} style={{ color: 'var(--color-accent-purple-light)', textDecoration: 'underline' }}>
                Create one now
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="modal-overlay" onClick={() => setIsForgotModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div className="h4">Reset Your Password</div>
              <button className="modal-close-btn" onClick={() => setIsForgotModalOpen(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleForgotPassword}>
              <div className="modal-body">
                <p className="body-small" style={{ marginBottom: '16px' }}>
                  Enter your registered account email. If the account exists, we will deliver a secure single-use recovery link via Resend SMTP.
                </p>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsForgotModalOpen(false)}>
                  <span>Cancel</span>
                </button>
                <button type="submit" className="btn-primary" disabled={forgotLoading}>
                  {forgotLoading ? <span>Sending...</span> : <span>Send Recovery Link</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
