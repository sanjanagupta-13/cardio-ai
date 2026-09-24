import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border-light)',
      padding: '36px 28px 24px 28px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        {/* Brand & Description */}
        <div style={{ maxWidth: 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              backgroundColor: 'var(--cardio-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Heart size={16} fill="white" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              CardioAI
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
            Cardiovascular Risk Analysis & Machine Learning Platform. Applied machine learning models for clinical risk stratification.
          </p>
        </div>

        {/* Navigation Quick Links */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '12px' }}>
            Navigation
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: '0.875rem' }}>
            <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/prediction" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Prediction</Link>
            <Link to="/models" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Models</Link>
            <Link to="/comparison" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Model Comparison</Link>
            <Link to="/analytics" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Analytics</Link>
            <Link to="/dataset" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Dataset</Link>
            <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About</Link>
          </div>
        </div>

        {/* Disclaimer Card */}
        <div style={{
          maxWidth: 380,
          padding: '14px 16px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#b45309' }}>
            <ShieldAlert size={16} />
            <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Operational Notice
            </strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Educational machine-learning application. Not a medical diagnostic system. Consult qualified healthcare professionals for medical decisions.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: 1400,
        margin: '24px auto 0 auto',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <span>© {new Date().getFullYear()} CardioAI. All rights reserved.</span>
        <span>Version 1.0.0 | Production Architecture</span>
      </div>
    </footer>
  );
}
