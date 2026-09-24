import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Brain,
  Award,
  History,
  ArrowRight,
  Stethoscope,
  BarChart3,
  LineChart,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  Eye,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import MetricCard from '../components/MetricCard';
import ChartCard from '../components/ChartCard';
import LoadingState from '../components/LoadingState';
import { getModelMetrics, getHistory } from '../api/api';

const COLORS = ['#2563eb', '#0d9488', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
const PIE_COLORS = ['#10b981', '#ef4444'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('testingAccuracy');
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [expandedPipelineStage, setExpandedPipelineStage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [metRes, histRes] = await Promise.all([
          getModelMetrics().catch(() => ({ metrics: [] })),
          getHistory().catch(() => ({ history: [] }))
        ]);

        if (metRes.metrics) setMetrics(metRes.metrics);
        if (histRes.history) setHistoryList(histRes.history);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const metricTabs = [
    { key: 'testingAccuracy', label: 'Accuracy', unit: '%' },
    { key: 'precision', label: 'Precision', unit: '%' },
    { key: 'recall', label: 'Recall', unit: '%' },
    { key: 'f1Score', label: 'F1 Score', unit: '%' }
  ];

  // Pipeline stages definition for Section 9
  const pipelineStages = [
    {
      id: 1,
      title: 'Data Collection',
      short: '70,000 Patient Cohorts',
      detail: 'Structured observations from clinical cardiac examinations across 11 primary physiological features and binary cardiovascular status.'
    },
    {
      id: 2,
      title: 'Data Cleaning',
      short: 'Physiological Boundary Filtration',
      detail: 'Filtering arterial blood pressure extremes to valid clinical ranges (50 ≤ ap_hi ≤ 250, 30 ≤ ap_lo ≤ 200 mmHg) and resolving data inconsistencies.'
    },
    {
      id: 3,
      title: 'Preprocessing',
      short: 'Unit Normalization & BMI',
      detail: 'Converting chronological days to fractional biological years (age / 365.25) and deriving Body Mass Index (weight / height²) for metabolic context.'
    },
    {
      id: 4,
      title: 'Feature Scaling',
      short: 'StandardScaler Transformation',
      detail: 'Normalizing all continuous and discrete features to zero mean and unit variance (Z-score) to prevent magnitude-dominated gradients.'
    },
    {
      id: 5,
      title: 'Train/Test Split',
      short: '80% Train, 20% Holdout',
      detail: 'Stratified partitioning ensuring identical positive/negative cardiovascular disease distribution across training (55,000) and evaluation (13,748) sets.'
    },
    {
      id: 6,
      title: 'Model Training',
      short: '7 Algorithm Paradigms',
      detail: 'Fitting XGBoost, Random Forest, Logistic Regression, Decision Tree, AdaBoost, Naive Bayes, and KNN models.'
    },
    {
      id: 7,
      title: 'Evaluation',
      short: 'Precision, Recall, ROC-AUC',
      detail: 'Computing confusion matrices, F1-scores, and ROC-AUC curves on the unseen test partition to benchmark generalization capabilities.'
    },
    {
      id: 8,
      title: 'Prediction & Deployment',
      short: 'Flask API + React Inference',
      detail: 'Exposing serial model endpoints for sub-millisecond clinical inference via REST API to the React application.'
    }
  ];

  if (loading) return <LoadingState message="Loading cardiovascular intelligence dashboard..." />;

  const bestModel = metrics.length > 0 ? [...metrics].sort((a, b) => (b.testingAccuracy || 0) - (a.testingAccuracy || 0))[0] : null;

  // Prediction activity calculations (Section 5 & 6)
  const totalPredictions = historyList.length;
  const highRiskCount = historyList.filter(h => h.prediction === 1).length;
  const lowRiskCount = totalPredictions - highRiskCount;

  const riskDistributionData = [
    { name: 'Predicted Lower-Risk', count: lowRiskCount, percentage: totalPredictions > 0 ? Math.round((lowRiskCount / totalPredictions) * 100) : 0 },
    { name: 'Predicted Higher-Risk', count: highRiskCount, percentage: totalPredictions > 0 ? Math.round((highRiskCount / totalPredictions) * 100) : 0 }
  ];

  // Model usage count
  const modelUsageMap = {};
  historyList.forEach(h => {
    const name = h.modelName || 'Unknown';
    modelUsageMap[name] = (modelUsageMap[name] || 0) + 1;
  });
  const modelUsageData = Object.entries(modelUsageMap).map(([name, count]) => ({ name, count }));

  return (
    <div>
      {/* ----------------------------------------------------------------------
          SECTION 1 — TOP KPI CARDS
          ---------------------------------------------------------------------- */}
      <div className="metric-grid">
        <MetricCard
          title="Dataset Records"
          value="70,000"
          subtext="Cardiovascular patient cohorts"
          icon={Database}
          iconBg="#dbeafe"
          iconColor="#2563eb"
        />
        <MetricCard
          title="Available Models"
          value={metrics.length > 0 ? metrics.length : '7'}
          subtext="Supervised ML algorithms"
          icon={Brain}
          iconBg="#ccfbf1"
          iconColor="#0d9488"
        />
        <MetricCard
          title="Total Predictions"
          value={totalPredictions > 0 ? totalPredictions : '0'}
          subtext={totalPredictions > 0 ? 'Stored inference records' : 'No predictions yet'}
          icon={History}
          iconBg="#fee2e2"
          iconColor="#dc2626"
        />
        <MetricCard
          title="Model Accuracy"
          value={bestModel?.testingAccuracy ? `${bestModel.testingAccuracy}%` : 'Not available'}
          subtext={bestModel?.name ? `Highest: ${bestModel.name}` : 'Highest test score'}
          icon={Award}
          iconBg="#fef3c7"
          iconColor="#d97706"
        />
      </div>

      {/* ----------------------------------------------------------------------
          SECTION 2 — QUICK ACTIONS
          ---------------------------------------------------------------------- */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <h3 className="card-title">Quick Actions</h3>
        <p className="card-subtitle">Direct shortcuts to primary diagnostic and analytical tools.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <button
            onClick={() => navigate('/prediction')}
            className="btn btn-cardio"
            style={{ justifyContent: 'space-between', padding: '14px 18px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Stethoscope size={18} />
              <span>Start New Prediction</span>
            </div>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate('/models')}
            className="btn btn-outline"
            style={{ justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--bg-card)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Brain size={18} color="var(--medical-blue)" />
              <span>Explore Models</span>
            </div>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="btn btn-outline"
            style={{ justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--bg-card)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LineChart size={18} color="var(--clinical-teal)" />
              <span>View Analytics</span>
            </div>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate('/history')}
            className="btn btn-outline"
            style={{ justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--bg-card)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <History size={18} color="#d97706" />
              <span>View Prediction History</span>
            </div>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION 3 & 4 — MODEL PERFORMANCE & METRIC SELECTOR
          ---------------------------------------------------------------------- */}
      <div style={{ marginBottom: '28px' }}>
        <ChartCard
          title="Model Performance Overview"
          subtitle="Real evaluation metrics across all 7 trained algorithms."
          action={
            <div style={{ display: 'flex', gap: '6px' }}>
              {metricTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedMetric(tab.key)}
                  className={`btn btn-sm ${selectedMetric === tab.key ? 'btn-primary' : 'btn-outline'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={metrics}
              margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 12, fill: '#475569' }}
              />
              <YAxis
                domain={[55, 80]}
                unit="%"
                tick={{ fontSize: 12, fill: '#475569' }}
              />
              <Tooltip
                formatter={(val) => [`${val}%`, selectedMetric.replace('testing', '').toUpperCase()]}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}
              />
              <Bar dataKey={selectedMetric} radius={[6, 6, 0, 0]}>
                {metrics.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION 5 & 6 — PREDICTION ACTIVITY & RISK DISTRIBUTION
          ---------------------------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <ChartCard
          title="Prediction Activity & Model Utilization"
          subtitle="Distribution of models selected for clinical risk assessments."
        >
          {totalPredictions === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <History size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0' }}>No prediction activity yet.</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Run your first model prediction to view real usage metrics.
              </p>
              <button onClick={() => navigate('/prediction')} className="btn btn-sm btn-primary">
                Start Your First Prediction
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={modelUsageData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [val, 'Predictions Run']} />
                <Bar dataKey="count" fill="var(--medical-blue)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="Model Prediction Distribution"
          subtitle="Proportion of predicted lower-risk vs predicted higher-risk cases."
        >
          {totalPredictions === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <Activity size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0' }}>No prediction activity yet.</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Prediction distribution chart will populate once predictions are logged.
              </p>
              <button onClick={() => navigate('/prediction')} className="btn btn-sm btn-outline">
                Start New Prediction
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  label={({ name, percentage }) => `${percentage}%`}
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [val, 'Predictions']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION 7 — RECENT PREDICTIONS
          ---------------------------------------------------------------------- */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 className="card-title">Recent Predictions</h3>
            <p className="card-subtitle">Audited record of latest predictions generated by the platform.</p>
          </div>
          <button onClick={() => navigate('/history')} className="btn btn-sm btn-outline">
            <span>View All History</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {historyList.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
            No prediction activity yet. Generate a prediction to begin logging records.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Model</th>
                  <th>Prediction</th>
                  <th>Probability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {historyList.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{item.timestamp}</td>
                    <td><span className="badge badge-info">{item.modelName}</span></td>
                    <td>
                      {item.prediction === 1 ? (
                        <span className="badge badge-danger">
                          <AlertTriangle size={12} />
                          <span>Predicted Higher-Risk</span>
                        </span>
                      ) : (
                        <span className="badge badge-success">
                          <CheckCircle size={12} />
                          <span>Predicted Lower-Risk</span>
                        </span>
                      )}
                    </td>
                    <td>
                      <strong style={{ color: item.prediction === 1 ? 'var(--cardio-red)' : 'var(--success)' }}>
                        {item.probability ? `${item.probability}%` : 'N/A'}
                      </strong>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedHistoryItem(item)}
                        className="btn btn-sm btn-outline"
                        title="View Prediction Details"
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------------
          SECTION 8 — DATASET OVERVIEW
          ---------------------------------------------------------------------- */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h3 className="card-title">Dataset Overview</h3>
            <p className="card-subtitle">Cardiovascular Disease Dataset foundational metrics.</p>
          </div>
          <button onClick={() => navigate('/dataset')} className="btn btn-sm btn-outline">
            <span>Explore Dataset</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>DATASET NAME</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>Cardiovascular Disease</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Medical examination records</span>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL INSTANCES</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--medical-blue)' }}>70,000 Records</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Balanced positive/negative classes</span>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CLINICAL FEATURES</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--clinical-teal)' }}>11 Predictors</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Demographic, exam, lifestyle</span>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TARGET VARIABLE</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cardio-red)' }}>cardio (0 / 1)</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Presence of disease</span>
          </div>
        </div>

        {/* Small visual workflow */}
        <div style={{
          padding: '14px 18px',
          borderRadius: '10px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#166534'
        }}>
          <span>Structured Dataset (70k)</span>
          <span>→</span>
          <span>Data Preprocessing & Scaling</span>
          <span>→</span>
          <span>7 ML Algorithms</span>
          <span>→</span>
          <span>Clinical Risk Prediction</span>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION 9 — ML PIPELINE
          ---------------------------------------------------------------------- */}
      <div className="card">
        <h3 className="card-title">
          <Layers size={20} color="var(--medical-blue)" />
          <span>Machine Learning Pipeline Architecture</span>
        </h3>
        <p className="card-subtitle">
          Sequential workflow stages from data ingestion to real-time clinical deployment. Click any stage to expand technical details.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {pipelineStages.map((stage) => {
            const isExpanded = expandedPipelineStage === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setExpandedPipelineStage(isExpanded ? null : stage.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: isExpanded ? 'var(--medical-blue-light)' : 'var(--bg-card-subtle)',
                  border: isExpanded ? '1px solid var(--medical-blue)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: 'var(--medical-blue)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {stage.id}
                    </div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{stage.title}</strong>
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {stage.short}
                </div>

                {isExpanded && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '10px', lineHeight: 1.4, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '8px' }}>
                    {stage.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Modal for History */}
      {selectedHistoryItem && (
        <div className="modal-overlay" onClick={() => setSelectedHistoryItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                Prediction Audit Detail: #{selectedHistoryItem.id}
              </h3>
              <button
                onClick={() => setSelectedHistoryItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: selectedHistoryItem.prediction === 1 ? '#fee2e2' : '#d1fae5',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedHistoryItem.prediction === 1 ? '#991b1b' : '#065f46' }}>
                DIAGNOSIS OUTCOME
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: selectedHistoryItem.prediction === 1 ? '#b91c1c' : '#047857' }}>
                {selectedHistoryItem.prediction === 1 ? 'Predicted Higher-Risk' : 'Predicted Lower-Risk'} ({selectedHistoryItem.probability}%)
              </div>
              <span style={{ fontSize: '0.8rem', color: selectedHistoryItem.prediction === 1 ? '#991b1b' : '#065f46' }}>
                Evaluated by: {selectedHistoryItem.modelName} on {selectedHistoryItem.timestamp}
              </span>
            </div>

            {selectedHistoryItem.patientSummary && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age & Sex</span>
                  <div style={{ fontWeight: 600 }}>{selectedHistoryItem.patientSummary.age}y ({selectedHistoryItem.patientSummary.gender})</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blood Pressure</span>
                  <div style={{ fontWeight: 600 }}>{selectedHistoryItem.patientSummary.bp} mmHg</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cholesterol</span>
                  <div style={{ fontWeight: 600 }}>{selectedHistoryItem.patientSummary.cholesterol}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Glucose</span>
                  <div style={{ fontWeight: 600 }}>{selectedHistoryItem.patientSummary.gluc}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn btn-sm btn-outline" onClick={() => setSelectedHistoryItem(null)}>
                Close
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setSelectedHistoryItem(null);
                  navigate('/history');
                }}
              >
                View in History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
