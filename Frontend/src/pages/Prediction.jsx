import React, { useState, useEffect } from 'react';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import LoadingState from '../components/LoadingState';
import { getModels, predictCardio } from '../api/api';
import { Brain, Check, Sparkles } from 'lucide-react';

export default function Prediction() {
  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('xgboost');
  const [predictionResult, setPredictionResult] = useState(null);
  const [submittedInputs, setSubmittedInputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingModels, setFetchingModels] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    async function fetchModelList() {
      try {
        setFetchingModels(true);
        const res = await getModels();
        if (res.models && res.models.length > 0) {
          setModels(res.models);
          setSelectedModelId(res.models[0].id);
        }
      } catch (err) {
        console.warn("Could not fetch models from backend, using default fallback models:", err);
        setModels([
          { id: 'xgboost', name: 'XGBoost', category: 'Ensemble (Boosting)' },
          { id: 'random_forest', name: 'Random Forest', category: 'Ensemble (Bagging)' },
          { id: 'logistic_regression', name: 'Logistic Regression', category: 'Linear Model' },
          { id: 'decision_tree', name: 'Decision Tree', category: 'Tree Classifier' },
          { id: 'adaboost', name: 'AdaBoost', category: 'Ensemble (Boosting)' },
          { id: 'naive_bayes', name: 'Gaussian Naive Bayes', category: 'Probabilistic' },
          { id: 'knn', name: 'K-Nearest Neighbors', category: 'Instance-Based' }
        ]);
      } finally {
        setFetchingModels(false);
      }
    }

    fetchModelList();
  }, []);

  const handlePredict = async (formData) => {
    try {
      setLoading(true);
      setApiError('');
      setPredictionResult(null);
      setSubmittedInputs(formData);

      const payload = {
        ...formData,
        model: selectedModelId
      };

      const result = await predictCardio(payload);
      setPredictionResult(result);
    } catch (err) {
      setApiError(err.message || 'Unable to generate prediction. Please ensure the Flask backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const selectedModelObj = models.find((m) => m.id === selectedModelId);

  return (
    <div>
      {/* Model Selection Row */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 className="card-title">
              <Brain size={20} color="var(--medical-blue)" />
              <span>Select Machine Learning Model</span>
            </h3>
            <p className="card-subtitle" style={{ marginBottom: 0 }}>
              Choose which trained algorithm will evaluate the patient risk parameters.
            </p>
          </div>
          <span className="badge badge-info">
            Active: {selectedModelObj?.name || 'XGBoost'}
          </span>
        </div>

        {fetchingModels ? (
          <div style={{ padding: '12px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Loading available algorithm models...
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
            {models.map((m) => {
              const active = m.id === selectedModelId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModelId(m.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: active ? '2px solid var(--medical-blue)' : '1px solid var(--border-light)',
                    backgroundColor: active ? 'var(--medical-blue-light)' : 'var(--bg-card-subtle)',
                    color: active ? 'var(--medical-blue-hover)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {active && <Check size={14} />}
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {apiError && (
        <div style={{
          backgroundColor: 'var(--danger-light)',
          color: '#991b1b',
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #fca5a5'
        }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700 }}>Prediction Service Notice</h4>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>{apiError}</p>
        </div>
      )}

      {/* Prediction Form */}
      <PredictionForm
        onSubmit={handlePredict}
        isLoading={loading}
        selectedModel={selectedModelObj}
      />

      {/* Loading Indicator */}
      {loading && <LoadingState message={`Generating cardiovascular risk prediction with ${selectedModelObj?.name || 'ML Model'}...`} />}

      {/* Result Display */}
      {predictionResult && (
        <PredictionResult
          result={predictionResult}
          patientInputs={submittedInputs}
          onReset={() => {
            setPredictionResult(null);
            setSubmittedInputs(null);
          }}
        />
      )}
    </div>
  );
}
