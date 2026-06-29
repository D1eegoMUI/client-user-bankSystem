import { useEffect, useMemo, useState } from 'react';
import {
    Minus,
    Package,
    Plus,
    Search,
    ShoppingCart,
} from 'lucide-react';
import { useMyPurchaseStore } from '../../User/Store/ClientStore.js';
import { BaseButton } from '../../../shared/components/BaseButton.jsx';
import { showError, showSuccess } from '../../../shared/utils/toast.jsx';
import { CartSection } from './CartSection.jsx';
import { PurchaseHistory } from './PurchaseHistory.jsx';

const buildPaymentMethods = (debitCards, creditCards) => [
    ...debitCards.map((card) => ({
        key: `DEBIT:${card._id}`,
        id: card.account?._id ?? card.account,      // account._id para descontar saldo
        debitCardId: card._id,                       // card._id para historial por tarjeta
        type: 'DEBIT',
        label: `**** ${card.cardNumber?.slice(-4) ?? '????'}`,
        subtitle: `${card.brand ?? 'DÉBITO'} · ${card.account?.accountNumber ?? ''}`,
        availableLabel: 'Saldo disponible',
        availableAmount: card.account?.balance ?? 0,
        currency: 'GTQ',
        isActive: Boolean(card.isActive && card.isApproved),
    })),
    ...creditCards.map((card) => ({
        key: `CREDIT:${card._id}`,
        id: card._id,
        debitCardId: null,
        type: 'CREDIT',
        label: card.cardNumber || 'Tarjeta sin número',
        subtitle: card.cardHolder || card.bank || 'Tarjeta de crédito',
        availableLabel: 'Crédito disponible',
        availableAmount: card.availableCredit || 0,
        currency: card.currency || 'GTQ',
        isActive: card.status === 'ACTIVE' || card.status === true,
    })),
];

