import { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useMyPurchaseStore } from '../../User/Store/ClientStore.js';

export const CardPurchasesModal = ({ isOpen, onClose, card, cardType = 'DEBIT' }) => {
    const { purchases, getPurchasesByCardId, loadingPurchases } = useMyPurchaseStore();

    // Para crédito: cardId = card._id
    // Para débito:  cardId = account._id (para que el backend verifique propiedad)
    //               debitCardId = card._id (para filtrar solo movimientos de esta tarjeta)
    const accountId   = cardType === 'DEBIT' ? card?.account?._id : card?._id;
    const debitCardId = cardType === 'DEBIT' ? card?._id : null;

    useEffect(() => {
        if (isOpen && accountId) getPurchasesByCardId(accountId, debitCardId);
    }, [isOpen, accountId, debitCardId]);

    if (!isOpen || !card) return null;

    const totalAmount = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <div className="fixed inset-0 bg-orange-950/40 backdrop-blur-sm flex justify-center items-center z-[110] px-4 animate-fadeIn">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-orange-100 animate-slideDown">

                {/* Header */}
                <div
                    className="p-7 text-white flex justify-between items-center"
                    style={{ background: 'linear-gradient(90deg, #9a3412 0%, #ea580c 100%)' }}
                >
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight italic uppercase flex items-center gap-2">
                            <ShoppingBag size={22} /> Historial de Compras
                        </h2>
                        <p className="text-orange-100 text-xs opacity-90 uppercase font-black tracking-widest mt-1">
                            Tarjeta: **** {card.cardNumber?.slice(-4)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-orange-200 transition-all hover:rotate-90 duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Resumen */}
                <div className="bg-orange-50/50 p-6 flex justify-between items-center border-b border-orange-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-orange-800/50 uppercase tracking-widest">Total de consumos</span>
                        <span className="text-2xl font-black text-orange-700 italic">
                            Q {totalAmount.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl border border-orange-100 shadow-sm">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Transacciones: </span>
                        <span className="text-sm font-black text-orange-600">{purchases.length}</span>
                    </div>
                </div>

                {/* Lista */}
                <div className="overflow-y-auto max-h-[50vh]">
                    {loadingPurchases ? (
                        <div className="flex flex-col items-center py-12 gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
                            <p className="text-orange-800/40 font-bold text-[10px] uppercase">Sincronizando movimientos...</p>
                        </div>
                    ) : purchases.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 italic font-medium">No se registran movimientos para esta tarjeta</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Establecimiento</th>
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                                    <th className="p-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map(p => (
                                    <tr key={p._id} className="border-b border-gray-50 hover:bg-orange-50/20 transition-colors group">
                                        <td className="p-4">
                                            <p className="font-black text-sm text-gray-800 uppercase tracking-tight">{p.merchant || 'Comercio Local'}</p>
                                            <p className="text-[10px] text-gray-400 font-bold italic">{p.description}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs font-bold text-gray-500">
                                                {new Date(p.date || p.createdAt).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </td>
                                        <td className="p-4 text-right">
                                            <p className="font-black text-sm text-orange-600 group-hover:scale-110 transition-transform">
                                                Q {p.amount?.toLocaleString()}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Kinal Bank — Detalle de Movimientos</p>
                </div>
            </div>
        </div>
    );
};