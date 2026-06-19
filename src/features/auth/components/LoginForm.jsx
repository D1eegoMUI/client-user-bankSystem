import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const LoginForm = ({ onForgot, onRegister }) => {
    const navigate = useNavigate();

    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onTouched"
    });

    const onSubmit = async (data) => {
        const res = await login(data);
        if (res.success) {
            navigate("/dashboard");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Correo
                </label>
                <input
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.Email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-emerald-500"
                        }`}
                    {...register("Email", {
                        required: "Este campo es obligatorio",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "El formato de correo no es válido"
                        }
                    })}
                />
                {errors.Email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="font-bold">⚠</span> {errors.Email.message}
                    </p>
                )}
            </div>

            {/* Contraseña */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contraseña
                </label>
                <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.Password ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-emerald-500"
                        }`}
                    {...register("Password", {
                        required: "La contraseña es obligatoria",
                        minLength: {
                            value: 6,
                            message: "Debe tener al menos 6 caracteres"
                        }
                    })}
                />
                {errors.Password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="font-bold">⚠</span> {errors.Password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm shadow-sm"
            >
                {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>

            <div className="flex flex-col items-center gap-2">
                <button
                    type="button"
                    onClick={onForgot}
                    className="text-sm text-emerald-700 hover:underline font-medium"
                >
                    ¿Olvidaste tu contraseña?
                </button>

                <div className="w-full border-t border-gray-100 my-1" />

                <p className="text-sm text-gray-500">
                    ¿No tienes cuenta?{" "}
                    <button
                        type="button"
                        onClick={onRegister}
                        className="text-emerald-700 hover:underline font-medium"
                    >
                        Regístrate
                    </button>
                </p>
            </div>
        </form>
    );
};

export { LoginForm };