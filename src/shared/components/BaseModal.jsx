import { useEffect } from 'react';

/**
 * BaseModal — Modal base compartido
 *
 * Props:
 * @param {boolean}       isOpen        - Controla si el modal es visible
 * @param {function}      onClose       - Función para cerrar el modal
 * @param {string}        title         - Título principal del header
 * @param {string}        subtitle      - Subtítulo debajo del título (opcional)
 * @param {ReactNode}     children      - Contenido del body del modal
 * @param {string}        maxWidth      - Ancho máximo del modal (default: 'max-w-md')
 * @param {boolean}       hideHeader    - Oculta el header si se necesita uno custom (default: false)
 */

export const BaseModal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    maxWidth = 'max-w-md',
    hideHeader = false,
}) => {
    // Bloquear scroll del body mientras el modal está abierto
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Cerrar al hacer click en el backdrop
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto"
            onClick={handleBackdropClick}
        >
            <div className={`w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] my-auto overflow-hidden animate-fadeIn`}>
                
                {/* Header */}
                {!hideHeader && (
                    <div className="flex items-center justify-between gap-4 p-6 bg-emerald-600 text-white flex-shrink-0">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                            {subtitle && (
                                <p className="text-sm text-emerald-100 opacity-90 mt-0.5">{subtitle}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-emerald-200 hover:text-white transition-colors text-3xl leading-none flex-shrink-0"
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Body — el contenido de cada modal va aquí */}
                <div className="p-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};