import { useEffect } from 'react';
import { useMyAccountStore } from '../User/Store/ClientStore.js';
import { BaseModal } from '../../shared/components/BaseModal.jsx';

export const AccountHistoryModal = ({ accountId, onClose }) => {
    const { history, getMyAccountHistory, loadingHistory } = useMyAccountStore();

    useEffect(() => {
        getMyAccountHistory(accountId);
    }, [accountId]);

    return (
        <BaseModal
            isOpen={true}
            onClose={onClose}
            title="Historial de Movimientos"
            subtitle="Ingresos y egresos de tu cuenta"
            maxWidth="max-w-2xl"
        >
            {loadingHistory ? (
                <div className="text-center py-16 text-gray-400 font-medium">
                    Cargando movimientos...
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-medium">
                    Esta cuenta aún no tiene movimientos registrados.
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map((tx) => (
                        <div
                            key={tx.idTransaccion}
                            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-emerald-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black ${
                                    tx.tipo === 'INGRESO'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-600'
                                }`}>
                                    {tx.tipo === 'INGRESO' ? '↑' : '↓'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{tx.descripcion}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(tx.fecha).toLocaleDateString('es-GT', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <span className={`text-base font-black ${
                                tx.tipo === 'INGRESO' ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                                {tx.montoDisplay}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </BaseModal>
    );
};