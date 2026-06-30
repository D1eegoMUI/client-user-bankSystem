import { Route, Routes } from 'react-router-dom';
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { ProtectedRoute } from '../../shared/utils/ProtectedRoute.jsx';
import { AccountsView } from '../../features/Accounts/components/AccountsView.jsx';
import { PurchasesView } from '../../features/Purchases/components/PurchasesView.jsx';
import { ExchangeView } from '../../features/exchange/components/ExchangeView.jsx';
import { LoanApplicationsView } from '../../features/LoanApplications/components/LoanApplicationsView.jsx';
import { FavoritesView } from '../../features/Favorites/components/FavoritesView.jsx';
import { TransactionsView } from '../../features/Transactions/components/TransactionsView.jsx';
import { LoansView }        from '../../features/Loans/components/LoansView.jsx';
import { CardsView } from '../../features/Cards/components/CardsView.jsx';
import { CreditCardsView } from '../../features/CreditCards/components/CreditCardsView.jsx';

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
      <Route path="purchases" element={<PurchasesView />} />
      <Route path="exchange" element={<ExchangeView />} />
      <Route path="loan-applications" element={<LoanApplicationsView />} />
      <Route path="favorites" element={<FavoritesView />} />
      <Route path="transactions" element={<TransactionsView />} />
      <Route path="loans" element={<LoansView />} />
      <Route path="cards" element={<CardsView />} />
      <Route path="credit-cards" element={<CreditCardsView />} />
    </Route>

    <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
  </Routes>
);
