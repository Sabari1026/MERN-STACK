import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const { toast } = useToast();

  const [role, setRole] = useState(searchParams.get('role') === 'recruiter' ? 'recruiter' : 'candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role
      };

      if (role === 'candidate' && headline.trim()) {
        payload.headline = headline.trim();
      }

      if (role === 'recruiter') {
        if (!companyName.trim()) {
          setErrorMsg('Company name is required for recruiter registration.');
          setSubmitting(false);
          return;
        }
        payload.companyName = companyName.trim();
        if (companyWebsite.trim()) {
          payload.companyWebsite = companyWebsite.trim();
        }
      }

      await register(payload);
      toast.success('Account created successfully! Welcome to HireConnect.');

      if (role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: '480px', boxSizing: 'border-box' }}>
          <div className="surface-card" style={{ padding: '36px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div className="caption" style={{ color: 'var(--color-accent-mint)', marginBottom: '8px' }}>
                Join HireConnect
              </div>
              <h1 className="h3" style={{ marginBottom: '8px' }}>
                Create Your Account
              </h1>
              <p className="body-small" style={{ margin: 0 }}>
                {role === 'recruiter'
                  ? 'Publish tech roles and discover pre-screened engineering talent.'
                  : 'Get discovered by modern teams with verified profiles and smart matching.'}
              </p>
            </div>

            {/* Role Switcher */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
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
                  padding: '10px',
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
                I am a Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                style={{
                  padding: '10px',
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
                I am a Recruiter / Company
              </button>
            </div>

            {errorMsg && (
              <div className="alert alert-error" style={{ fontSize: '14px', marginBottom: '20px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Work or Personal Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="form-hint">Must contain at least 8 characters with a number or symbol.</div>
              </div>

              {role === 'candidate' && (
                <div className="form-group">
                  <label className="form-label">
                    Professional Headline <span style={{ color: 'var(--text-muted)' }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Full-Stack Engineer | Node & React"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>
              )}

              {role === 'recruiter' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Beatport, PushPress, Razorpay"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Company Website <span style={{ color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourcompany.com"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: '8px', marginBottom: '20px' }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
              Already registered?{' '}
              <Link to={`/signin?role=${role}`} style={{ color: 'var(--color-accent-purple-light)', textDecoration: 'underline' }}>
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
