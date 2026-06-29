import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { BaseModal }   from '../../../shared/components/BaseModal.jsx';
import { BaseButton }  from '../../../shared/components/BaseButton.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';
import { useTransactionStore } from '../../User/Store/ClientStore.js';
import { useMyAccountStore }   from '../../User/Store/ClientStore.js';
import { useFavoritesStore }   from '../../User/Store/ClientStore.js';
import { findAccountByNumber } from '../../../shared/Api/client.js';

const INITIAL_FORM = {
    AccountOriginId:   '',
    AccountDestinyId:  '',
    accountNumberDest: '',
    amount:            '',
    currency:          'GTQ',
    description:       '',
};

export const TransferModal = ({ onClose }) => {
    const { createTransfer, loadingTransfer, getMyTransactions } = useTransactionStore();
    const { accounts, getMyAccounts, loading: loadingAccounts } = useMyAccountStore();
    const { favorites, getMyFavorites, loading: loadingFavs } = useFavoritesStore();

    const [form, setForm] = useState(INITIAL_FORM);
    const [showFavorites, setShowFavorites] = useState(false);

    useEffect(() => {
        getMyAccounts();
        getMyFavorites();
    }, []);

    const handleChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSelectFavorite = (fav) => {
        setForm(prev => ({
            ...prev,
            accountNumberDest: fav.account?.accountNumber || '',
            AccountDestinyId:  fav.account?._id || '',
        }));
        setShowFavorites(false);
    };

const handleSubmit = async () => {
    if (!form.AccountOriginId) { showError('Selecciona la cuenta de origen'); return; }
    if (!form.accountNumberDest && !form.AccountDestinyId) { showError('Ingresa o selecciona una cuenta de destino'); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { showError('Ingresa un monto válido mayor a 0'); return; }

    try {
        let destinyId = form.AccountDestinyId;

        // Si no tenemos el _id resuelto (entrada manual), lo buscamos primero
        if (!destinyId) {
            const { data: found } = await findAccountByNumber(form.accountNumberDest.trim());
            if (!found.success) { showError('Cuenta destino no encontrada'); return; }
            destinyId = found.data._id;
        }

        const payload = {
            type:             'TRANSFER',
            amount:           parseFloat(form.amount),
            currency:         form.currency,
            AccountOriginId:  form.AccountOriginId,
            AccountDestinyId: destinyId,
            description:      form.description.trim() || 'Transferencia bancaria',
        };

        await createTransfer(payload);
        showSuccess('¡Transferencia realizada con éxito!');
        getMyTransactions({ page: 1, limit: 10 });
        onClose();
    } catch (err) {
        showError(err.response?.data?.message || 'Error al procesar la transferencia');
    }
};

    return (
        <BaseModal
            isOpen={true}
            onClose={onClose}
            title="Nueva Transferencia"
            subtitle="Envía dinero a otra cuenta bancaria"
            maxWidth="max-w-lg"
        >
            <div className="space-y-5">

                {/* Cuenta origen */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cuenta de origen</label>
                    {loadingAccounts ? (
                        <p className="text-xs text-gray-400">Cargando cuentas...</p>
                    ) : (
                        <select
                            name="AccountOriginId"
                            value={form.AccountOriginId}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
                        >
                            <option value="">-- Selecciona una cuenta --</option>
                            {accounts.filter(acc => acc.status).map(acc => (
                                <option key={acc._id} value={acc._id}>
                                    {acc.accountNumber} — {acc.accountType} ({acc.currency} {acc.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Cuenta destino */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-semibold text-gray-700">Cuenta de destino</label>
                        <button
                            type="button"
                            onClick={() => setShowFavorites(v => !v)}
                            className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-bold transition-colors"
                        >
                            <Star size={13} />
                            {showFavorites ? 'Ingresar manualmente' : 'Usar favorito'}
                        </button>
                    </div>

                    {showFavorites ? (
                        loadingFavs ? (
                            <p className="text-xs text-gray-400">Cargando favoritos...</p>
                        ) : favorites.length === 0 ? (
                            <p className="text-xs text-gray-400 py-3 text-center">No tienes cuentas favoritas guardadas aún.</p>
                        ) : (
                            <div className="border border-emerald-100 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-48 overflow-y-auto">
                                {favorites.map(fav => (
                                    <button
                                        key={fav._id}
                                        type="button"
                                        onClick={() => handleSelectFavorite(fav)}
                                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-emerald-900">{fav.alias}</p>
                                            <p className="text-xs text-gray-400 font-mono">{fav.account?.accountNumber}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">{fav.account?.accountType}</span>
                                    </button>
                                ))}
                            </div>
                        )
                    ) : (
                        <div>
                            <input
                                type="text"
                                name="accountNumberDest"
                                value={form.accountNumberDest}
                                onChange={e => setForm(prev => ({ ...prev, accountNumberDest: e.target.value, AccountDestinyId: '' }))}
                                placeholder="Número de cuenta destino (10 dígitos)"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-300"
                            />
                            <p className="text-xs text-gray-400 mt-1">También puedes elegir una de tus cuentas favoritas con el botón de arriba.</p>
                        </div>
                    )}

                    {form.AccountDestinyId && !showFavorites && (
                        <p className="text-xs text-emerald-600 font-semibold mt-1">
                            ✓ Favorito seleccionado: <span className="font-mono">{form.accountNumberDest}</span>
                        </p>
                    )}
                </div>

                {/* Monto y moneda */}
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Monto</label>
                        <input
                            type="number" name="amount" value={form.amount}
                            onChange={handleChange} min="0.01" step="0.01" placeholder="0.00"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                    </div>
                    <div className="w-28">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Moneda</label>
                        <select
                            name="currency" value={form.currency} onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
                        >
                            <option value="GTQ">GTQ</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="MXN">MXN</option>
                        </select>
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Descripción <span className="font-normal text-gray-400">(opcional)</span>
                    </label>
                    <input
                        type="text" name="description" value={form.description}
                        onChange={handleChange} maxLength={255}
                        placeholder='Ej: "Pago de alquiler"'
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                </div>

                {/* Acciones */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-gray-100">
                    <BaseButton variant="ghost" onClick={onClose}>Cancelar</BaseButton>
                    <BaseButton variant="primary" onClick={handleSubmit} loading={loadingTransfer} loadingText="Procesando...">
                        Confirmar Transferencia
                    </BaseButton>
                </div>
            </div>
        </BaseModal>
    );
};