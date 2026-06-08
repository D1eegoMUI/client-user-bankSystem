const SupportModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-emerald-900">Soporte Técnico</h2>
                        <p className="text-xs text-gray-500">Información de contacto</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-emerald-600 transition-colors text-2xl font-light"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Horarios */}
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Horario de atención</p>
                        <p className="text-sm text-emerald-700 font-medium">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                    </div>

                    {/* Canales de contacto (Solo informativos) */}
                    <div className="space-y-3">
                        {/* WhatsApp */}
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                            <span className="text-2xl text-emerald-600">💬</span>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">WhatsApp</p>
                                <p className="text-emerald-900 font-bold text-lg">+502 3790 0149</p>
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                            <span className="text-2xl text-emerald-600">📞</span>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Teléfono</p>
                                <p className="text-emerald-900 font-bold text-lg">+502 0149 3790</p>
                            </div>
                        </div>
                    </div>

                    {/* Botón de cierre */}
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export { SupportModal };