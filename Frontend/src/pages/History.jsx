import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Trash2, Eye, AlertTriangle, CheckCircle, Stethoscope, X } from 'lucide-react';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { getHistory, deleteHistory } from '../api/api';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [predictionFilter, setPredictionFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const res = await getHistory({
        search,
        model: modelFilter,
        prediction: predictionFilter
      });
      if (res.history) {
        setHistory(res.history);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [modelFilter, predictionFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistoryData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete prediction record #${id}?`)) return;
    try {
      await deleteHistory(id);
      setHistory((prev) => prev.filter((h) => h.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Top Banner & Filters */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Patient Prediction History
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              Audit log of previous clinical risk evaluations generated through the Flask API.
            </p>
          </div>
          <button onClick={() => navigate('/prediction')} className="btn btn-cardio btn-sm">
            <Stethoscope size={16} />
            <span>New Prediction</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: 260 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by ID, model, or vitals..."
                className="form-input"
                style={{ paddingLeft: '36px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-outline btn-sm">Search</button>
          </form>

          <select
            className="form-select"
            style={{ width: 170 }}
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
          >
            <option value="all">All Models</option>
            <option value="xgboost">XGBoost</option>
            <option value="random_forest">Random Forest</option>
            <option value="logistic_regression">Logistic Regression</option>
            <option value="decision_tree">Decision Tree</option>
            <option value="adaboost">AdaBoost</option>
            <option value="naive_bayes">Naive Bayes</option>
            <option value="knn">KNN</option>
          </select>

          <select
            className="form-select"
            style={{ width: 160 }}
            value={predictionFilter}
            onChange={(e) => setPredictionFilter(e.target.value)}
          >
            <option value="all">All Outcomes</option>
            <option value="1">CVD Detected</option>
            <option value="0">Low Risk</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      {loading ? (
        <LoadingState message="Fetching prediction history..." />
      ) : history.length === 0 ? (
        <EmptyState
          title="No prediction records found"
          description="There are currently no saved predictions matching your filters."
          actionLabel="Start New Prediction"
          onAction={() => navigate('/prediction')}
        />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Timestamp</th>
                  <th>Model Used</th>
                  <th>Patient Summary</th>
                  <th>Diagnosis Outcome</th>
                  <th>Probability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--medical-blue)' }}>
                      #{item.id}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.timestamp}</td>
                    <td><span className="badge badge-info">{item.modelName}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {item.patientSummary ? (
                        <span>
                          {item.patientSummary.gender}, {item.patientSummary.age}y | BP: {item.patientSummary.bp} | Chol: {item.patientSummary.cholesterol}
                        </span>
                      ) : (
                        'Vitals logged'
                      )}
                    </td>
                    <td>
                      {item.prediction === 1 ? (
                        <span className="badge badge-danger">
                          <AlertTriangle size={12} />
                          <span>CVD Risk</span>
                        </span>
                      ) : (
                        <span className="badge badge-success">
                          <CheckCircle size={12} />
                          <span>Low Risk</span>
                        </span>
                      )}
                    </td>
                    <td>
                      <strong style={{ color: item.prediction === 1 ? 'var(--cardio-red)' : 'var(--success)' }}>
                        {item.probability ? `${item.probability}%` : 'N/A'}
                      </strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="btn btn-sm btn-outline"
                          title="View Full Patient Record"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="btn btn-sm btn-outline"
                          style={{ color: '#ef4444' }}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Prediction Audit Detail: #{selectedItem.id}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: selectedItem.prediction === 1 ? '#fee2e2' : '#d1fae5', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: selectedItem.prediction === 1 ? '#991b1b' : '#065f46' }}>
                DIAGNOSIS OUTCOME
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: selectedItem.prediction === 1 ? '#b91c1c' : '#047857' }}>
                {selectedItem.resultLabel || (selectedItem.prediction === 1 ? 'CVD Detected' : 'No Disease Detected')} ({selectedItem.probability}%)
              </div>
              <span style={{ fontSize: '0.8rem', color: selectedItem.prediction === 1 ? '#991b1b' : '#065f46' }}>
                Evaluated by: {selectedItem.modelName} on {selectedItem.timestamp}
              </span>
            </div>

            {selectedItem.patientSummary && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age & Sex</span>
                  <div style={{ fontWeight: 600 }}>{selectedItem.patientSummary.age} Years ({selectedItem.patientSummary.gender})</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blood Pressure</span>
                  <div style={{ fontWeight: 600 }}>{selectedItem.patientSummary.bp} mmHg</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cholesterol Level</span>
                  <div style={{ fontWeight: 600 }}>{selectedItem.patientSummary.cholesterol}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Glucose Level</span>
                  <div style={{ fontWeight: 600 }}>{selectedItem.patientSummary.gluc}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smoking Status</span>
                  <div style={{ fontWeight: 600 }}>{selectedItem.patientSummary.smoke}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Physical Activity</span>
                  <div style={{ fontWeight: 600 }}>{selectedItem.patientSummary.active}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedItem(null)}>
                Close
              </button>
              <button
                className="btn btn-cardio btn-sm"
                onClick={() => {
                  handleDelete(selectedItem.id);
                }}
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
