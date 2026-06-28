import { useEffect, useState } from 'react';
import { useMyExtraFinancingStore, useMyAccountStore } from '../../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';

export const ExtraFinancingDetailModal = ({ isOpen, onClose, financing }) => {
    const { details, getDetails, payInstallment, loadingDetails, loadingPayment } = useMyExtraFinancingStore();
    const { accounts, getMyAccounts } = useMyAccountStore();
    const [selectedAccount, setSelectedAccount] = useState('');

    useEffect(() => {
        if (isOpen && financing) {
            getDetails(financing._id);
            getMyAccounts();
            setSelectedAccount('');
        }
    }, [isOpen, financing]);

    const handlePay = async () => {
        if (!selectedAccount) return;
        try {
            await payInstallment({ extraFinancingId: financing._id, accountId: selectedAccount });
            await getDetails(financing._id);
            showSuccess('Cuota pagada exitosamente');
        } catch (e) {
            showError(e?.response?.data?.message || 'Error al pagar la cuota');
        }
    };

    if (!isOpen || !financing) return null;

    const pending = details.filter(d => d.status === 'PENDING');
    const paid    = details.filter(d => d.status === 'PAID');
    const next    = pending[0];

    return (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex justify-center items-center z-[120] px-4 animate-fadeIn">
            <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-emerald-100 animate-slideDown">

                {/* Header */}
                <div
                    className="p-7 text-white flex justify-between items-start"
                    style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 100%)' }}
                >
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Detalle de Cuotas</h2>
                        <p className="text-emerald-100 text-xs opacity-90 uppercase font-black tracking-widest mt-1">
                            Plan: {financing.description}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-emerald-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-3 gap-4 p-6 bg-emerald-50/50 border-b border-emerald-100">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-emerald-800/40 uppercase tracking-tighter">Monto Total</p>
                        <p className="text-lg font-black text-emerald-900 italic">Q {financing.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div className="text-center border-x border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-800/40 uppercase tracking-tighter">Saldo Pendiente</p>
                        <p className="text-lg font-black text-red-600 italic">Q {financing.remainingBalance?.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-emerald-800/40 uppercase tracking-tighter">Mensualidad</p>
                        <p className="text-lg font-black text-emerald-700 italic">Q {financing.monthlyPayment?.toFixed(2)}</p>
                    </div>
                </div>

                {/* Próxima cuota + pago */}
                {next && (
                    <div className="p-6 border-b border-emerald-100 bg-amber-50/30">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                            <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest">
                                Próxima cuota — #{next.installmentNumber} — Q {next.amount?.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={selectedAccount}
                                onChange={e => setSelectedAccount(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 bg-gray-50/50 outline-none font-bold text-emerald-900 cursor-pointer text-sm"
                            >
                                <option value="">Selecciona una cuenta...</option>
                                {accounts.map(a => (
                                    <option key={a._id} value={a._id}>
                                        {a.accountNumber} — Q {a.balance?.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handlePay}
                                disabled={!selectedAccount || loadingPayment || loadingDetails}
                                className="px-10 bg-emerald-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-900 disabled:opacity-50 transition-all active:scale-95"
                            >
                                {loadingPayment ? '...' : 'Pagar'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabla de cuotas */}
                <div className="overflow-y-auto max-h-[38vh]">
                    {loadingDetails ? (
                        <div className="flex flex-col items-center py-10 gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                            <p className="text-emerald-800/40 font-bold text-[10px] uppercase">Cargando cuotas...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="p-4 text-[10px] font-black text-emerald-800/40 uppercase tracking-widest">#</th>
                                    <th className="p-4 text-[10px] font-black text-emerald-800/40 uppercase tracking-widest">Monto</th>
                                    <th className="p-4 text-[10px] font-black text-emerald-800/40 uppercase tracking-widest">Vencimiento</th>
                                    <th className="p-4 text-center text-[10px] font-black text-emerald-800/40 uppercase tracking-widest">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.map(d => (
                                    <tr key={d._id} className="border-b border-gray-50 hover:bg-emerald-50/20 transition-colors">
                                        <td className="p-4 font-black text-xs text-emerald-900/60">#{d.installmentNumber}</td>
                                        <td className="p-4 font-black text-sm text-emerald-950">Q {d.amount?.toFixed(2)}</td>
                                        <td className="p-4 text-xs font-bold text-gray-400">
                                            {new Date(d.expectedDate).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                                                d.status === 'PAID'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {d.status === 'PAID' ? '✓ Pagada' : '⧗ Pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer progreso */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-800/40">
                    <div className="flex gap-4 items-center">
                        <span>Progreso: {paid.length} de {details.length}</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-1000"
                                style={{ width: `${details.length > 0 ? (paid.length / details.length) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                    <span className={financing.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}>
                        {financing.status}
                    </span>
                </div>
            </div>
        </div>
    );
};