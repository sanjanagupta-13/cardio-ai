import React from 'react';
import { Menu, Activity, ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const routeTitles = {
  '/': {
    title: 'Cardiovascular Intelligence',
    subtitle: 'Monitor model performance, explore cardiovascular data and generate machine-learning predictions.'
  },
  '/prediction': {
    title: 'Cardiovascular Risk Prediction',
    subtitle: 'Enter the required health parameters and select a machine-learning model to generate a prediction.'
  },
  '/models': {
    title: 'Model Explorer',
    subtitle: 'Explore available machine learning algorithms, hyperparameters, and clinical architectures.'
  },
  '/comparison': {
    title: 'Model Performance Comparison',
    subtitle: 'Compare evaluation metrics across all trained machine learning models.'
  },
  '/analytics': {
    title: 'Cardiovascular Dataset Analytics',
    subtitle: 'Explore clinical distributions, risk factors, and feature correlations.'
  },
  '/history': {
    title: 'Prediction History',
    subtitle: 'Inspect, search, filter, and review stored patient risk assessments.'
  },
  '/dataset': {
    title: 'Dataset Explorer',
    subtitle: 'Explore structured cardiovascular health data and preprocessing specifications.'
  },
  '/about': {
    title: 'About CardioAI',
    subtitle: 'Cardiovascular Risk Analysis & Machine Learning Platform architecture.'
  }
};

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const current = routeTitles[location.pathname] || {
    title: 'CardioAI',
    subtitle: 'Cardiovascular Risk Analysis & Machine Learning Platform'
  };

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="navbar-title">{current.title}</h1>
          <p className="navbar-subtitle">{current.subtitle}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} />
          <span>70,000 Records</span>
        </div>
        <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} />
          <span>7 ML Models</span>
        </div>
      </div>
    </header>
  );
}
