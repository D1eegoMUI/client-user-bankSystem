import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore.js';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  
  const isAllowed = user && user.role === 'ADMIN_ROLE'; 

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};