export const PurchaseList = () => {
    const {
        purchaseCatalog,
        debitCards,
        creditCards,
        purchases,
        loadingCatalog,
        loadingPaymentMethods,
        loadingPurchases,
        processingPurchase,
        getPurchaseCatalog,
        getPaymentMethods,
        getPurchasesByCardId,
        processPurchase,
    } = useMyPurchaseStore();

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('TODOS');
    const [cart, setCart] = useState([]);
    const [selectedPaymentKey, setSelectedPaymentKey] = useState('');

    useEffect(() => {
        getPurchaseCatalog();
        getPaymentMethods();
    }, [getPaymentMethods, getPurchaseCatalog]);

    const paymentMethods = useMemo(
        () => buildPaymentMethods(debitCards, creditCards),
        [debitCards, creditCards]
    );

    const selectedPayment = useMemo(
        () => paymentMethods.find((method) => method.key === selectedPaymentKey) || null,
        [paymentMethods, selectedPaymentKey]
    );

    useEffect(() => {
        if (!selectedPaymentKey && paymentMethods.length > 0) {
            setSelectedPaymentKey(paymentMethods[0].key);
        }
    }, [paymentMethods, selectedPaymentKey]);

    // Al cambiar de método de pago, cargar historial de esa tarjeta/cuenta
    useEffect(() => {
        if (selectedPayment?.type === 'DEBIT') {
            getPurchasesByCardId(selectedPayment.id, selectedPayment.debitCardId);
        } else {
            getPurchasesByCardId(selectedPayment?.id);
        }
    }, [getPurchasesByCardId, selectedPayment?.key]);

    const filteredCatalog = useMemo(() => {
        const searchText = search.toLowerCase();
        return purchaseCatalog.filter((item) => {
            const name = item.name || '';
            const description = item.description || '';
            const price = String(item.price || '');
            const matchesType = typeFilter === 'TODOS' || item.type === typeFilter;
            const matchesSearch =
                name.toLowerCase().includes(searchText) ||
                description.toLowerCase().includes(searchText) ||
                price.includes(searchText);
            return matchesType && matchesSearch;
        });
    }, [purchaseCatalog, search, typeFilter]);

    const cartTotal = useMemo(
        () => cart.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0),
        [cart]
    );

    const cartCount = useMemo(
        () => cart.reduce((total, item) => total + item.quantity, 0),
        [cart]
    );

    const addToCart = (product) => {
        if (product.type === 'PRODUCTO' && Number(product.stock || 0) <= 0) {
            showError('Este producto no tiene stock disponible');
            return;
        }
        setCart((currentCart) => {
            const existingProduct = currentCart.find((item) => item._id === product._id);
            if (existingProduct) {
                if (product.type === 'PRODUCTO' && existingProduct.quantity >= Number(product.stock || 0)) {
                    showError('No hay mas stock disponible para este producto');
                    return currentCart;
                }
                return currentCart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, nextQuantity) => {
        const product = cart.find((item) => item._id === productId);
        if (nextQuantity <= 0) {
            setCart((currentCart) => currentCart.filter((item) => item._id !== productId));
            return;
        }
        if (product?.type === 'PRODUCTO' && nextQuantity > Number(product.stock || 0)) {
            showError('No hay mas stock disponible para este producto');
            return;
        }
        setCart((currentCart) =>
            currentCart.map((item) =>
                item._id === productId ? { ...item, quantity: nextQuantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const handlePayCart = async () => {
        if (cart.length === 0) {
            showError('Agrega productos al carrito');
            return;
        }
        if (!selectedPayment) {
            showError('Selecciona una cuenta o tarjeta para pagar');
            return;
        }
        if (!selectedPayment.isActive) {
            showError('El método de pago seleccionado no está activo');
            return;
        }
        if (cartTotal > Number(selectedPayment.availableAmount || 0)) {
            showError('El total supera el disponible del método de pago');
            return;
        }

        const description = cart
            .map((item) => `${item.name} x${item.quantity}`)
            .join(', ');

        try {
            await processPurchase({
                description,
                merchant: 'Carrito de compras',
                amount: cartTotal,
                type: selectedPayment.type,
                cardId: selectedPayment.id,
                // Solo se envía cuando es débito y hay tarjeta física seleccionada
                ...(selectedPayment.type === 'DEBIT' && selectedPayment.debitCardId
                    ? { debitCard: selectedPayment.debitCardId }
                    : {}),
            });

            clearCart();
            await getPaymentMethods();
            if (selectedPayment.type === 'DEBIT') {
                await getPurchasesByCardId(selectedPayment.id, selectedPayment.debitCardId);
            } else {
                await getPurchasesByCardId(selectedPayment.id);
            }
            showSuccess('Compra procesada exitosamente');
        } catch (err) {
            showError(err.response?.data?.message || 'Error al procesar la compra');
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">
                        Tienda de <span className="text-emerald-600 font-light">Compras</span>
                    </h1>
                    <p className="text-gray-500">Elige productos, arma tu carrito y paga con cuenta o tarjeta</p>
                </div>
                <div className="inline-flex items-center gap-2 self-start lg:self-auto px-4 py-2 rounded-xl bg-white border border-emerald-100 text-emerald-700 font-bold text-sm">
                    <ShoppingCart size={18} />
                    {cartCount} productos
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
                <section className="space-y-5">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, descripcion o precio..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                            />
                        </div>
                        <div className="flex gap-2">
                            {['TODOS', 'PRODUCTO', 'SERVICIO'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setTypeFilter(option)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${typeFilter === option
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loadingCatalog ? (
                        <div className="text-center py-20 text-gray-400 font-medium bg-white rounded-2xl border border-gray-100">
                            Cargando productos...
                        </div>
                    ) : filteredCatalog.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 font-medium bg-white rounded-2xl border border-gray-100">
                            No hay productos disponibles para comprar.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                            {filteredCatalog.map((product) => (
                                <article
                                    key={product._id}
                                    className="bg-white rounded-2xl border border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all overflow-hidden"
                                >
                                    <div className="h-2 bg-emerald-500" />
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                                <Package size={21} />
                                            </div>
                                            <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase ${product.type === 'SERVICIO'
                                                ? 'bg-cyan-50 text-cyan-700'
                                                : 'bg-emerald-50 text-emerald-700'
                                                }`}>
                                                {product.type}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-black text-emerald-900 line-clamp-2 min-h-12">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 min-h-8">{product.description}</p>
                                        <p className="text-xs text-gray-400 mt-3">
                                            {product.type === 'PRODUCTO'
                                                ? `${product.stock || 0} disponibles`
                                                : 'Servicio disponible'}
                                        </p>

                                        <div className="flex items-end justify-between gap-3 mt-5">
                                            <div>
                                                <p className="text-gray-400 text-xs">Precio</p>
                                                <p className="text-2xl font-black text-emerald-900">
                                                    Q {Number(product.price || 0).toFixed(2)}
                                                </p>
                                            </div>
                                            <BaseButton
                                                variant="secondary"
                                                size="sm"
                                                icon={<Plus size={15} />}
                                                disabled={product.type === 'PRODUCTO' && Number(product.stock || 0) <= 0}
                                                onClick={() => addToCart(product)}
                                            >
                                                Agregar
                                            </BaseButton>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <aside className="space-y-5 xl:sticky xl:top-24 self-start">
                    <CartSection
                        cart={cart}
                        cartCount={cartCount}
                        cartTotal={cartTotal}
                        selectedPayment={selectedPayment}
                        selectedPaymentKey={selectedPaymentKey}
                        paymentMethods={paymentMethods}
                        loadingPaymentMethods={loadingPaymentMethods}
                        processingPurchase={processingPurchase}
                        setSelectedPaymentKey={setSelectedPaymentKey}
                        clearCart={clearCart}
                        updateQuantity={updateQuantity}
                        handlePayCart={handlePayCart}
                    />

                    <PurchaseHistory
                        selectedPayment={selectedPayment}
                        purchases={purchases}
                        loadingPurchases={loadingPurchases}
                    />
                </aside>
            </div>
        </div>
    );
};