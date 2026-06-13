import { useForm } from 'react-hook-form';
import { registerClient } from '../../../shared/Api/client.js';
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

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      errors[field] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-emerald-500'
    }`;

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">⚠ {errors[field].message}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Nombre</label>
          <input
            type="text"
            placeholder="Juan"
            className={inputClass('UserName')}
            {...register('UserName', { required: 'Requerido' })}
          />
          <ErrorMsg field="UserName" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Apellido</label>
          <input
            type="text"
            placeholder="Pérez"
            className={inputClass('UserSurname')}
            {...register('UserSurname', { required: 'Requerido' })}
          />
          <ErrorMsg field="UserSurname" />
        </div>
      </div>

      {/* Correo */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">Correo</label>
        <input
          type="email"
          placeholder="ejemplo@gmail.com"
          className={inputClass('UserEmail')}
          {...register('UserEmail', {
            required: 'El correo es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Formato de correo inválido'
            }
          })}
        />
        <ErrorMsg field="UserEmail" />
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          className={inputClass('UserPassword')}
          {...register('UserPassword', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 6, message: 'Mínimo 6 caracteres' }
          })}
        />
        <ErrorMsg field="UserPassword" />
      </div>

      {/* DPI y Teléfono */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">DPI</label>
          <input
            type="text"
            placeholder="1234 56789 0101"
            className={inputClass('UserDPI')}
            {...register('UserDPI', {
              required: 'Requerido',
              maxLength: { value: 15, message: 'Máximo 15 caracteres' }
            })}
          />
          <ErrorMsg field="UserDPI" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Teléfono</label>
          <input
            type="tel"
            placeholder="5555-1234"
            className={inputClass('UserPhone')}
            {...register('UserPhone', {
              required: 'Requerido',
              maxLength: { value: 15, message: 'Máximo 15 caracteres' }
            })}
          />
          <ErrorMsg field="UserPhone" />
        </div>
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">Dirección</label>
        <input
          type="text"
          placeholder="Zona 10, Ciudad de Guatemala"
          className={inputClass('UserAddress')}
          {...register('UserAddress', { required: 'La dirección es obligatoria' })}
        />
        <ErrorMsg field="UserAddress" />
      </div>

      {/* Trabajo e Ingresos */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Trabajo</label>
          <input
            type="text"
            placeholder="Desarrollador"
            className={inputClass('UserJob')}
            {...register('UserJob', { required: 'Requerido' })}
          />
          <ErrorMsg field="UserJob" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Ingresos (Q)</label>
          <input
            type="number"
            placeholder="3000"
            min="100"
            className={inputClass('UserIncome')}
            {...register('UserIncome', {
              required: 'Requerido',
              min: { value: 100, message: 'Mínimo Q100' },
              valueAsNumber: true
            })}
          />
          <ErrorMsg field="UserIncome" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-lg transition-colors text-sm shadow-sm"
      >
        {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitch}
          className="text-sm text-emerald-700 hover:underline font-medium"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>

    </form>
  );
};

export { RegisterForm };