import { Route, Routes } from 'react-router-dom';
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { ProtectedRoute } from '../../shared/utils/ProtectedRoute.jsx';
import { AccountsView } from '../../features/Accounts/AccountsView.jsx';
import { PurchasesView } from '../../features/Purchases/PurchasesView.jsx';

export const AppRoutes = () => (
  <Routes>
    {/* RUTA PÚBLICA */}
    <Route path="/" element={<AuthPage />} />

    {/* RUTAS DEL DASHBOARD PROTEGIDAS */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    >

      {/* Estas sub-rutas heredan la protección del padre */}
      <Route path="account" element={<AccountsView />} />
      <Route path="purchases" element={<PurchasesView />} />
    </Route>
    
    {/* Manejo de errores 404 */}
    <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
  </Routes>
);
