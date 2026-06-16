import { Route, Routes } from 'react-router-dom';
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { ProtectedRoute } from '../../shared/utils/ProtectedRoute.jsx';
import { AccountsView } from '../../features/Accounts/AccountsView.jsx';
import { LoanApplicationsView } from '../../features/LoanApplications/LoanApplicationsView.jsx';
import { FavoritesView } from '../../features/Favorites/FavoritesView.jsx';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AuthPage />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    >
      <Route path="account" element={<AccountsView />} />
      <Route path="loan-applications" element={<LoanApplicationsView />} />
      <Route path="favorites" element={<FavoritesView />} />
    </Route>

    <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
  </Routes>
);