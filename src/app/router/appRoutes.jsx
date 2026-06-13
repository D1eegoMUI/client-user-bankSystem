import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { ProtectedRoute } from '../../shared/utils/ProtectedRoute.jsx';

export const AppRoutes = () => (
  <Routes>
    {/* PÚBLICA */}
    <Route path="/" element={<AuthPage />} />

    {/* DASHBOARD PROTEGIDO */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    >

      <Route index element={<Navigate to="accounts" />} />
    </Route>

    <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
  </Routes>
);