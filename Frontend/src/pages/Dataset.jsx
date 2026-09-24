import React, { useEffect, useState } from 'react';
import { Database, Search, ArrowRight, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';
import LoadingState from '../components/LoadingState';
import { getDatasetSummary } from '../api/api';

export default function Dataset() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDatasetInfo() {
      try {
        setLoading(true);
        const res = await getDatasetSummary();
        setData(res);
      } catch (err) {
        console.error("Error loading dataset summary:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDatasetInfo();
  }, []);

  if (loading) return <LoadingState message="Loading clinical dataset schema and records..." />;

  const filteredSchema = data?.schema?.filter((item) =>
    item.feature.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.meaning.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const pipelineStages = [
    { step: 1, title: 'Raw Ingestion', desc: '70,000 patient records collected during clinical examinations.' },
    { step: 2, title: 'Outlier Cleansing', desc: 'Arterial blood pressure boundaries filtered: 50 ≤ ap_hi ≤ 250, 30 ≤ ap_lo ≤ 200.' },
    { step: 3, title: 'Unit Conversion', desc: 'Age normalized from days to years (age / 365.25), BMI calculated.' },
    { step: 4, title: 'Feature Scaling', desc: 'StandardScaler applied to all 11 continuous and clinical features.' },
    { step: 5, title: 'Stratified Split', desc: '80% training (55,000) and 20% hold-out test set (13,748) preserving balance.' },
    { step: 6, title: 'Algorithm Training', desc: '7 algorithms trained: XGBoost, Random Forest, Logistic Reg, Decision Tree, etc.' },
    { step: 7, title: 'Validation & Metrics', desc: 'Confusion matrices, Precision-Recall, and F1 optimization across all models.' },
    { step: 8, title: 'Inference Deployment', desc: 'Flask REST API integration with real-time React web application.' }
  ];

  return (
    <div>
      {/* Header Info */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Dataset Explorer & Machine Learning Pipeline
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              Schema dictionary, clinical measurement specifications, and end-to-end data pipeline.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="badge badge-info">Total Rows: 70,000</span>
            <span className="badge badge-success">Missing Values: 0</span>
          </div>
        </div>
      </div>

      {/* Visual Pipeline */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 className="card-title">
          <Layers size={20} color="var(--medical-blue)" />
          <span>End-to-End Machine Learning Architecture Pipeline</span>
        </h3>
        <p className="card-subtitle">
          Sequential data science workflow from raw medical observations to real-time clinical deployment.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          marginTop: '16px'
        }}>
          {pipelineStages.map((stage) => (
            <div
              key={stage.step}
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                position: 'relative'
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'var(--medical-blue)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '8px'
              }}>
                {stage.step}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                {stage.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Dictionary with Search */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="card-title">Clinical Feature Dictionary</h3>
            <p className="card-subtitle">Attributes, data types, and physiological clinical definitions.</p>
          </div>
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search features..."
              className="form-input"
              style={{ paddingLeft: '32px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature Key</th>
                <th>Feature Category</th>
                <th>Data Representation</th>
                <th>Description & Normal Ranges</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchema.map((item) => (
                <tr key={item.feature}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--medical-blue)' }}>
                    {item.feature}
                  </td>
                  <td><span className="badge badge-info">{item.meaning}</span></td>
                  <td><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.dataType}</span></td>
                  <td style={{ fontSize: '0.875rem' }}>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Records Preview Table */}
      {data?.sampleRows && (
        <div className="card">
          <h3 className="card-title">Sample Patient Cohort Instances</h3>
          <p className="card-subtitle">Representative rows extracted directly from `cardio_train.csv`.</p>

          <div className="table-responsive">
            <table className="data-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Age (Years)</th>
                  <th>Gender</th>
                  <th>Height</th>
                  <th>Weight</th>
                  <th>Systolic BP</th>
                  <th>Diastolic BP</th>
                  <th>Cholesterol</th>
                  <th>Glucose</th>
                  <th>Smoke</th>
                  <th>Alcohol</th>
                  <th>Active</th>
                  <th>Cardio (Target)</th>
                </tr>
              </thead>
              <tbody>
                {data.sampleRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.age_years}y</td>
                    <td>{row.gender === 1 ? 'Female' : 'Male'}</td>
                    <td>{row.height} cm</td>
                    <td>{row.weight} kg</td>
                    <td style={{ fontWeight: row.ap_hi >= 140 ? 700 : 400, color: row.ap_hi >= 140 ? '#ef4444' : 'inherit' }}>{row.ap_hi}</td>
                    <td>{row.ap_lo}</td>
                    <td>Level {row.cholesterol}</td>
                    <td>Level {row.gluc}</td>
                    <td>{row.smoke === 1 ? 'Yes' : 'No'}</td>
                    <td>{row.alco === 1 ? 'Yes' : 'No'}</td>
                    <td>{row.active === 1 ? 'Yes' : 'No'}</td>
                    <td>
                      <span className={`badge ${row.cardio === 1 ? 'badge-danger' : 'badge-success'}`}>
                        {row.cardio === 1 ? 'CVD (1)' : 'Healthy (0)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
