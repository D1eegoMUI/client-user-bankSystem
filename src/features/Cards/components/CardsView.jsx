import { useEffect, useState } from 'react';
import { useMyCardStore } from '../../User/Store/ClientStore.js';
import { CardItem } from './CardItem.jsx';
import { RequestCardModal } from './RequestCardModal.jsx';
import { CardRequestRejectionsModal } from './CardRequestRejectionsModal.jsx';
import { BaseButton } from '../../../shared/components/BaseButton.jsx';

export const CardsView = () => {
    const {
        cards,
        getMyCards,
        loading,
        cardRequests,
        getMyCardRequests,
        getMyCardStatusRequests,
    } = useMyCardStore();

    const [isDebitModalOpen, setIsDebitModalOpen] = useState(false);
    const [showCardRequestRejections, setShowCardRequestRejections] = useState(false);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        getMyCards();
        getMyCardRequests();
        getMyCardStatusRequests();
    }, []);

    // Solo tarjetas de débito
    const debitCards = cards.filter((c) => c.type === 'DEBIT');

    const filtered = debitCards.filter((c) => {
        if (filter === 'ALL')      return true;
        if (filter === 'ACTIVE')   return c.isActive && c.isApproved;
        if (filter === 'INACTIVE') return !c.isActive && c.isApproved;
        return true;
    });

    const rejectedCardRequests = cardRequests.filter((r) => r.status === 'REJECTED');
    const hasRejectedCardRequest = rejectedCardRequests.length > 0;

    return (
        <div className="flex flex-col gap-8 p-6 animate-fadeIn">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase italic">
                        Mis <span className="text-emerald-600">Tarjetas de Débito</span>
                    </h1>
                    <p className="text-gray-400 text-xs font-medium mt-0.5">
                        Gestiona tus tarjetas débito vinculadas a tus cuentas
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {hasRejectedCardRequest && (
                        <BaseButton
                            variant="ghost"
                            size="md"
                            onClick={() => setShowCardRequestRejections(true)}
                            className="text-xs uppercase tracking-widest font-black text-red-500 hover:text-red-700"
                        >
                            Ver solicitudes rechazadas
                        </BaseButton>
                    )}
                    <BaseButton
                        variant="primary"
                        size="md"
                        onClick={() => setIsDebitModalOpen(true)}
                        className="text-xs uppercase tracking-widest font-black"
                    >
                        + Solicitar Tarjeta
                    </BaseButton>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { value: 'ALL',      label: 'Todas' },
                    { value: 'ACTIVE',   label: 'Activas' },
                    { value: 'INACTIVE', label: 'Inactivas' },
                ].map((opt) => (
                    <BaseButton
                        key={opt.value}
                        variant={filter === opt.value ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setFilter(opt.value)}
                        className="text-[10px] uppercase tracking-widest font-black"
                    >
                        {opt.label}
                    </BaseButton>
                ))}
            </div>

            {/* Grid de tarjetas */}
            {loading ? (
                <div className="text-center py-20 text-gray-400 font-bold">
                    Cargando tus tarjetas...
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                    <p className="text-gray-400 font-medium italic">
                        {debitCards.length === 0
                            ? 'Aún no tienes tarjetas de débito. ¡Solicita tu primera!'
                            : 'No hay tarjetas con el filtro seleccionado.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((card) => (
                        <CardItem key={card._id} card={card} />
                    ))}
                </div>
            )}

            <RequestCardModal
                isOpen={isDebitModalOpen}
                onClose={() => {
                    setIsDebitModalOpen(false);
                    getMyCards();
                    getMyCardRequests();
                }}
            />

            <CardRequestRejectionsModal
                isOpen={showCardRequestRejections}
                onClose={() => setShowCardRequestRejections(false)}
                requests={rejectedCardRequests}
            />
        </div>
    );
};