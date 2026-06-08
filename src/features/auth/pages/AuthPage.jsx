import { useState } from "react";
import { LoginForm } from "../components/LoginForm.jsx";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm.jsx";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgot, setIsForgot] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center p-4"
             style={{ background: "linear-gradient(135deg, #064e3b 0%, #047857 100%)" }}>

            <div className="w-full max-w-sm bg-white rounded-2xl border border-white/60 p-8 shadow-2xl">
                
                {/* --- SECCIÓN DEL LOGO --- */}
                <div className="flex justify-center mb-6">
                    <img
                        src="/src/assets/img/Kinal_bank.png" 
                        alt="KinalBank"
                        className="h-32 w-auto object-contain"
                    />
                </div>

                {/* --- TÍTULOS DINÁMICOS --- */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-emerald-900 mb-2">
                        {isForgot
                            ? "Recuperar contraseña"
                            : isLogin
                            ? "Bienvenido"
                            : "Crear cuenta"}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {isForgot
                            ? "Ingresa tu correo para recuperar tu acceso"
                            : isLogin
                            ? "Ingresa a tu cuenta de Kinal Bank"
                            : "Regístrate en Kinal Bank"}
                    </p>
                </div>
                {/* --- SECCIÓN DINÁMICA DE FORMULARIOS --- */}
                <div className="mt-8">
                    {isForgot ? (
                        <ForgotPasswordForm
                            onSwitch={() => {
                                setIsForgot(false); // Vuelve al login al cancelar/terminar
                            }}
                        />
                    ) : (
                        <LoginForm
                            onForgot={() => setIsForgot(true)} // Activa la vista de recuperar
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export { AuthPage };