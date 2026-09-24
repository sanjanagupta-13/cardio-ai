import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = "No data available",
  description = "No records were found matching your current query.",
  icon: Icon = Inbox,
  actionLabel,
  onAction
}) {
  return (
    <div style={{
      padding: '48px 24px',
      textAlign: 'center',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '14px',
      border: '1px dashed var(--border-subtle)'
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: 'var(--bg-card-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px auto',
        color: 'var(--text-muted)'
      }}>
        <Icon size={28} />
      </div>
      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 20px auto' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
