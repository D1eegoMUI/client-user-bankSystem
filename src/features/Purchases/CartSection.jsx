import {
    ShoppingCart,
    Trash2,
    Minus,
    Plus,
    CreditCard,
    Landmark,
    ReceiptText,
} from 'lucide-react';

import { BaseButton } from '../../shared/components/BaseButton.jsx';

export const CartSection = ({
    cart,
    cartCount,
    cartTotal,
    selectedPayment,
    selectedPaymentKey,
    paymentMethods,
    loadingPaymentMethods,
    processingPurchase,
    setSelectedPaymentKey,
    clearCart,
    updateQuantity,
    handlePayCart,
}) => {
    return (
        <section className="bg-white rounded-2xl border border-emerald-50 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-black text-emerald-900 flex items-center gap-2">
                        <ShoppingCart size={19} />
                        Carrito
                    </h2>
                    <p className="text-xs text-gray-400">{cartCount} productos seleccionados</p>
                </div>

                {cart.length > 0 && (
                    <button
                        type="button"
                        onClick={clearCart}
                        className="text-xs font-bold text-red-500 hover:text-red-600"
                    >
                        Vaciar
                    </button>
                )}
            </div>

            <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
                {cart.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-medium">
                        Tu carrito esta vacio.
                    </div>
                ) : (
                    cart.map((item) => (
                        <div
                            key={item._id}
                            className="rounded-xl bg-gray-50 border border-gray-100 p-3"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">
                                        {item.name}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Q {Number(item.price || 0).toFixed(2)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => updateQuantity(item._id, 0)}
                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                    aria-label="Quitar producto"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateQuantity(item._id, item.quantity - 1)
                                        }
                                        className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:border-emerald-300"
                                    >
                                        <Minus size={14} />
                                    </button>

                                    <span className="w-8 text-center text-sm font-black text-emerald-900">
                                        {item.quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateQuantity(item._id, item.quantity + 1)
                                        }
                                        className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:border-emerald-300"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <span className="text-sm font-black text-emerald-700">
                                    Q {(Number(item.price || 0) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-5 bg-emerald-50/60 border-t border-emerald-100">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-emerald-900">
                        Total a pagar
                    </span>

                    <span className="text-2xl font-black text-emerald-900">
                        Q {cartTotal.toFixed(2)}
                    </span>
                </div>

                <label className="block text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">
                    Metodo de pago
                </label>

                <select
                    value={selectedPaymentKey}
                    onChange={(event) => setSelectedPaymentKey(event.target.value)}
                    disabled={
                        loadingPaymentMethods || paymentMethods.length === 0
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-gray-100"
                >
                    {paymentMethods.length === 0 ? (
                        <option value="">No hay metodos disponibles</option>
                    ) : (
                        paymentMethods.map((method) => (
                            <option
                                key={method.key}
                                value={method.key}
                                disabled={!method.isActive}
                            >
                                {method.type} - {method.label}
                            </option>
                        ))
                    )}
                </select>

                {selectedPayment && (
                    <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                {selectedPayment.type === 'CREDIT' ? (
                                    <CreditCard size={17} />
                                ) : (
                                    <Landmark size={17} />
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-black text-emerald-700 uppercase">
                                    {selectedPayment.availableLabel}
                                </p>

                                <p className="text-xs text-gray-400 truncate">
                                    {selectedPayment.subtitle}
                                </p>
                            </div>
                        </div>

                        <span className="text-sm font-black text-emerald-900">
                            Q {Number(selectedPayment.availableAmount || 0).toFixed(2)}
                        </span>
                    </div>
                )}

                <BaseButton
                    fullWidth
                    className="mt-4"
                    icon={<ReceiptText size={16} />}
                    loading={processingPurchase}
                    loadingText="Procesando..."
                    disabled={cart.length === 0 || !selectedPayment}
                    onClick={handlePayCart}
                >
                    Pagar Carrito
                </BaseButton>
            </div>
        </section>
    );
};