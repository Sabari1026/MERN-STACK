import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AccountMenuDropdown({ isOpen, onClose }) {
  const { user, profile, role, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    onClose();
    await logout();
    toast.info('You have been signed out.');
    navigate('/');
  };

  const getRoleLabel = () => {
    if (role === 'admin') return 'Administrator';
    if (role === 'recruiter') return 'Recruiter';
    return 'Candidate';
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '280px',
        backgroundColor: 'var(--bg-modal)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: '16px',
        zIndex: 100001,
        animation: 'slideUp 200ms ease',
        boxSizing: 'border-box'
      }}
    >
      {/* User Info Header */}
      <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
        <div style={{ fontWeight: 500, fontSize: '16px', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
          {user.name}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', wordBreak: 'break-all' }}>
          {user.email}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className={`badge ${role === 'admin' ? 'badge-amber' : role === 'recruiter' ? 'badge-mint' : 'badge-purple'}`}>
            {getRoleLabel()}
          </span>
          {role === 'candidate' && profile?.completeness !== undefined && (
            <span className="badge badge-gray" title="Profile completeness">
              {profile.completeness}% Complete
            </span>
          )}
        </div>
      </div>

      {/* Role-Specific Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
        {role === 'candidate' && (
          <>
            <Link
              to="/profile"
              onClick={onClose}
              style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              My Profile & Resume
            </Link>
            <Link
              to="/talent-match"
              onClick={onClose}
              style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Talent Match Recommendations
            </Link>
            <Link
              to="/schedule"
              onClick={onClose}
              style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Scheduled Interviews
            </Link>
          </>
        )}

        {role === 'recruiter' && (
          <>
            <Link
              to="/recruiter"
              onClick={onClose}
              style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Recruiter Dashboard & Jobs
            </Link>
            <Link
              to="/talent-match"
              onClick={onClose}
              style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Find Candidate Matches
            </Link>
            <Link
              to="/schedule"
              onClick={onClose}
              style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Manage Availability & Slots
            </Link>
          </>
        )}

        {role === 'admin' && (
          <Link
            to="/admin"
            onClick={onClose}
            style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--color-warning)', display: 'block', fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Platform Administration
          </Link>
        )}

        <Link
          to="/settings"
          onClick={onClose}
          style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--text-secondary)', display: 'block' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Account Settings
        </Link>
      </div>

      {/* Logout Action */}
      <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '8px 10px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            color: 'var(--color-danger)',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
