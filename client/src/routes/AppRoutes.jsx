import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// Farmer Dashboard Pages
import Dashboard from '../pages/Dashboard';
import Farms from '../pages/Farms';
import Crops from '../pages/Crops';
import Predictions from '../pages/Predictions';
import Weather from '../pages/Weather';
import Notifications from '../pages/Notifications';
import History from '../pages/History';
import Settings from '../pages/Settings';

import ProtectedRoute from '../components/common/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Farmer Application Layout with Permanent Left Sidebar (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
