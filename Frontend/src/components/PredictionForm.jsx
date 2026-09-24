import React, { useState, useEffect } from 'react';
import { calculateBMI, getBMICategory, getBPStage } from '../utils/calculations';
import { AlertCircle, Activity, Heart, Sparkles } from 'lucide-react';

export default function PredictionForm({ onSubmit, isLoading, selectedModel }) {
  const [formData, setFormData] = useState({
    age: 50,
    gender: 'Female',
    height: 165,
    weight: 68,
    ap_hi: 125,
    ap_lo: 80,
    cholesterol: 'Normal',
    gluc: 'Normal',
    smoke: 'No',
    alco: 'No',
    active: 'Yes'
  });

  const [validationError, setValidationError] = useState('');

  // Real-time calculations
  const bmi = calculateBMI(formData.weight, formData.height);
  const bmiCategory = getBMICategory(bmi);
  const bpStage = getBPStage(formData.ap_hi, formData.ap_lo);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
    setValidationError('');
  };

  const handlePreset = (type) => {
    if (type === 'healthy') {
      setFormData({
        age: 32,
        gender: 'Female',
        height: 168,
        weight: 60,
        ap_hi: 115,
        ap_lo: 75,
        cholesterol: 'Normal',
        gluc: 'Normal',
        smoke: 'No',
        alco: 'No',
        active: 'Yes'
      });
    } else {
      setFormData({
        age: 58,
        gender: 'Male',
        height: 175,
        weight: 92,
        ap_hi: 155,
        ap_lo: 95,
        cholesterol: 'Well Above Normal',
        gluc: 'Above Normal',
        smoke: 'Yes',
        alco: 'Yes',
        active: 'No'
      });
    }
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(formData.ap_hi) <= Number(formData.ap_lo)) {
      setValidationError("Clinical Validation Error: Systolic Blood Pressure (ap_hi) must be strictly greater than Diastolic Blood Pressure (ap_lo).");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 className="card-title">
            <Heart size={20} color="var(--cardio-red)" />
            <span>Patient Examination Parameters</span>
          </h3>
          <p className="card-subtitle">
            Provide the physiological vitals and lifestyle habits for inference.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => handlePreset('healthy')}
          >
            <Sparkles size={14} />
            <span>Healthy Sample</span>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => handlePreset('highRisk')}
          >
            <AlertCircle size={14} color="var(--cardio-red)" />
            <span>High Risk Sample</span>
          </button>
        </div>
      </div>

      {validationError && (
        <div style={{
          backgroundColor: 'var(--danger-light)',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: '10px',
          fontSize: '0.875rem',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={18} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Grid: Demographics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="form-group">
          <label className="form-label">Age (Years)</label>
          <input
            type="number"
            name="age"
            min="18"
            max="100"
            className="form-input"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Biological Gender</label>
          <select
            name="gender"
            className="form-select"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Height (cm)</label>
          <input
            type="number"
            name="height"
            min="100"
            max="230"
            className="form-input"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            min="30"
            max="220"
            className="form-input"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* BMI Informational Banner */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--bg-card-subtle)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '20px',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={18} color="var(--medical-blue)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Calculated BMI (Body Mass Index):
          </span>
          <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>
            {bmi} kg/m²
          </strong>
        </div>
        {bmiCategory && (
          <span className={`badge ${bmiCategory.class}`}>
            Category: {bmiCategory.label}
          </span>
        )}
      </div>

      {/* Grid: Blood Pressure */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="form-group">
          <label className="form-label">Systolic BP (ap_hi, mmHg)</label>
          <input
            type="number"
            name="ap_hi"
            min="70"
            max="240"
            className="form-input"
            value={formData.ap_hi}
            onChange={handleChange}
            required
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Arterial pressure on contraction</span>
        </div>

        <div className="form-group">
          <label className="form-label">Diastolic BP (ap_lo, mmHg)</label>
          <input
            type="number"
            name="ap_lo"
            min="40"
            max="160"
            className="form-input"
            value={formData.ap_lo}
            onChange={handleChange}
            required
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Arterial pressure on relaxation</span>
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">AHA Blood Pressure Classification</label>
          <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)' }}>
            {bpStage && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`badge ${bpStage.class}`}>{bpStage.stage}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{bpStage.description}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Biochemical & Lifestyle */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="form-group">
          <label className="form-label">Cholesterol</label>
          <select
            name="cholesterol"
            className="form-select"
            value={formData.cholesterol}
            onChange={handleChange}
          >
            <option value="Normal">Normal (Level 1)</option>
            <option value="Above Normal">Above Normal (Level 2)</option>
            <option value="Well Above Normal">Well Above Normal (Level 3)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Glucose</label>
          <select
            name="gluc"
            className="form-select"
            value={formData.gluc}
            onChange={handleChange}
          >
            <option value="Normal">Normal (Level 1)</option>
            <option value="Above Normal">Above Normal (Level 2)</option>
            <option value="Well Above Normal">Well Above Normal (Level 3)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Smoking Status</label>
          <select
            name="smoke"
            className="form-select"
            value={formData.smoke}
            onChange={handleChange}
          >
            <option value="No">Non-Smoker</option>
            <option value="Yes">Current Smoker</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Alcohol Intake</label>
          <select
            name="alco"
            className="form-select"
            value={formData.alco}
            onChange={handleChange}
          >
            <option value="No">No Alcohol</option>
            <option value="Yes">Alcohol Consumer</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Physical Activity</label>
          <select
            name="active"
            className="form-select"
            value={formData.active}
            onChange={handleChange}
          >
            <option value="Yes">Active (Exercise)</option>
            <option value="No">Sedentary</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Target Model for Inference: <strong>{selectedModel?.name || 'XGBoost'}</strong>
        </div>
        <button
          type="submit"
          className="btn btn-cardio"
          disabled={isLoading}
          style={{ minWidth: 200 }}
        >
          {isLoading ? 'Running ML Inference...' : 'Generate Prediction'}
        </button>
      </div>
    </form>
  );
}
