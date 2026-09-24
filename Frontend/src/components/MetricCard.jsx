import React from 'react';

export default function MetricCard({ title, value, subtext, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="kpi-card">
      <div
        className="kpi-icon-wrapper"
        style={{ backgroundColor: iconBg || '#dbeafe', color: iconColor || '#2563eb' }}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div className="kpi-label">{title}</div>
        <div className="kpi-val">{value}</div>
        {subtext && <div className="kpi-subtext">{subtext}</div>}
      </div>
    </div>
  );
}
