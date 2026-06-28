import { useState, useRef, useEffect } from 'react';
import { Lock, Unlock, DollarSign, ShoppingBag, XCircle, History } from 'lucide-react';
import { CardVisual } from '../../Cards/components/CardVisual.jsx';
import { useMyCreditCardStore } from '../../User/Store/ClientStore.js';
import { showConfirmToast } from '../../auth/components/ConfirmModal.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';
import { CreditCardStatusRejectionsModal } from './CreditCardStatusRejectionsModal.jsx';
import { ExtraFinancingRequestModal } from './ExtraFinancingRequestModal.jsx';
import { ExtraFinancingListModal } from './ExtraFinancingListModal.jsx';
import { CardPurchasesModal } from '../../Cards/components/CardPurchasesModal.jsx';
import { PayCreditCardModal } from './PayCreditCardModal.jsx';

const useContainerWidth = () => {
    const ref = useRef(null);
    const [width, setWidth] = useState(999);
    useEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);
    return [ref, width];
};

export const CreditCardItem = ({ card, allStatusRequests = [], allFinancingRequests = [] }) => {
    const { createCreditCardStatusRequest, loadingToggle, getMyCreditCards } = useMyCreditCardStore();

    const [showRejections, setShowRejections] = useState(false);
    const [showRequestFinancing, setShowRequestFinancing] = useState(false);
    const [showMyFinancings, setShowMyFinancings] = useState(false);
    const [showPurchases, setShowPurchases] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);

    const [btnRowRef, btnRowWidth] = useContainerWidth();
    const showBtnText = btnRowWidth > 260;

    const isActive = card.status === 'ACTIVE';
    const isPendingToggle = card.pendingStatusRequest === true;
    const isCancelled = card.status === 'CANCELLED';

    const rejectedStatusRequests = allStatusRequests.filter(
        (r) => r.card?._id === card._id && r.status === 'REJECTED'
    );
    const hasRejected = rejectedStatusRequests.length > 0;

    const myFinancingRequests = allFinancingRequests.filter(
        (r) => r.creditCard?._id === card._id || r.creditCard === card._id
    );
    const pendingFinancingRequest = myFinancingRequests.find(r => r.status === 'PENDING');
    const rejectedFinancingRequest = myFinancingRequests.find(r => r.status === 'REJECTED');
    const canRequestFinancing = isActive && !isCancelled && !pendingFinancingRequest;

    const handleToggle = () => {
        if (isCancelled || isPendingToggle) return;
        showConfirmToast({
            title: isActive ? 'Solicitar Bloqueo' : 'Solicitar Activación',
            message: isActive
                ? '¿Deseas enviar una solicitud para bloquear esta tarjeta?'
                : '¿Deseas enviar una solicitud para volver a activar esta tarjeta?',
            onConfirm: async () => {
                try {
                    const result = await createCreditCardStatusRequest({
                        cardId: card._id,
                        requestedStatus: isActive ? 'DEACTIVATE' : 'ACTIVATE',
                    });
                    await getMyCreditCards();
                    showSuccess(result.message || 'Solicitud enviada.');
                } catch (err) {
                    showError(err?.response?.data?.message || 'Error al enviar la solicitud.');
                }
            },
        });
    };

    const renderStatusBadge = () => {
        if (isCancelled) return (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Cancelada
            </span>
        );
        if (isPendingToggle) return (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Cambio en revisión
            </span>
        );
        if (isActive) return (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activa
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Bloqueada
            </span>
        );
    };

    const usagePercent = card.creditLimit > 0
        ? Math.min(100, Math.round((card.totalDebt / card.creditLimit) * 100))
        : 0;

    const usageColor = usagePercent >= 90 ? 'bg-red-500'
        : usagePercent >= 60 ? 'bg-amber-400'
            : 'bg-emerald-500';

    const lockBtnClass = isCancelled || isPendingToggle
        ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
        : isActive
            ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white hover:border-red-600'
            : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white hover:border-emerald-600';

    return (
        <>
            <div className="flex flex-col gap-4 animate-fadeIn">

                <CardVisual data={card} variant="CREDIT" />

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">

                    {/* Crédito / Deuda */}
                    <div flex justify-between items-startclassName="">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Crédito disponible</p>
                            <p className="text-xl font-black text-emerald-600 italic">
                                Q {card.availableCredit?.toLocaleString('es-GT') || '0.00'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Deuda actual</p>
                            <p className={`text-xl font-black italic ${card.totalDebt > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                                Q {card.totalDebt?.toLocaleString('es-GT') || '0.00'}
                            </p>
                        </div>
                    </div>

                    {/* Barra de uso */}
                    <div>
                        <div className="flex justify-between mb-1.5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Uso del límite</p>
                            <p className="text-[9px] font-black text-gray-500">{usagePercent}% de Q {card.creditLimit?.toLocaleString('es-GT')}</p>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${usageColor}`}
                                style={{ width: `${usagePercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Corte e interés */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Día de corte</p>
                            <p className="text-sm font-black text-gray-800">Día {card.cutoffDate}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Tasa mensual</p>
                            <p className="text-sm font-black text-blue-600">{card.interestRate}%</p>
                        </div>
                    </div>

                    {/* Alerta financiamiento pendiente */}
                    {pendingFinancingRequest && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                                Solicitud de financiamiento en revisión
                            </p>
                        </div>
                    )}

                    <div className="border-t border-gray-100" />

                    {/* Estado + botones */}
                    <div className="flex flex-col gap-3">

                        {/* Fila: badge + Pagar + historial */}
                        <div className="flex items-center gap-2">
                            {renderStatusBadge()}
                            {!isCancelled && card.totalDebt > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setShowPayModal(true)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-emerald-600 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 hover:border-emerald-700 transition-all active:scale-95 shadow-sm shadow-emerald-100 whitespace-nowrap"
                                >
                                    <XCircle size={13} className="shrink-0" />
                                    Pagar
                                </button>
                            )}
                            {hasRejected && (
                                <button
                                    type="button"
                                    onClick={() => setShowRejections(true)}
                                    title="Ver solicitudes de estado rechazadas"
                                    className="ml-auto w-8 h-8 shrink-0 flex items-center justify-center rounded-xl border-2 border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-all active:scale-95"
                                >
                                    <History size={14} />
                                </button>
                            )}
                        </div>

                        {/* Fila de botones — íconos solos cuando no hay espacio */}
                        <div ref={btnRowRef} className="flex gap-1.5 overflow-hidden">
                            <button
                                type="button"
                                onClick={handleToggle}
                                disabled={isCancelled || isPendingToggle || loadingToggle}
                                title={isPendingToggle ? 'Cambio en revisión' : isActive ? 'Solicitar bloqueo' : 'Solicitar activación'}
                                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex-1 min-w-0 overflow-hidden
                                    ${lockBtnClass}
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`}
                            >
                                {isActive ? <Lock size={13} className="shrink-0" /> : <Unlock size={13} className="shrink-0" />}
                                {showBtnText && (
                                    <span className="truncate">
                                        {loadingToggle ? 'Enviando...' : isActive ? 'Bloquear' : 'Activar'}
                                    </span>
                                )}
                            </button>

                            {!isCancelled && (
                                <button
                                    type="button"
                                    onClick={() => setShowPurchases(true)}
                                    title="Ver compras"
                                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border-2 border-orange-200 text-orange-600 bg-orange-50 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all active:scale-95 flex-1 min-w-0 overflow-hidden"
                                >
                                    <ShoppingBag size={13} className="shrink-0" />
                                    {showBtnText && <span className="truncate">Compras</span>}
                                </button>
                            )}

                            {!isCancelled && (
                                <button
                                    type="button"
                                    onClick={() => setShowMyFinancings(true)}
                                    title="Financiamientos"
                                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border-2 border-emerald-200 text-emerald-700 bg-emerald-50 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all active:scale-95 flex-1 min-w-0 overflow-hidden"
                                >
                                    <DollarSign size={13} className="shrink-0" />
                                    {showBtnText && <span className="truncate">Financ.</span>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modales */}
            <CreditCardStatusRejectionsModal
                isOpen={showRejections}
                onClose={() => setShowRejections(false)}
                requests={rejectedStatusRequests}
            />
            <ExtraFinancingRequestModal
                isOpen={showRequestFinancing}
                onClose={() => setShowRequestFinancing(false)}
                card={card}
                onSuccess={() => { }}
            />
            <ExtraFinancingListModal
                isOpen={showMyFinancings}
                onClose={() => setShowMyFinancings(false)}
                card={card}
                canRequestFinancing={canRequestFinancing}
                rejectedFinancingRequest={rejectedFinancingRequest}
                onRequestNew={() => {
                    setShowMyFinancings(false);
                    setShowRequestFinancing(true);
                }}
            />
            <CardPurchasesModal
                isOpen={showPurchases}
                onClose={() => setShowPurchases(false)}
                card={card}
                cardType="CREDIT"
            />
            <PayCreditCardModal
                isOpen={showPayModal}
                onClose={() => setShowPayModal(false)}
                card={card}
                onSuccess={getMyCreditCards}
            />
        </>
    );
};