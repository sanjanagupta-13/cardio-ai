import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Filter, ArrowRight } from 'lucide-react';
import ModelCard from '../components/ModelCard';
import LoadingState from '../components/LoadingState';
import { getModels } from '../api/api';

export default function Models() {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModels() {
      try {
        setLoading(true);
        const res = await getModels();
        if (res.models) {
          setModels(res.models);
        }
      } catch (err) {
        console.error("Error loading models:", err);
      } finally {
        setLoading(false);
      }
    }
    loadModels();
  }, []);

  const categories = ['all', 'Ensemble', 'Tree', 'Linear', 'Probabilistic', 'Instance'];

  const filteredModels = models.filter((m) => {
    if (filter === 'all') return true;
    return m.category?.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) return <LoadingState message="Loading machine learning model catalog..." />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
            Machine Learning Model Catalog
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
            Inspect the 7 distinct supervised learning algorithms evaluated for cardiovascular risk triage.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {cat === 'all' ? 'All Paradigms' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="models-grid">
        {filteredModels.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onSelect={() => navigate('/prediction')}
          />
        ))}
      </div>
    </div>
  );
}
