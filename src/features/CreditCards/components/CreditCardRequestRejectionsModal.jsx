import { BaseModal } from '../../../shared/components/BaseModal.jsx';

export const CreditCardRequestRejectionsModal = ({ isOpen, onClose, requests = [] }) => {
    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });

    const typeLabel = { CLASSIC: 'Classic', GOLD: 'Gold', PLATINUM: 'Platinum', BLACK: 'Black' };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Solicitudes Rechazadas"
            subtitle="Historial de solicitudes de tarjeta de crédito rechazadas"
            maxWidth="max-w-lg"
        >
            {requests.length === 0 ? (
                <div className="py-10 text-center text-gray-400 font-medium italic text-sm">
                    No hay solicitudes rechazadas.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {requests.map((r) => (
                        <div key={r._id} className="flex flex-col gap-2 border border-red-100 bg-red-50 rounded-2xl p-4">
                            <div className="flex justify-between items-center">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-700 bg-red-100 border border-red-200 px-3 py-1 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {typeLabel[r.cardType] || r.cardType} rechazada
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {formatDate(r.createdAt)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Límite solicitado</p>
                                    <p className="text-sm font-bold text-gray-700">Q {r.requestedCreditLimit?.toLocaleString('es-GT')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Corte</p>
                                    <p className="text-sm font-bold text-gray-700">Día {r.cutoffDate}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Motivo del rechazo</p>
                                <p className="text-sm font-semibold text-red-800">
                                    {r.rejectionReason || 'Sin motivo especificado.'}
                                </p>
                            </div>

                            {r.processedBy && (
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Procesado por</p>
                                    <p className="text-xs font-bold text-gray-600">
                                        {r.processedBy.UserName} {r.processedBy.UserSurname}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </BaseModal>
    );
};