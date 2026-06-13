import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginClient } from '../../../shared/Api/client';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,

      login: async ({ Email, Password }) => {
        set({ loading: true });
        try {
          const response = await loginClient({ UserEmail: Email, UserPassword: Password });
          const { user, token } = response.data;
          set({ user, token, isAuthenticated: true, loading: false });
          toast.success(`¡Bienvenido, ${user.UserName}!`);
          return { success: true };
        } catch (error) {
          const msg = error.response?.data?.message || 'Credenciales inválidas';
          set({ loading: false });
          toast.error(msg);
          return { success: false };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('client-auth-store');
      },
    }),
    { name: 'client-auth-store' }
  )
);