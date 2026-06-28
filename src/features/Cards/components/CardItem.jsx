import { useState, useRef, useEffect } from 'react';
import { Lock, Unlock, ShoppingBag, History } from 'lucide-react';
import { CardVisual } from './CardVisual.jsx';
import { useMyCardStore } from '../../User/Store/ClientStore.js';
import { showConfirmToast } from '../../auth/components/ConfirmModal.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';
import { CardStatusRejectionsModal } from './CardStatusRejectionsModal.jsx';
import { CardPurchasesModal } from './CardPurchasesModal.jsx';

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

export const CardItem = ({ card }) => {
    const { cardStatusRequests, createCardStatusRequest, loadingToggle, getMyCards } = useMyCardStore();

    const [showRejections, setShowRejections] = useState(false);
    const [showPurchases, setShowPurchases] = useState(false);

    const [btnRowRef, btnRowWidth] = useContainerWidth();
    const showBtnText = btnRowWidth > 260;

    const isPendingApproval = !card.isApproved;
    const isPendingToggle = card.pendingStatusRequest === true;

    const rejectedStatusRequests = cardStatusRequests.filter(
        (r) => r.card?._id === card._id && r.status === 'REJECTED'
    );
    const hasRejected = rejectedStatusRequests.length > 0;

    const handleToggle = () => {
        showConfirmToast({
            title: card.isActive ? 'Solicitar Desactivación' : 'Solicitar Activación',
            message: card.isActive
                ? '¿Deseas enviar una solicitud para desactivar esta tarjeta? Quedará pendiente de revisión bancaria.'
                : '¿Deseas enviar una solicitud para volver a activar esta tarjeta? Quedará pendiente de revisión bancaria.',
            onConfirm: async () => {
                try {
                    const result = await createCardStatusRequest({
                        cardId: card._id,
                        requestedStatus: card.isActive ? 'DEACTIVATE' : 'ACTIVATE',
                    });
                    await getMyCards();
                    showSuccess(result.message || 'Solicitud enviada. Pendiente de revisión bancaria.');
                } catch (err) {
                    showError(err?.response?.data?.message || 'Error al enviar la solicitud.');
                }
            },
        });
    };

    const renderStatusBadge = () => {
        if (isPendingApproval) return (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Pendiente de aprobación
            </span>
        );
        if (isPendingToggle) return (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Cambio en revisión
            </span>
        );
        if (card.isActive) return (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activa
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Inactiva
            </span>
        );
    };

    const isToggleDisabled = isPendingApproval || isPendingToggle || loadingToggle;

    const lockBtnClass = isToggleDisabled
        ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
        : card.isActive
            ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white hover:border-red-600'
            : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white hover:border-emerald-600';

    return (
        <>
            <div className="flex flex-col gap-4 animate-fadeIn @container">
                <CardVisual data={card} variant={card.type} />

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">

                    {/* Cuenta + saldo */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Cuenta Vinculada</p>
                            <p className="text-sm font-black text-emerald-900 tracking-tight">
                                {card.account?.accountNumber || 'N/A'}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Saldo en Cuenta</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{card.brand}</p>
                            <p className="text-xl font-black text-emerald-600 italic">
                                Q {card.account?.balance?.toLocaleString() || '0.00'}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Estado + botones */}
                    <div className="flex flex-col gap-3">

                        {/* Fila: badge + ícono de rechazos */}
                        <div className="flex items-center justify-between">
                            {renderStatusBadge()}
                            {hasRejected && (
                                <button
                                    type="button"
                                    onClick={() => setShowRejections(true)}
                                    title="Ver solicitudes rechazadas"
                                    className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-all active:scale-95"
                                >
                                    <History size={14} />
                                </button>
                            )}
                        </div>

                        {/* Fila de botones — íconos solos cuando no hay espacio */}
                        <div ref={btnRowRef} className="flex gap-1.5 overflow-hidden">

                            {/* Bloqueo / Activación */}
                            <button
                                type="button"
                                onClick={handleToggle}
                                disabled={isToggleDisabled}
                                title={
                                    isPendingApproval ? 'Pendiente de aprobación'
                                        : isPendingToggle ? 'Cambio en revisión'
                                            : card.isActive ? 'Solicitar desactivación'
                                                : 'Solicitar activación'
                                }
                                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex-1 min-w-0 overflow-hidden
                                    ${lockBtnClass}
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`}
                            >
                                {card.isActive ? <Lock size={13} className="shrink-0" /> : <Unlock size={13} className="shrink-0" />}
                                {showBtnText && (
                                    <span className="truncate">
                                        {loadingToggle ? 'Enviando...' : card.isActive ? 'Bloquear' : 'Activar'}
                                    </span>
                                )}
                            </button>

                            {/* Ver compras */}
                            <button
                                type="button"
                                onClick={() => setShowPurchases(true)}
                                title="Ver compras"
                                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border-2 border-orange-200 text-orange-600 bg-orange-50 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all active:scale-95 flex-1 min-w-0 overflow-hidden"
                            >
                                <ShoppingBag size={13} className="shrink-0" />
                                {showBtnText && <span className="truncate">Compras</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <CardStatusRejectionsModal
                isOpen={showRejections}
                onClose={() => setShowRejections(false)}
                requests={rejectedStatusRequests}
            />
            <CardPurchasesModal
                isOpen={showPurchases}
                onClose={() => setShowPurchases(false)}
                card={card}
                cardType="DEBIT"
            />
        </>
    );
};