import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { AccountMenuDropdown } from '../navigation/AccountMenuDropdown';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

export function Navbar() {
  const { user, profile, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { label: 'Find Jobs', path: '/jobs' },
    { label: 'Companies', path: '/companies' },
    { label: 'Talent Match', path: '/talent-match' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'About', path: '/about' },
    { label: 'Cases', path: '/cases' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' }
  ];

  const avatarUrl = user?.avatarUrl || profile?.avatarUrl;

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          width: 'calc(100% - var(--margin) * 2)',
          maxWidth: '1240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px 8px 20px',
          backgroundColor: 'rgba(36, 36, 36, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxSizing: 'border-box',
          transition: 'width 0.4s ease'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-primary)',
            height: '24px',
            textDecoration: 'none'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 24" style={{ height: '22px', fill: 'currentColor' }}>
            <path d="M13.538 6.857H11c-1.468 0-2.538-1.213-2.538-2.572V2.572C8.462 1.128 7.332 0 5.924 0H2.54A2.55 2.55 0 0 0 0 2.571V6c0 1.395 1.078 2.571 2.56 2.571s2.516 1.247 2.516 2.589v4.268c0 6.857 1.692 8.57 8.462 8.57s8.46-1.714 8.46-8.527c0-6.814-1.692-8.616-8.46-8.616z" />
            <text x="32" y="17.5" fontFamily="'Saans', sans-serif" fontWeight="600" fontSize="15" fill="currentColor" letterSpacing="-0.02em">
              HireConnect
            </text>
          </svg>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hide-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontFamily: 'Saans Mono, monospace',
            fontSize: '14px'
          }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? 'var(--text-primary)' : 'var(--text-secondary)')}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions / Account Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          {isAuthenticated ? (
            <>
              {/* Notification Bell Button */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsAccountOpen(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isNotifOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                  title="Notifications"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        backgroundColor: 'var(--color-accent-purple)',
                        color: '#fff',
                        fontSize: '10px',
                        fontFamily: 'Saans Mono, monospace',
                        fontWeight: 600,
                        height: '16px',
                        minWidth: '16px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 4px',
                        lineHeight: 1
                      }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
              </div>

              {/* Floating User Avatar Button */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountOpen(!isAccountOpen);
                    setIsNotifOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 10px 4px 4px',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontFamily: 'Saans Mono, monospace',
                    fontSize: '13px'
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent-purple)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '11px'
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span className="hide-mobile" style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                <AccountMenuDropdown isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
              </div>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="hide-mobile"
                style={{
                  fontFamily: 'Saans Mono, monospace',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  padding: '8px 12px'
                }}
              >
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary btn-sm">
                <span>Get Started</span>
              </Link>
            </>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            className="hide-desktop"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px',
              fontFamily: 'Saans Mono, monospace',
              fontSize: '14px'
            }}
          >
            {isMobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Mobile Menu Fullscreen Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(27, 27, 27, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 99998,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 24px',
            animation: 'fadeIn 200ms ease'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '24px', fontWeight: 500 }}>
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ fontSize: '24px', fontWeight: 500, color: location.pathname === link.path ? 'var(--color-accent-purple-light)' : 'var(--text-primary)' }}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <>
                <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary" style={{ margin: '0 auto', marginTop: '10px' }}>
                  <span>Get Started</span>
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAccountOpen(true);
                }}
                className="btn-secondary"
                style={{ margin: '0 auto' }}
              >
                View Account Menu
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
