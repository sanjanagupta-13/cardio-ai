import React, { useEffect, useState } from 'react';
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
  Legend,
  ResponsiveContainer
} from 'recharts';
import ChartCard from '../components/ChartCard';
import LoadingState from '../components/LoadingState';
import { getAnalytics } from '../api/api';
import { Activity, Database, Heart, Layers, Users, Zap } from 'lucide-react';

const PIE_COLORS = ['#10b981', '#ef4444'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await getAnalytics();
        if (res.analytics) {
          setData(res.analytics);
        }
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) return <LoadingState message="Computing real distributions from 70,000 patient records..." />;
  if (!data) return <div className="card">Unable to load dataset analytics from backend.</div>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'demographics', label: 'Demographics' },
    { id: 'vitals', label: 'Vitals & Blood Pressure' },
    { id: 'lifestyle', label: 'Lifestyle Factors' },
    { id: 'clinical', label: 'Clinical & Biochemical' },
    { id: 'correlation', label: 'Correlation Matrix' }
  ];

  return (
    <div>
      {/* Top Dataset Metrics Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Cardiovascular Dataset Analytics
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              Population-level health distributions and clinical risk factors computed over {data.totalRecords?.toLocaleString()} genuine records.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-info">Records: {data.totalRecords?.toLocaleString()}</span>
            <span className="badge badge-info">Features: {data.featuresCount}</span>
            <span className="badge badge-success">Target: cardio (0 / 1)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ----------------------------------------------------------------------
          TAB 1: OVERVIEW
          ---------------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          <ChartCard
            title="Cardiovascular Outcome Distribution (Target Variable)"
            subtitle="Overall balance between healthy patients (0) and CVD diagnosed patients (1)."
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.classDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {data.classDistribution.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Patients']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Gender Distribution & CVD Rate"
            subtitle="Comparing patient representation and disease incidence by sex."
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.genderDistribution} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip formatter={(val) => [val.toLocaleString(), 'Patients']} />
                <Legend />
                <Bar dataKey="healthy" name="Healthy (0)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cvd" name="CVD (1)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          TAB 2: DEMOGRAPHICS
          ---------------------------------------------------------------------- */}
      {activeTab === 'demographics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          <ChartCard
            title="Age Distribution vs Cardiovascular Disease"
            subtitle="Incidence across chronological age brackets (29–39, 40–49, 50–59, 60+)."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.ageDistribution} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="bracket" />
                <YAxis />
                <Tooltip formatter={(val) => [val.toLocaleString(), 'Patients']} />
                <Legend />
                <Bar dataKey="healthy" name="Healthy" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cvd" name="CVD Diagnosed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Age Cohort CVD Prevalence Rate (%)"
            subtitle="Percentage of patients with cardiovascular disease per age bracket."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.ageDistribution} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="bracket" />
                <YAxis unit="%" domain={[0, 80]} />
                <Tooltip formatter={(val) => [`${val}%`, 'CVD Rate']} />
                <Bar dataKey="cvdRate" name="CVD Rate (%)" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          TAB 3: VITALS
          ---------------------------------------------------------------------- */}
      {activeTab === 'vitals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          <ChartCard
            title="AHA Blood Pressure Stages vs CVD Prevalence"
            subtitle="Incidence rate mapped across clinical hypertension categories (ap_hi / ap_lo)."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.bloodPressureDistribution} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stage" />
                <YAxis unit="%" />
                <Tooltip formatter={(val) => [`${val}%`, 'CVD Prevalence Rate']} />
                <Bar dataKey="cvdRate" name="CVD Rate (%)" fill="#dc2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Body Mass Index (BMI) Distribution & Risk"
            subtitle="Proportion of cardiovascular pathology across Underweight, Normal, Overweight, Obese."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.bmiDistribution} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" />
                <YAxis unit="%" />
                <Tooltip formatter={(val) => [`${val}%`, 'CVD Rate']} />
                <Bar dataKey="cvdRate" name="CVD Rate (%)" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          TAB 4: LIFESTYLE
          ---------------------------------------------------------------------- */}
      {activeTab === 'lifestyle' && (
        <div className="card">
          <h3 className="card-title">Lifestyle Risk Factors vs CVD Prevalence</h3>
          <p className="card-subtitle">
            Incidence rates among tobacco smokers, alcohol consumers, and physically active vs sedentary individuals.
          </p>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={data.lifestyleDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="factor" />
              <YAxis unit="%" domain={[30, 70]} />
              <Tooltip formatter={(val) => [`${val}%`, 'CVD Rate']} />
              <Bar dataKey="cvdRate" name="CVD Rate (%)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          TAB 5: CLINICAL FACTORS
          ---------------------------------------------------------------------- */}
      {activeTab === 'clinical' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          <ChartCard
            title="Serum Cholesterol Impact on Disease Rate"
            subtitle="Prevalence across Level 1 (Normal), Level 2 (Above Normal), Level 3 (Well Above Normal)."
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.cholesterolDistribution} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="level" />
                <YAxis unit="%" />
                <Tooltip formatter={(val) => [`${val}%`, 'CVD Rate']} />
                <Bar dataKey="cvdRate" name="CVD Rate (%)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Fasting Glucose Impact on Disease Rate"
            subtitle="Prevalence across Fasting Glucose clinical categories."
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.glucoseDistribution} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="level" />
                <YAxis unit="%" />
                <Tooltip formatter={(val) => [`${val}%`, 'CVD Rate']} />
                <Bar dataKey="cvdRate" name="CVD Rate (%)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          TAB 6: CORRELATION MATRIX
          ---------------------------------------------------------------------- */}
      {activeTab === 'correlation' && (
        <div className="card">
          <h3 className="card-title">Feature-to-Target Correlation Matrix</h3>
          <p className="card-subtitle">
            Pearson correlation coefficients calculated across all physiological predictors against the target `cardio`.
          </p>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Age</th>
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
                {data.correlationMatrix?.map((row) => (
                  <tr key={row.feature}>
                    <td style={{ fontWeight: 700 }}>{row.feature}</td>
                    <td>{row.age_years}</td>
                    <td>{row.gender}</td>
                    <td>{row.height}</td>
                    <td>{row.weight}</td>
                    <td style={{ fontWeight: row.ap_hi > 0.3 ? 700 : 400, color: row.ap_hi > 0.3 ? '#ef4444' : 'inherit' }}>{row.ap_hi}</td>
                    <td>{row.ap_lo}</td>
                    <td style={{ fontWeight: row.cholesterol > 0.2 ? 700 : 400, color: row.cholesterol > 0.2 ? '#f59e0b' : 'inherit' }}>{row.cholesterol}</td>
                    <td>{row.gluc}</td>
                    <td>{row.smoke}</td>
                    <td>{row.alco}</td>
                    <td>{row.active}</td>
                    <td>
                      <strong style={{ color: row.cardio > 0.3 ? '#ef4444' : row.cardio > 0.1 ? '#f59e0b' : 'inherit' }}>
                        {row.cardio}
                      </strong>
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
