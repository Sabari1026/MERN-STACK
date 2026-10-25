import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

export function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Hiring Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Your message has been received! Our support team will get back to you shortly.');
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container-narrow">
          <div style={{ marginBottom: '40px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-mint)', display: 'block', marginBottom: '8px' }}>
              We Are Here to Help
            </span>
            <h1 className="h1" style={{ marginBottom: '16px' }}>
              Contact HireConnect
            </h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Share your hiring requirements or career goals, and we will connect you with verified talent or top opportunities in days.
            </p>
          </div>

          <div className="grid-12">
            <div className="col-7">
              <div className="surface-card" style={{ padding: '36px' }}>
                <h3 className="h3" style={{ marginBottom: '20px' }}>Send Us a Message</h3>

                {submitted ? (
                  <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'var(--color-accent-mint-bg)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
                    <div className="h4" style={{ color: 'var(--color-accent-mint)', marginBottom: '8px' }}>Message Sent!</div>
                    <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                      Thank you for reaching out. A HireConnect recruitment advisor will respond within 24 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Rivera"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

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
                      <label className="form-label">Subject</label>
                      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                        <option value="Hiring Inquiry">Hiring Inquiry / Enterprise Recruitment</option>
                        <option value="Candidate Support">Candidate Support & Profile</option>
                        <option value="Partnership">Partnership & Integration</option>
                        <option value="Other">General Feedback</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">How can we assist you?</label>
                      <textarea
                        rows={4}
                        placeholder="Provide details about your recruitment goals or questions..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                      <span>Send Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="col-5">
              <div className="surface-card" style={{ padding: '36px', height: '100%', boxSizing: 'border-box' }}>
                <h3 className="h3" style={{ marginBottom: '24px' }}>Direct Coordinates</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <div className="caption" style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Email Inquiries</div>
                    <a href="mailto:contact@hireconnect.io" style={{ fontSize: '16px', color: 'var(--color-accent-purple-light)' }}>
                      contact@hireconnect.io
                    </a>
                  </div>

                  <div>
                    <div className="caption" style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Operating Headquarters</div>
                    <div style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                      HireConnect Technologies LLC<br />
                      Chennai & San Francisco
                    </div>
                  </div>

                  <div>
                    <div className="caption" style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Response Timeline</div>
                    <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                      Under 24 hours for verified candidates and employers.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
