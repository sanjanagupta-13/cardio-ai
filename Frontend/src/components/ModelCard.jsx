import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Brain } from 'lucide-react';

export default function ModelCard({ model, isSelected, onSelect }) {
  const navigate = useNavigate();
  const metrics = model.metrics || {};

  return (
    <div
      className={`model-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(model.id)}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '6px' }}>
              {model.category || 'ML Classifier'}
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: '2px 0' }}>
              {model.name}
            </h3>
          </div>
          {isSelected && (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'var(--medical-blue)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Check size={16} />
            </div>
          )}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
          {model.description}
        </p>

        {/* Real Performance Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {metrics.testingAccuracy !== undefined ? (
            <span className="badge badge-success">
              Accuracy: {metrics.testingAccuracy}%
            </span>
          ) : (
            <span className="badge badge-neutral">Metrics: N/A</span>
          )}
          {metrics.f1Score !== undefined && (
            <span className="badge badge-warning">
              F1: {metrics.f1Score}%
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          type="button"
          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(model.id);
          }}
        >
          {isSelected ? 'Selected for Prediction' : 'Select Model'}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/models/${model.id}`);
          }}
          title="View Model Details & Hyperparameters"
        >
          <span>Details</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
