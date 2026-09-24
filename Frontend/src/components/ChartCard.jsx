import React from 'react';

export default function ChartCard({ title, subtitle, action, children }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle" style={{ marginBottom: 0 }}>{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div style={{ width: '100%', minHeight: 300 }}>
        {children}
      </div>
    </div>
  );
}
