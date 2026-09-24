import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          background: '#f8fafc',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💔</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '480px', marginBottom: '24px' }}>
            The application encountered an unexpected error. This is usually caused by the backend
            API being unreachable. Check your <code>VITE_API_URL</code> environment variable in
            the Vercel dashboard.
          </p>
          <p style={{
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: '#dc2626',
            background: '#fee2e2',
            padding: '10px 16px',
            borderRadius: '8px',
            maxWidth: '560px',
            wordBreak: 'break-word',
            marginBottom: '24px'
          }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            style={{
              padding: '10px 24px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
