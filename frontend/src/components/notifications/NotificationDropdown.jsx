import React, { useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';

export function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
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

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '360px',
        maxHeight: '480px',
        backgroundColor: 'var(--bg-modal)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 100001,
        animation: 'slideUp 200ms ease',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ fontWeight: 500, fontSize: '15px', color: 'var(--text-primary)' }}>
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-accent-purple-light)',
              fontSize: '12px',
              fontFamily: 'Saans Mono, monospace',
              cursor: 'pointer'
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '28px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            No notifications yet
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id || item.id}
              onClick={() => markAsRead(item._id || item.id)}
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: item.isRead ? 'transparent' : 'rgba(137, 66, 228, 0.05)',
                cursor: 'pointer',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                transition: 'background var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = item.isRead ? 'transparent' : 'rgba(137, 66, 228, 0.05)')
              }
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: item.isRead ? 400 : 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {item.message}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification(item._id || item.id);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '0 4px',
                  lineHeight: 1
                }}
                title="Dismiss"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
