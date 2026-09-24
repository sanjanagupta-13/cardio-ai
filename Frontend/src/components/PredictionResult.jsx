import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, History, RotateCcw, ArrowRight, ShieldAlert, Cpu, HelpCircle, Activity } from 'lucide-react';

export default function PredictionResult({ result, onReset, patientInputs }) {
  const navigate = useNavigate();

  if (!result) return null;

  const isHighRisk = result.prediction === 1;
  const probability = result.probability || 0;

  // Circular gauge math: r = 54, circumference = 2 * PI * 54 = 339.29
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, probability)) / 100) * circumference;

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      {/* Result Status Banner */}
      <div className={isHighRisk ? 'result-card-danger' : 'result-card-success'}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              {isHighRisk ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
              <span style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.95 }}>
                Predicted Cardiovascular Risk
              </span>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '4px 0' }}>
              {isHighRisk ? 'Predicted Higher-Risk Cardiovascular Profile' : 'Predicted Lower-Risk Cardiovascular Profile'}
            </h2>
            <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: 650, margin: '6px 0 0 0' }}>
              {isHighRisk
                ? 'Based on the entered physiological parameters, the model identifies patterns associated with elevated cardiovascular risk.'
                : 'Based on the entered physiological parameters, the model identifies patterns consistent with low cardiovascular risk.'}
            </p>
          </div>

          {/* Circular SVG Gauge */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '16px 20px',
            borderRadius: '16px',
            backdropFilter: 'blur(4px)'
          }}>
            <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke="#ffffff"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>
                {probability.toFixed(1)}%
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>
                Probability
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '8px', opacity: 0.9 }}>
              Model: {result.model || 'Machine Learning'}
            </span>
          </div>
        </div>
      </div>

      {/* Section: How this result was generated */}
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-card-subtle)',
        borderRadius: '12px',
        border: '1px solid var(--border-light)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <HelpCircle size={18} color="var(--medical-blue)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            How this result was generated
          </h4>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
          The prediction is calculated using a multi-step machine-learning pipeline:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.825rem' }}>
          <div style={{ padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>1. PATIENT INPUTS</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
              {patientInputs ? `${patientInputs.gender}, ${patientInputs.age}y, BP ${patientInputs.ap_hi}/${patientInputs.ap_lo} mmHg` : 'Exam vitals & habits'}
            </span>
          </div>

          <div style={{ padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>2. SELECTED MODEL</span>
            <span style={{ color: 'var(--medical-blue)', fontWeight: 600 }}>
              {result.model} Classifier
            </span>
          </div>

          <div style={{ padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>3. MODEL PREDICTION</span>
            <span style={{ color: isHighRisk ? 'var(--cardio-red)' : 'var(--success)', fontWeight: 700 }}>
              {isHighRisk ? 'Class 1 (Higher Risk)' : 'Class 0 (Lower Risk)'}
            </span>
          </div>

          <div style={{ padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>4. CALIBRATED PROBABILITY</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
              {probability.toFixed(1)}% likelihood
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button className="btn btn-outline" onClick={onReset}>
          <RotateCcw size={16} />
          <span>New Prediction</span>
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/history')}>
          <History size={16} />
          <span>View History</span>
        </button>
        {result.modelId && (
          <button className="btn btn-outline" onClick={() => navigate(`/models/${result.modelId}`)}>
            <Cpu size={16} />
            <span>View Model</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Medical Disclaimer */}
      <div className="disclaimer-box" style={{ marginTop: 0 }}>
        <ShieldAlert size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Important Notice:</strong> This application is an educational machine-learning tool. Predictions should not be interpreted as medical diagnosis or professional medical advice.
        </div>
      </div>
    </div>
  );
}
