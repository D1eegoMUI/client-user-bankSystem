import { useEffect, useState } from 'react';
import { DollarSign, XCircle, PlusCircle } from 'lucide-react';
import { useMyExtraFinancingStore } from '../../User/Store/ClientStore.js';
import { ExtraFinancingDetailModal } from './ExtraFinancingDetailModal.jsx';

export const ExtraFinancingListModal = ({
    isOpen,
    onClose,
    card,
    canRequestFinancing = false,
    rejectedFinancingRequest = null,
    onRequestNew,
}) => {
    const { financings, getFinancingsByCard, loading } = useMyExtraFinancingStore();
    const [detailModal, setDetailModal] = useState({ open: false, financing: null });
    const [tab, setTab] = useState('active'); // 'active' | 'rejected'

    useEffect(() => {
        if (isOpen && card) {
            getFinancingsByCard(card._id);
            setTab('active');
        }
    }, [isOpen, card]);

    if (!isOpen || !card) return null;

    return (
        <>
            <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex justify-center items-center z-[110] px-4 animate-fadeIn">
                <div className="bg-white rounded-[2rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-emerald-100 animate-slideDown">

                    {/* Header */}
                    <div
                        className="p-7 text-white flex justify-between items-center"
                        style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 100%)' }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Mis Financiamientos</h2>
                            <p className="text-emerald-100 text-xs opacity-90 uppercase font-black tracking-widest mt-1">
                                Tarjeta: **** {card.cardNumber?.slice(-4)}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-white hover:text-emerald-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs + Botón solicitar */}
                    <div className="px-8 pt-6 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setTab('active')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                                    ${tab === 'active'
                                        ? 'bg-emerald-600 text-white shadow'
                                        : 'text-gray-500 hover:text-gray-800 bg-gray-100'}`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <DollarSign size={12} /> Activos
                                </span>
                            </button>
                            {rejectedFinancingRequest && (
                                <button
                                    onClick={() => setTab('rejected')}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                                        ${tab === 'rejected'
                                            ? 'bg-red-500 text-white shadow'
                                            : 'text-red-500 hover:text-red-700 bg-red-50'}`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <XCircle size={12} /> Rechazados
                                    </span>
                                </button>
                            )}
                        </div>

                        {canRequestFinancing && (
                            <button
                                onClick={() => { onClose(); onRequestNew?.(); }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-emerald-600 text-emerald-700 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                            >
                                <PlusCircle size={14} />
                                Solicitar nuevo
                            </button>
                        )}
                    </div>

                    {/* Contenido */}
                    <div className="overflow-y-auto max-h-[55vh] p-8 space-y-4">

                        {/* Tab: activos */}
                        {tab === 'active' && (
                            loading ? (
                                <div className="flex flex-col items-center py-12 gap-3">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
                                    <p className="text-emerald-800/40 font-bold text-xs uppercase tracking-widest">Cargando...</p>
                                </div>
                            ) : financings.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-emerald-50 rounded-[2rem]">
                                    <p className="text-emerald-800/30 font-medium italic">No tienes financiamientos activos para esta tarjeta</p>
                                    {canRequestFinancing && (
                                        <button
                                            onClick={() => { onClose(); onRequestNew?.(); }}
                                            className="mt-4 flex items-center gap-1.5 mx-auto px-5 py-2 rounded-xl border-2 border-emerald-300 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                                        >
                                            <PlusCircle size={14} />
                                            Solicitar tu primer financiamiento
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {financings.map(f => (
                                        <div key={f._id} className="group bg-gray-50/50 hover:bg-emerald-50/30 border border-gray-100 hover:border-emerald-200 rounded-2xl p-5 flex justify-between items-center transition-all">
                                            <div className="space-y-1">
                                                <p className="font-black text-emerald-900 uppercase text-sm tracking-tight">{f.description}</p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-xs font-bold text-gray-500">
                                                        Monto: <span className="text-emerald-700 font-black">Q{f.totalAmount?.toLocaleString()}</span>
                                                    </p>
                                                    <span className="text-gray-300">|</span>
                                                    <p className="text-xs font-bold text-gray-500">
                                                        Cuotas: <span className="text-emerald-700 font-black">{f.installments} x Q{f.monthlyPayment?.toFixed(2)}</span>
                                                    </p>
                                                </div>
                                                <span className={`inline-block text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mt-1 ${
                                                    f.status === 'PAID'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {f.status}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setDetailModal({ open: true, financing: f })}
                                                className="px-6 py-3 bg-white border border-emerald-100 text-emerald-700 rounded-xl font-black text-[10px] uppercase shadow-sm hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                                            >
                                                Ver Cuotas
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {/* Tab: rechazados */}
                        {tab === 'rejected' && rejectedFinancingRequest && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <XCircle size={18} className="text-red-500 flex-shrink-0" />
                                    <p className="text-sm font-black text-red-700 uppercase tracking-widest">Solicitud rechazada</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="bg-white rounded-xl p-3 border border-red-100">
                                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Concepto</p>
                                        <p className="font-semibold text-gray-800">{rejectedFinancingRequest.description || '—'}</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-3 border border-red-100">
                                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Monto solicitado</p>
                                        <p className="font-black text-red-600">Q {rejectedFinancingRequest.totalAmount?.toLocaleString('es-GT')}</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-3 border border-red-100">
                                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Cuotas</p>
                                        <p className="font-black text-gray-700">{rejectedFinancingRequest.installments} meses</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-3 border border-red-100">
                                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Fecha</p>
                                        <p className="font-semibold text-gray-600">
                                            {new Date(rejectedFinancingRequest.createdAt).toLocaleDateString('es-GT', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {rejectedFinancingRequest.rejectionReason && (
                                    <div className="bg-white border border-red-100 rounded-xl p-3">
                                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Motivo del rechazo</p>
                                        <p className="text-sm text-red-700 font-semibold">{rejectedFinancingRequest.rejectionReason}</p>
                                    </div>
                                )}
                                {canRequestFinancing && (
                                    <button
                                        onClick={() => { onClose(); onRequestNew?.(); }}
                                        className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-emerald-500 text-emerald-700 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                                    >
                                        <PlusCircle size={14} />
                                        Volver a solicitar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Kinal Bank — 2026</p>
                    </div>
                </div>
            </div>

            <ExtraFinancingDetailModal
                isOpen={detailModal.open}
                financing={detailModal.financing}
                onClose={() => setDetailModal({ open: false, financing: null })}
            />
        </>
    );
};