import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';

import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Models from './pages/Models';
import ModelDetails from './pages/ModelDetails';
import ModelComparison from './pages/ModelComparison';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Dataset from './pages/Dataset';
import About from './pages/About';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="prediction" element={<Prediction />} />
        <Route path="models" element={<Models />} />
        <Route path="models/:modelName" element={<ModelDetails />} />
        <Route path="comparison" element={<ModelComparison />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="history" element={<History />} />
        <Route path="dataset" element={<Dataset />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}
