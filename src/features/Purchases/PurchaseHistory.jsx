import { CalendarDays } from 'lucide-react';

export const PurchaseHistory = ({
    selectedPayment,
    purchases,
    loadingPurchases,
}) => {
    return (
        <section className="bg-white rounded-2xl border border-emerald-50 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-black text-emerald-900">
                    Historial reciente
                </h2>

                <p className="text-xs text-gray-400">
                    {selectedPayment
                        ? selectedPayment.label
                        : 'Selecciona un metodo de pago'}
                </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {!selectedPayment ? (
                    <div className="text-center py-10 text-gray-400 font-medium">
                        Selecciona un metodo de pago.
                    </div>
                ) : loadingPurchases ? (
                    <div className="text-center py-10 text-gray-400 font-medium">
                        Cargando historial...
                    </div>
                ) : purchases.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-medium">
                        Sin compras registradas.
                    </div>
                ) : (
                    purchases.slice(0, 5).map((purchase) => (
                        <div
                            key={purchase._id}
                            className="p-4 border-b border-gray-50 last:border-b-0"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">
                                        {purchase.description}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        {purchase.merchant || 'Comercio Local'}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        <CalendarDays size={12} />
                                        {new Date(
                                            purchase.date || purchase.createdAt
                                        ).toLocaleDateString('es-GT')}
                                    </p>
                                </div>

                                <span className="text-sm font-black text-red-500">
                                    - Q {Number(purchase.amount || 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};