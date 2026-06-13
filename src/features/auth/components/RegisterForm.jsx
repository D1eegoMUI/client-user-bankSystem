import { useForm } from 'react-hook-form';
import { registerClient } from '../../../shared/Api/client';
import toast from 'react-hot-toast';

const RegisterForm = ({ onSwitch }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data) => {
    try {
      await registerClient(data);
      toast.success('Cuenta creada. Revisa tu correo para verificarla.');
      onSwitch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">Nombre</label>
        <input
          type="text"
          placeholder="Juan"
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.UserName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-emerald-500'}`}
          {...register('UserName', { required: 'El nombre es obligatorio' })}
        />
        {errors.UserName && <p className="text-red-500 text-xs mt-1">⚠ {errors.UserName.message}</p>}
      </div>

      {/* Apellido */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">Apellido</label>
        <input
          type="text"
          placeholder="Pérez"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          {...register('UserSurname', { required: 'El apellido es obligatorio' })}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">Correo</label>
        <input
          type="email"
          placeholder="ejemplo@gmail.com"
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.UserEmail ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-emerald-500'}`}
          {...register('UserEmail', { required: 'El correo es obligatorio' })}
        />
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          {...register('UserPassword', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
        />
      </div>

      {/* DPI */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">DPI</label>
        <input
          type="text"
          placeholder="1234 56789 0101"
          className="w-full px-3 py-2 texst-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          {...register('UserDPI', { required: 'El DPI es obligatorio' })}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-lg transition-colors text-sm shadow-sm"
      >
        {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
      </button>
s
      <div className="text-center">
        <button type="button" onClick={onSwitch} className="text-sm text-emerald-700 hover:underline font-medium">
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </form>
  );
};

export { RegisterForm };