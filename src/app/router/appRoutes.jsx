import { Route, Routes, Navigate } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { DashboardPage } from "../layouts/DashboardPage.jsx";
// import { ProtectedRoute } from "../../shared/utils/ProtectedRoute.jsx"; 

export const AppRoutes = () => {
    return (
        <Routes>
            {/* RUTA PÚBLICA */}
            <Route path="/" element={<AuthPage />} />

            {/* RUTAS DEL DASHBOARD PROTEGIDAS */}
            <Route 
                path="/dashboard" 
                element={
                        <DashboardPage />
                }
            >
                {/* Estas sub-rutas heredan la protección del padre */}

            </Route>

            {/* Manejo de errores 404 */}
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
    );
}