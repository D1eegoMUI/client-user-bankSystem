import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest } from "../../../shared/Api";
import toast from "react-hot-toast";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            error: null,
            isAuthenticated: false,

            logout: () => {
                set({
                    user: null, token: null, isAuthenticated: false,
                });
                localStorage.removeItem("auth-store");
            },

            login: async ({ Email, Password }) => {
                set({ loading: true, error: null });
                try {
                    const response = await loginRequest({ 
                        email: Email, 
                        password: Password 
                    });
                    
                    const responseData = response.data; 

                    // 1. Extraemos el usuario y el token
                    const user = responseData.user || responseData.data;
                    const token = responseData.token || responseData.accessToken;
                    
                    // 2. BUSCAMOS EL ROL (Aquí está el truco)
                    // .NET suele devolverlo como 'role' o dentro de un objeto 'user'
                    const role = user?.role || user?.userRol || user?.UserRol || responseData.role;

                    console.log("Rol detectado:", role); // Para que lo veas en la consola (F12)

                    // 3. VALIDACIÓN FLEXIBLE
                    // Aceptamos ADMIN, ADMIN_ROLE o lo que sea que Milián haya configurado
                    const isAdmin = role === "ADMIN" || role === "ADMIN_ROLE" || role === "Admin";

                    if (!isAdmin) {
                        const message = "No tienes permisos de administrador";
                        set({ isAuthenticated: false, loading: false, error: message });
                        toast.error(message);
                        return { success: false, error: message };
                    }

                    // Si pasa la validación, guardamos todo
                    set({
                        user: user,
                        token: token,
                        isAuthenticated: true,
                        loading: false,
                    });

                    toast.success("¡Bienvenido al sistema!");
                    return { success: true };

                } catch (error) {
                    console.error("Error en login:", error);
                    const msg = error.response?.data?.message || "Error: Credenciales inválidas";
                    set({ loading: false, error: msg });
                    toast.error(msg);
                    return { success: false, error: msg };
                }
            },
        }),
        { name: "auth-store" }
    )
);