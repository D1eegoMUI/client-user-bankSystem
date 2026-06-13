import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest } from "../../../shared/Api";
import toast from 'react-hot-toast';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: false,
            error: null,
            isAuthenticated: false,

            login: async ({ Email, Password }) => {
                set({ loading: true, error: null });
                try {
                    const response = await loginRequest({ email: Email, password: Password });
                    const responseData = response.data;

                    const user = responseData.user || responseData.data;
                    const token = responseData.token || responseData.accessToken;
                    const role = user?.role || user?.userRol || user?.UserRol || responseData.role;
                    console.log("Response completa:", responseData); 
                    console.log("Rol detectado:", role);              

                    const isClient = role === "CLIENT" || role === "USER" || role === "User";
                    if (!isClient) {
                        const message = "Acceso solo para clientes";
                        set({ isAuthenticated: false, loading: false, error: message });
                        toast.error(message);
                        return { success: false, error: message };
                    }

                    set({ user, token, isAuthenticated: true, loading: false });
                    toast.success(`¡Bienvenido, ${user?.UserName || user?.userName || 'usuario'}!`);
                    return { success: true };

                } catch (error) {
                    const msg = error.response?.data?.message || 'Credenciales inválidas';
                    set({ loading: false, error: msg });
                    toast.error(msg);
                    return { success: false, error: msg };
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false, error: null });
                localStorage.removeItem('client-auth-store');
            },
        }),
        { name: 'client-auth-store' }
    )
);