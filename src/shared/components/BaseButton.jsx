/**
 * BaseButton — Botón base compartido
 *
 * Props:
 * @param {string}      variant     - Estilo del botón: 'primary' | 'secondary' | 'danger' | 'ghost' (default: 'primary')
 * @param {string}      size        - Tamaño: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean}     fullWidth   - Ocupa el 100% del ancho (default: false)
 * @param {boolean}     disabled    - Deshabilita el botón
 * @param {boolean}     loading     - Muestra estado de carga y deshabilita el botón
 * @param {string}      loadingText - Texto a mostrar mientras loading=true (default: 'Cargando...')
 * @param {ReactNode}   icon        - Ícono a mostrar a la izquierda del texto (opcional)
 * @param {function}    onClick     - Handler del click
 * @param {string}      type        - Tipo del botón HTML (default: 'button')
 * @param {string}      className   - Clases extra para casos puntuales (usar con moderación)
 * @param {ReactNode}   children    - Texto/contenido del botón
 */

const variants = {
    primary:   'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 border border-transparent',
    secondary: 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 hover:border-emerald-300',
    danger:    'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100 border border-transparent',
    ghost:     'bg-transparent hover:bg-gray-100 text-gray-500 border border-transparent',
};

const sizes = {
    sm: 'px-4 py-1.5 text-xs rounded-lg',
    md: 'px-6 py-2.5 text-sm rounded-xl',
    lg: 'px-8 py-3 text-base rounded-xl',
};

export const BaseButton = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    loadingText = 'Cargando...',
    icon,
    onClick,
    type = 'button',
    className = '',
    children,
}) => {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                inline-flex items-center justify-center gap-2
                font-bold transition-all active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
        >
            {icon && !loading && icon}
            {loading ? loadingText : children}
        </button>
    );
};