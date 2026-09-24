import React from 'react';
import {
  Heart,
  Brain,
  Database,
  Layers,
  Cpu,
  ShieldAlert,
  Code2,
  Activity,
  CheckCircle,
  HelpCircle,
  BarChart3
} from 'lucide-react';

export default function About() {
  const modelsList = [
    {
      name: 'XGBoost',
      category: 'Gradient Boosted Decision Trees',
      approach: 'Sequential residual error minimization with L1/L2 tree regularization.',
      role: 'Primary high-precision classifier for complex non-linear clinical feature interactions.'
    },
    {
      name: 'Random Forest',
      category: 'Ensemble (Bagging)',
      approach: 'Bootstrap aggregation of 100 decorrelated decision trees with random feature subsampling.',
      role: 'Robust generalization benchmark with the highest test accuracy (74.7%) and Gini feature importance.'
    },
    {
      name: 'Logistic Regression',
      category: 'Generalized Linear Model',
      approach: 'Sigmoid logistic transformation over standardized linear feature combinations.',
      role: 'Clinical baseline providing well-calibrated odds ratios and interpretability.'
    },
    {
      name: 'Decision Tree (CART)',
      category: 'Tree-Structured Classifier',
      approach: 'Recursive binary feature partitioning optimizing Gini impurity split thresholds.',
      role: 'Transparent white-box diagnostic pathways for clinical threshold inspection.'
    },
    {
      name: 'AdaBoost',
      category: 'Adaptive Boosting',
      approach: 'Sequential boosting focusing training weights dynamically on misclassified boundary cases.',
      role: 'Boosting model specializing in difficult-to-classify borderline hypertensive cohorts.'
    },
    {
      name: 'Gaussian Naive Bayes',
      category: 'Probabilistic Classifier',
      approach: 'Bayesian posterior probability estimation under class-conditional feature independence.',
      role: 'Ultra-fast probabilistic triage baseline with zero hyperparameter dependencies.'
    },
    {
      name: 'K-Nearest Neighbors (KNN)',
      category: 'Instance-Based Learning',
      approach: 'Non-parametric Euclidean distance search identifying 25 nearest standardized neighbor profiles.',
      role: 'Case-based reasoning identifying historically similar patient physiological records.'
    }
  ];

  const inputParameters = [
    { name: 'Age', type: 'Objective', role: 'Chronological age converted from days to years (primary risk factor).' },
    { name: 'Gender', type: 'Objective', role: 'Biological sex classification (1 = Female, 2 = Male).' },
    { name: 'Height & Weight', type: 'Objective', role: 'Anthropometric measurements used to derive Body Mass Index (BMI).' },
    { name: 'Blood Pressure', type: 'Examination', role: 'Systolic (ap_hi) and Diastolic (ap_lo) arterial pressures in mmHg.' },
    { name: 'Cholesterol', type: 'Examination', role: 'Total serum lipid level: Normal, Above Normal, Well Above Normal.' },
    { name: 'Blood Glucose', type: 'Examination', role: 'Fasting glycemic status: Normal, Above Normal, Well Above Normal.' },
    { name: 'Smoking Status', type: 'Lifestyle', role: 'Current tobacco exposure contributing to endothelial strain.' },
    { name: 'Alcohol Consumption', type: 'Lifestyle', role: 'Ethanol intake status affecting arterial compliance.' },
    { name: 'Physical Activity', type: 'Lifestyle', role: 'Sedentary vs active lifestyle habits providing cardiovascular protection.' }
  ];

  return (
    <div>
      {/* ----------------------------------------------------------------------
          SECTION: WHAT IS CARDIOAI?
          ---------------------------------------------------------------------- */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            backgroundColor: 'var(--cardio-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Heart size={18} fill="white" />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--medical-blue)', letterSpacing: '0.05em' }}>
            Platform Overview
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 12px 0' }}>
          What is CardioAI?
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 900 }}>
          CardioAI is a cardiovascular risk analysis platform that uses machine-learning algorithms to analyze health-related input parameters and generate model-based cardiovascular risk predictions. The application combines supervised machine learning, dataset analytics, interactive visualizations, multi-algorithm evaluation, and real-time patient risk triage within a cohesive clinical workflow.
        </p>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION: PURPOSE
          ---------------------------------------------------------------------- */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 className="card-title">Purpose & Clinical Context</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          The platform is designed to demonstrate how machine-learning techniques can be applied to structured cardiovascular health data to identify patterns associated with cardiovascular disease outcomes. By analyzing non-linear relationships between arterial hypertension, metabolic dysregulation, and lifestyle factors, CardioAI provides transparent risk probability assessments to support clinical understanding.
        </p>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION: HOW IT WORKS (VISUAL WORKFLOW)
          ---------------------------------------------------------------------- */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 className="card-title">
          <Layers size={20} color="var(--medical-blue)" />
          <span>How It Works: End-to-End Workflow</span>
        </h3>
        <p className="card-subtitle">
          Sequential data flow from patient observation to interactive risk visualization.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          textAlign: 'center',
          marginTop: '16px'
        }}>
          {[
            { step: '1', name: 'Health Parameters', desc: 'Vitals & lifestyle data' },
            { step: '2', name: 'Data Processing', desc: 'Boundary validation' },
            { step: '3', name: 'Feature Preparation', desc: 'StandardScaler scaling' },
            { step: '4', name: 'ML Model', desc: 'Trained algorithm' },
            { step: '5', name: 'Prediction', desc: 'Class classification' },
            { step: '6', name: 'Probability', desc: 'Calibrated score (%)' },
            { step: '7', name: 'Visualization', desc: 'Dashboard & Audit' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px 10px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: 'var(--medical-blue)',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto'
              }}>
                {item.step}
              </div>
              <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-main)', marginBottom: '2px' }}>
                {item.name}
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION: INPUT PARAMETERS
          ---------------------------------------------------------------------- */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 className="card-title">Physiological Input Parameters</h3>
        <p className="card-subtitle">Attributes utilized as model inputs for cardiovascular risk inference.</p>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Classification</th>
                <th>Role in Cardiovascular Inference</th>
              </tr>
            </thead>
            <tbody>
              {inputParameters.map((param, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{param.name}</td>
                  <td><span className="badge badge-info">{param.type}</span></td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{param.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION: MACHINE LEARNING MODELS
          ---------------------------------------------------------------------- */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 className="card-title">
          <Brain size={20} color="var(--medical-blue)" />
          <span>Supported Machine Learning Models</span>
        </h3>
        <p className="card-subtitle">7 supervised classification algorithms implemented and evaluated in the project.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {modelsList.map((m, idx) => (
            <div
              key={idx}
              style={{
                padding: '18px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {m.name}
                </h4>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{m.category}</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
                <strong>Approach:</strong> {m.approach}
              </p>
              <p style={{ fontSize: '0.825rem', color: 'var(--medical-blue)', margin: 0, fontWeight: 500 }}>
                <strong>Application Role:</strong> {m.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION: DATASET & DATA PROCESSING
          ---------------------------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <h3 className="card-title">Cardiovascular Dataset</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            The application operates on the Cardiovascular Disease Dataset comprising 70,000 structured patient records. Features encompass demographic indicators, clinical examination readings, and subjective lifestyle factors mapped to a binary cardiovascular outcome target.
          </p>
          <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <li>Total Records: 70,000 observations</li>
            <li>Feature Dimensions: 11 physiological predictors</li>
            <li>Balanced Distribution: ~50% healthy / ~50% pathological</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title">Data Processing Pipeline</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            Data processing follows standard supervised machine learning protocols:
          </p>
          <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <li><strong>Data Cleaning:</strong> Blood pressure outlier removal (50 ≤ ap_hi ≤ 250, 30 ≤ ap_lo ≤ 200).</li>
            <li><strong>Feature Preparation:</strong> Normalization of chronological days to decimal years.</li>
            <li><strong>Scaling:</strong> StandardScaler applied to prevent gradient dominance.</li>
            <li><strong>Partitioning:</strong> 80% train / 20% hold-out test split with stratification.</li>
          </ul>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION: MODEL EVALUATION & TECHNOLOGY
          ---------------------------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <h3 className="card-title">Model Evaluation Metrics</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
            All algorithms are evaluated on the identical hold-out test set using established classification metrics:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.825rem' }}>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
              <strong>Accuracy:</strong> Overall correct prediction proportion.
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
              <strong>Precision:</strong> Positive predictive accuracy.
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
              <strong>Recall:</strong> Sensitivity in detecting CVD cases.
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
              <strong>F1 Score:</strong> Harmonic balance between P & R.
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Technology Stack</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div>
              <strong style={{ color: 'var(--medical-blue)' }}>Frontend:</strong> React 18, Vite, React Router, Recharts, Lucide Icons, Native Fetch API.
            </div>
            <div>
              <strong style={{ color: 'var(--clinical-teal)' }}>Backend API:</strong> Python 3, Flask, Flask-CORS REST Service (Port 5000).
            </div>
            <div>
              <strong style={{ color: 'var(--cardio-red)' }}>Machine Learning:</strong> Scikit-Learn, XGBoost, Joblib serialization.
            </div>
            <div>
              <strong style={{ color: '#d97706' }}>Storage:</strong> Local JSON persistence for prediction audit history.
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          SECTION: RESPONSIBLE USE & DISCLAIMER
          ---------------------------------------------------------------------- */}
      <div className="disclaimer-box" style={{ marginTop: 0 }}>
        <ShieldAlert size={24} style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>
            Responsible Use & Clinical Limitations
          </strong>
          The CardioAI application provides machine-learning based predictions and analytical visualizations. It is not intended to provide medical diagnosis. Predictions may be affected by dataset characteristics, feature quality, model limitations, and training methodology. Users should consult qualified healthcare professionals for all clinical medical decisions and diagnoses.
        </div>
      </div>
    </div>
  );
}
