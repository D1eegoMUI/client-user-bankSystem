import { useState } from "react";

const ForgotPasswordForm = ({ onSwitch }) => {
    return (
        <form className="space-y-5">
            {/* Sección de Email */}
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    required 
                    placeholder="ejemplo@kinal.edu.gt"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
            </div>

            {/* Botón de Acción Principal */}
            <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-4 rounded-lg text-sm font-medium shadow-sm transition-colors duration-200"
            >
                Recuperar Contraseña
            </button>

            {/* Enlace para volver */}
            <div className="text-center text-sm text-gray-600 mt-4">
                <span>¿Recordaste tus datos? </span>
                <button
                    type="button"
                    onClick={onSwitch}
                    className="text-emerald-700 font-semibold hover:underline focus:outline-none"
                >
                    Volver al inicio
                </button>
            </div>
        </form>
    );
}

export { ForgotPasswordForm };