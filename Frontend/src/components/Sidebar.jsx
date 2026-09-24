import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Brain,
  BarChart3,
  LineChart,
  History,
  Database,
  Info,
  Heart,
  X
} from 'lucide-react';
import { checkBackendHealth } from '../api/api';

export default function Sidebar({ isOpen, onClose }) {
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });

  useEffect(() => {
    let isMounted = true;

    async function verifyHealth() {
      try {
        const res = await checkBackendHealth();
        if (isMounted) {
          setBackendStatus({ online: res.success && res.status === "online", checking: false });
        }
      } catch (err) {
        if (isMounted) {
          setBackendStatus({ online: false, checking: false });
        }
      }
    }

    verifyHealth();
    const interval = setInterval(verifyHealth, 10000); // Poll health every 10s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/prediction', label: 'Prediction', icon: Stethoscope },
    { to: '/models', label: 'Models', icon: Brain },
    { to: '/comparison', label: 'Model Comparison', icon: BarChart3 },
    { to: '/analytics', label: 'Analytics', icon: LineChart },
    { to: '/history', label: 'Prediction History', icon: History },
    { to: '/dataset', label: 'Dataset', icon: Database },
    { to: '/about', label: 'About Project', icon: Info },
  ];

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Heart size={20} fill="#ffffff" />
        </div>
        <div>
          <div className="brand-name">CARDIOAI</div>
          <span className="brand-tag">Risk Analysis Platform</span>
        </div>
        {isOpen && (
          <button
            onClick={onClose}
            className="menu-toggle-btn"
            style={{ marginLeft: 'auto' }}
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div
          className={`backend-status-pill ${
            backendStatus.online ? 'status-online' : 'status-offline'
          }`}
        >
          <span className="status-dot"></span>
          <span>
            {backendStatus.checking
              ? 'Checking API...'
              : backendStatus.online
              ? 'Backend Connected'
              : 'Backend Offline'}
          </span>
        </div>
        {!backendStatus.online && !backendStatus.checking && (
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '6px' }}>
            Flask backend required on port 5000
          </div>
        )}
      </div>
    </aside>
  );
}
