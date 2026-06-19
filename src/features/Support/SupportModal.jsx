import { BaseModal } from '../../shared/components/BaseModal.jsx';
import { BaseButton } from '../../shared/components/BaseButton.jsx';

export const SupportModal = ({ isOpen, onClose }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Soporte Técnico"
            subtitle="Información de contacto"
            maxWidth="max-w-md"
        >
            <div className="space-y-6">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Horario de atención</p>
                    <p className="text-sm text-emerald-700 font-medium">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <span className="text-2xl text-emerald-600">💬</span>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">WhatsApp</p>
                            <p className="text-emerald-900 font-bold text-lg">+502 3790 0149</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <span className="text-2xl text-emerald-600">📞</span>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Teléfono</p>
                            <p className="text-emerald-900 font-bold text-lg">+502 0149 3790</p>
                        </div>
                    </div>
                </div>

                <BaseButton variant="primary" fullWidth onClick={onClose}>
                    Entendido
                </BaseButton>
            </div>
        </BaseModal>
    );
};