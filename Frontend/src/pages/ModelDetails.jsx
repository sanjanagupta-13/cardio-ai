import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope, CheckCircle, AlertTriangle, Cpu, Layers, HelpCircle, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import LoadingState from '../components/LoadingState';
import { getModelDetails } from '../api/api';

export default function ModelDetails() {
  const { modelName } = useParams();
  const navigate = useNavigate();
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        const res = await getModelDetails(modelName);
        if (res.model) {
          setModelData(res.model);
        } else {
          setError(`Model '${modelName}' details not found.`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [modelName]);

  if (loading) return <LoadingState message={`Fetching detailed evaluation for ${modelName}...`} />;
  if (error || !modelData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <AlertTriangle size={36} color="var(--cardio-red)" style={{ margin: '0 auto 12px auto' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Model Information Unavailable</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error || 'Unable to load model data.'}</p>
        <button className="btn btn-outline" onClick={() => navigate('/models')}>
          <ArrowLeft size={16} />
          <span>Back to Models</span>
        </button>
      </div>
    );
  }

  const { metrics, confusionMatrix, featureImportance, hyperparameters } = modelData;

  return (
    <div>
      {/* Back button & Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button className="btn btn-sm btn-outline" onClick={() => navigate('/models')}>
          <ArrowLeft size={16} />
          <span>Back to Models Catalog</span>
        </button>

        <button
          className="btn btn-cardio btn-sm"
          onClick={() => navigate('/prediction')}
        >
          <Stethoscope size={16} />
          <span>Use {modelData.name} for Prediction</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span className="badge badge-info">{modelData.category}</span>
          <span className="badge badge-success">Algorithm: {modelData.algorithm}</span>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 10px 0' }}>
          {modelData.name}
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 850 }}>
          {modelData.description}
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>TESTING ACCURACY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--medical-blue)' }}>
            {metrics?.testingAccuracy ? `${metrics.testingAccuracy}%` : 'Not available'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hold-out 20% test split</span>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>PRECISION</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--clinical-teal)' }}>
            {metrics?.precision ? `${metrics.precision}%` : 'Not available'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>True positive accuracy</span>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>RECALL (SENSITIVITY)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>
            {metrics?.recall ? `${metrics.recall}%` : 'Not available'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Actual CVD detection rate</span>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>F1-SCORE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6' }}>
            {metrics?.f1Score ? `${metrics.f1Score}%` : 'Not available'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Harmonic mean of P & R</span>
        </div>
      </div>

      {/* Grid: How It Works & Clinical Rationale */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <h3 className="card-title">
            <Cpu size={20} color="var(--medical-blue)" />
            <span>How the Algorithm Operates</span>
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
            {modelData.howItWorks}
          </p>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            Clinical Use Case:
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {modelData.useCase}
          </p>
        </div>

        <div className="card">
          <h3 className="card-title">
            <Layers size={20} color="var(--clinical-teal)" />
            <span>Advantages & Clinical Limitations</span>
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065f46', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} />
              <span>Key Strengths:</span>
            </h4>
            <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {modelData.advantages?.map((adv, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{adv}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991b1b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} />
              <span>Limitations & Trade-offs:</span>
            </h4>
            <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {modelData.limitations?.map((lim, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Grid: Confusion Matrix & Feature Importance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Confusion Matrix Card */}
        <div className="card">
          <h3 className="card-title">Evaluation Confusion Matrix</h3>
          <p className="card-subtitle">Performance breakdown across test set (~13,750 patient records).</p>

          {confusionMatrix ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: '#d1fae5', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>TRUE NEGATIVES (TN)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46' }}>{confusionMatrix.trueNegative.toLocaleString()}</div>
                  <span style={{ fontSize: '0.75rem', color: '#047857' }}>Correctly classified Healthy</span>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>FALSE POSITIVES (FP)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991b1b' }}>{confusionMatrix.falsePositive.toLocaleString()}</div>
                  <span style={{ fontSize: '0.75rem', color: '#b91c1c' }}>Healthy diagnosed as CVD</span>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>FALSE NEGATIVES (FN)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#92400e' }}>{confusionMatrix.falseNegative.toLocaleString()}</div>
                  <span style={{ fontSize: '0.75rem', color: '#b45309' }}>CVD missed by model</span>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#dbeafe', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>TRUE POSITIVES (TP)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e40af' }}>{confusionMatrix.truePositive.toLocaleString()}</div>
                  <span style={{ fontSize: '0.75rem', color: '#1d4ed8' }}>Correctly diagnosed CVD</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Total Evaluated Cohort: {confusionMatrix.totalEvaluated.toLocaleString()} patients
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Not available in current project.</p>
          )}
        </div>

        {/* Feature Importance or Hyperparameters */}
        <div className="card">
          {featureImportance && featureImportance.length > 0 ? (
            <>
              <h3 className="card-title">Feature Importance Weights</h3>
              <p className="card-subtitle">Contribution of each clinical factor to the decision boundary.</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={featureImportance.slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
                >
                  <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Relative Weight']} />
                  <Bar dataKey="importance" fill="#ef4444" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <>
              <h3 className="card-title">Model Hyperparameters</h3>
              <p className="card-subtitle">Configuration parameters used during scikit-learn / XGBoost training.</p>
              {hyperparameters ? (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Configured Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(hyperparameters).map(([key, val]) => (
                        <tr key={key}>
                          <td style={{ fontWeight: 600 }}>{key}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{String(val)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Not available in current project.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
