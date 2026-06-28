import { useEffect, useState } from 'react';
import { useMyCreditCardStore, useMyExtraFinancingStore } from '../../User/Store/ClientStore.js';
import { CreditCardItem } from './CreditCardItem.jsx';
import { RequestCreditCardModal } from './RequestCreditCardModal.jsx';
import { CreditCardRequestRejectionsModal } from './CreditCardRequestRejectionsModal.jsx';
import { BaseButton } from '../../../shared/components/BaseButton.jsx';

export const CreditCardsView = () => {
    const {
        creditCards,
        creditCardRequests,
        creditCardStatusRequests,
        loading,
        getMyCreditCards,
        getMyCreditCardRequests,
        getMyCreditCardStatusRequests,
    } = useMyCreditCardStore();

    const { requests: financingRequests, getMyRequests } = useMyExtraFinancingStore();

    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [showRequestRejections, setShowRequestRejections] = useState(false);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        getMyCreditCards();
        getMyCreditCardRequests();
        getMyCreditCardStatusRequests();
        getMyRequests();
    }, []);

    const filtered = creditCards.filter((c) => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return c.status === 'ACTIVE';
        if (filter === 'BLOCKED') return c.status === 'BLOCKED';
        return true;
    });

    const rejectedCardRequests = creditCardRequests.filter(r => r.status === 'REJECTED');
    const pendingCardRequests = creditCardRequests.filter(r => r.status === 'PENDING');
    const hasRejectedRequests = rejectedCardRequests.length > 0;

    const handleRequestSuccess = () => {
        getMyCreditCardRequests();
    };

    return (
        <div className="flex flex-col gap-8 p-6 animate-fadeIn">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase italic">
                        Mis <span className="text-emerald-600">Tarjetas de Crédito</span>
                    </h1>
                    <p className="text-gray-400 text-xs font-medium mt-0.5">
                        Gestiona tus tarjetas de crédito y líneas de financiamiento
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                    {hasRejectedRequests && (
                        <BaseButton
                            variant="ghost"
                            size="md"
                            onClick={() => setShowRequestRejections(true)}
                            className="text-xs uppercase tracking-widest font-black text-red-500 hover:text-red-700"
                        >
                            Ver solicitudes rechazadas
                        </BaseButton>
                    )}
                    <BaseButton
                        variant="primary"
                        size="md"
                        onClick={() => setIsRequestModalOpen(true)}
                        className="text-xs uppercase tracking-widest font-black"
                    >
                        + Solicitar Tarjeta
                    </BaseButton>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
                {[
                    { value: 'ALL', label: 'Todas' },
                    { value: 'ACTIVE', label: 'Activas' },
                    { value: 'BLOCKED', label: 'Bloqueadas' },
                ].map(opt => (
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
                <div className="text-center py-20 text-gray-400 font-bold">Cargando tus tarjetas...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                    <p className="text-gray-400 font-medium italic">
                        {creditCards.length === 0
                            ? 'Aún no tienes tarjetas de crédito. ¡Solicita tu primera!'
                            : 'No hay tarjetas con el filtro seleccionado.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(card => (
                        <CreditCardItem
                            key={card._id}
                            card={card}
                            allStatusRequests={creditCardStatusRequests}
                            allFinancingRequests={financingRequests}
                        />
                    ))}
                </div>
            )}

            {/* Modales */}
            <RequestCreditCardModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                onSuccess={handleRequestSuccess}
            />
            <CreditCardRequestRejectionsModal
                isOpen={showRequestRejections}
                onClose={() => setShowRequestRejections(false)}
                requests={rejectedCardRequests}
            />
        </div>
    );
};