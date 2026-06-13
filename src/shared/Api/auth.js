import { axiosAuth } from './api.js'

export const login = async (data) => {
    return await axiosAuth.post("/api/v1/Auth/login", data);
};

export const register = async (data) => {
    return await axiosAuth.post("/api/v1/Auth/register", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const forgotPassword = async (email) => {
    return await axiosAuth.post("/api/v1/Auth/forgot-password", { email });
};

export const resetPassword = async (token, newPassword) => {
    return await axiosAuth.post("/api/v1/Auth/reset-password", { token, newPassword });
};

export const verifyEmail = async (token) => {
    return await axiosAuth.post("/api/v1/Auth/verify-email", { token });
};

// Estas rutas de abajo siguen yendo al 3002 (Node), 
// así que asegúrate que tu axiosAdmin o la lógica de interceptores esté clara
export const updateUserRole = async (userId, roleName) => {
    return await axiosAuth.put(`/users/${userId}/role`, { roleName });
};

export const getAllUsers = async () => {
    const { data } = await axiosAuth.get("/auth/users/")
    return { users: data };
};