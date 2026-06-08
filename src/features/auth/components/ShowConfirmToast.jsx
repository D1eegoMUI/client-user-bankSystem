import { ArrowRight, RotateCcw } from 'lucide-react';
import { showConfirmToast } from '../../auth/components/ConfirmModal.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

const STATUS_STYLES = {
    COMPLETED: 'bg-emerald-50 text-emerald-700',
    FAILED: 'bg-red-50 text-red-600',
    REVERTED: 'bg-yellow-50 text-yellow-600',
};

const TYPE_LABELS = {
    DEPOSIT: '⬇ Depósito',
    WITHDRAWAL: '⬆ Retiro',
    TRANSFER: '↔ Transferencia',
    SERVICE_PAYMENT: '🔧 Servicio',
    LOAN_PAYMENT: '🏦 Cuota Préstamo',
    CARD_PAYMENT: '💳 Pago Tarjeta',
    FEE: '📋 Comisión',
};

export const TransactionTable = ({ transactions, onRevert }) => {
    const handleRevert = (tx) => {
        showConfirmToast({
            title: 'Revertir Depósito',
            message: `¿Seguro que deseas revertir el depósito #${tx._id.slice(-8).toUpperCase()}? Esta acción solo es posible dentro del primer minuto.`,
            onConfirm: async () => {
                try {
                    await onRevert(tx._id);
                    showSuccess('Depósito revertido exitosamente');
                } catch (e) {
                    showError(e?.response?.data?.message || 'No se pudo revertir el depósito');
                }
            }
        });
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-emerald-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-emerald-50/50 border-b border-emerald-100">
                        <tr>
                            <th className="px-6 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest">ID / Fecha</th>
                            <th className="px-6 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest">Origen → Destino</th>
                            <th className="px-6 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest">Tipo</th>
                            <th className="px-6 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest">Estado</th>
                            <th className="px-6 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest text-right">Monto</th>
                            <th className="px-6 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((tx) => (
                            <tr key={tx._id} className="hover:bg-emerald-50/20 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="text-xs font-black text-emerald-600 font-mono">{tx._id.slice(-8).toUpperCase()}</p>
                                    <p className="text-[10px] text-gray-400">
                                        {new Date(tx.createdAt).toLocaleDateString('es-GT')} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {tx.description && (
                                        <p className="text-[10px] text-gray-400 italic max-w-[120px] truncate">{tx.description}</p>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-900">
                                                {tx.originAccount?.accountNumber || '—'}
                                            </span>
                                            <span className="text-[9px] text-gray-400">{tx.originAccount?.bank || ''}</span>
                                        </div>
                                        <ArrowRight size={12} className="text-emerald-400 shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-900">
                                                {tx.destinationAccount?.accountNumber || '—'}
                                            </span>
                                            <span className="text-[9px] text-gray-400">{tx.destinationAccount?.bank || ''}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-[9px] font-black">
                                        {TYPE_LABELS[tx.type] || tx.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[9px] font-black ${STATUS_STYLES[tx.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <p className="text-sm font-black text-emerald-950">
                                        {tx.currency} {tx.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-[10px] text-emerald-500/70 font-mono">
                                        ≈ Q{tx.amountInGTQ?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {tx.type === 'DEPOSIT' && tx.status === 'COMPLETED' && (
                                        <button
                                            onClick={() => handleRevert(tx)}
                                            title="Revertir depósito (máx. 1 min)"
                                            className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-500 transition-colors"
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};