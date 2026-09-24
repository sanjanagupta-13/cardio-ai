import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = "Loading clinical intelligence data..." }) {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
      <Loader2
        size={36}
        style={{
          margin: '0 auto 16px auto',
          color: 'var(--medical-blue)',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
