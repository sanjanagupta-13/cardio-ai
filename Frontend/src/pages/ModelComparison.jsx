import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowUpDown, Award, CheckCircle, ArrowRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import ChartCard from '../components/ChartCard';
import LoadingState from '../components/LoadingState';
import { getModelMetrics } from '../api/api';

const COLORS = ['#2563eb', '#0d9488', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

export default function ModelComparison() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState([]);
  const [activeMetric, setActiveMetric] = useState('testingAccuracy');
  const [sortField, setSortField] = useState('testingAccuracy');
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const res = await getModelMetrics();
        if (res.metrics) {
          setMetrics(res.metrics);
        }
      } catch (err) {
        console.error("Error loading metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const metricConfigs = {
    testingAccuracy: { label: 'Testing Accuracy', unit: '%', domain: [60, 80], desc: 'Overall correct predictions on unseen 20% test partition' },
    precision: { label: 'Precision', unit: '%', domain: [60, 85], desc: 'Proportion of positive CVD predictions that were truly pathological' },
    recall: { label: 'Recall (Sensitivity)', unit: '%', domain: [55, 80], desc: 'Proportion of actual CVD patients correctly identified' },
    f1Score: { label: 'F1 Score', unit: '%', domain: [60, 80], desc: 'Harmonic mean balancing Precision and Recall' }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedMetrics = [...metrics].sort((a, b) => {
    const valA = a[sortField] || 0;
    const valB = b[sortField] || 0;
    return sortAsc ? valA - valB : valB - valA;
  });

  if (loading) return <LoadingState message="Loading multi-algorithm benchmark data..." />;

  const currentConfig = metricConfigs[activeMetric];
  const topModel = [...metrics].sort((a, b) => (b[activeMetric] || 0) - (a[activeMetric] || 0))[0];

  return (
    <div>
      {/* Top Banner Notice */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Multi-Model Benchmark & Comparison
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              Comparative statistical evaluation of 7 supervised classification paradigms on the Cardiovascular dataset.
            </p>
          </div>
          {topModel && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', backgroundColor: 'var(--success-light)', color: '#065f46', fontSize: '0.85rem', fontWeight: 600 }}>
              <Award size={18} />
              <span>Highest {currentConfig.label} in evaluation: <strong>{topModel.name} ({topModel[activeMetric]}%)</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="tabs-container">
        {Object.entries(metricConfigs).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveMetric(key)}
            className={`tab-btn ${activeMetric === key ? 'active' : ''}`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Interactive Bar Chart */}
      <div style={{ marginBottom: '28px' }}>
        <ChartCard
          title={`Algorithm Comparison: ${currentConfig.label}`}
          subtitle={currentConfig.desc}
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
                domain={currentConfig.domain}
                unit={currentConfig.unit}
                tick={{ fontSize: 12, fill: '#475569' }}
              />
              <Tooltip
                formatter={(val) => [`${val}%`, currentConfig.label]}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}
              />
              <Bar dataKey={activeMetric} radius={[6, 6, 0, 0]}>
                {metrics.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Sortable Leaderboard Table */}
      <div className="card">
        <h3 className="card-title">Comprehensive Model Performance Matrix</h3>
        <p className="card-subtitle">Click on any column header to sort models dynamically.</p>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Model Name</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th>Category</th>
                <th onClick={() => handleSort('trainingAccuracy')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Train Accuracy</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort('testingAccuracy')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Test Accuracy</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort('precision')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Precision</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort('recall')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Recall</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort('f1Score')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>F1-Score</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {sortedMetrics.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 700 }}>{row.name}</td>
                  <td><span className="badge badge-info">{row.category}</span></td>
                  <td>{row.trainingAccuracy ? `${row.trainingAccuracy}%` : 'N/A'}</td>
                  <td>
                    <strong style={{ color: 'var(--medical-blue)' }}>
                      {row.testingAccuracy ? `${row.testingAccuracy}%` : 'N/A'}
                    </strong>
                  </td>
                  <td>{row.precision ? `${row.precision}%` : 'N/A'}</td>
                  <td>{row.recall ? `${row.recall}%` : 'N/A'}</td>
                  <td>
                    <strong style={{ color: '#8b5cf6' }}>
                      {row.f1Score ? `${row.f1Score}%` : 'N/A'}
                    </strong>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/models/${row.id}`)}
                      className="btn btn-sm btn-outline"
                      title="Inspect Model Details"
                    >
                      <span>Details</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
