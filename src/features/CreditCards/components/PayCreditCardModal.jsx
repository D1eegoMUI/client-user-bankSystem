import { useEffect, useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { useMyAccountStore } from '../../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';
import * as clientApi from '../../../shared/Api/client.js';

export const PayCreditCardModal = ({ isOpen, onClose, card, onSuccess }) => {
    const { accounts, getMyAccounts } = useMyAccountStore();
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [amount, setAmount]                       = useState('');
    const [loading, setLoading]                     = useState(false);
    const [error, setError]                         = useState('');

    useEffect(() => {
        if (isOpen) {
            getMyAccounts();
            setSelectedAccountId('');
            setAmount('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen || !card) return null;

    const selectedAccount = accounts.find(a => a._id === selectedAccountId);
    const maxAmount       = card.totalDebt || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const numAmount = Number(amount);
        if (!selectedAccountId) return setError('Selecciona una cuenta de origen.');
        if (!numAmount || numAmount <= 0) return setError('Ingresa un monto válido.');
        if (numAmount > maxAmount) return setError(`El monto no puede superar la deuda (Q ${maxAmount.toLocaleString('es-GT')}).`);
        if (selectedAccount && numAmount > selectedAccount.balance) return setError('Saldo insuficiente en la cuenta seleccionada.');

        setLoading(true);
        try {
            await clientApi.payCreditCard({
                creditCardId: card._id,
                accountId: selectedAccountId,
                amount: numAmount,
            });
            showSuccess('Pago realizado con éxito.');
            onSuccess?.();
            onClose();
        } catch (err) {
            showError(err?.response?.data?.message || 'Error al procesar el pago.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex justify-center items-center z-[120] px-4 animate-fadeIn">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100 animate-slideDown"
            >
                {/* Header */}
                <div
                    className="p-7 text-white"
                    style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 100%)' }}
                >
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Wallet size={22} /> Pago de Tarjeta
                    </h2>
                    <p className="text-emerald-100 text-xs opacity-90 uppercase font-black tracking-widest mt-1">
                        **** **** **** {card.cardNumber?.slice(-4)}
                    </p>
                </div>

                <div className="p-8 space-y-6">

                    {/* Resumen deuda / crédito */}
                    <div className="grid grid-cols-2 gap-4 bg-emerald-50/50 border border-emerald-100 rounded-[1.5rem] p-5">
                        <div className="border-r border-emerald-100">
                            <p className="text-[10px] font-black text-emerald-800/50 uppercase tracking-widest mb-1">Deuda Total</p>
                            <p className="text-lg font-black text-red-600 italic">
                                Q {card.totalDebt?.toLocaleString('es-GT') || '0.00'}
                            </p>
                        </div>
                        <div className="pl-4 text-right">
                            <p className="text-[10px] font-black text-emerald-800/50 uppercase tracking-widest mb-1">Cupo Disp.</p>
                            <p className="text-lg font-black text-emerald-700 italic">
                                Q {card.availableCredit?.toLocaleString('es-GT') || '0.00'}
                            </p>
                        </div>
                    </div>

                    {/* Sin deuda */}
                    {maxAmount === 0 && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                            <p className="text-sm font-black text-emerald-700">¡Tu tarjeta no tiene deuda pendiente!</p>
                        </div>
                    )}

                    {maxAmount > 0 && (
                        <div className="space-y-5">
                            {/* Selector de cuenta */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Cuenta de Origen
                                </label>
                                <div className="relative">
                                    <CreditCard size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={selectedAccountId}
                                        onChange={e => setSelectedAccountId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 outline-none font-bold text-gray-700 bg-gray-50/50 transition-all appearance-none"
                                    >
                                        <option value="">— Selecciona una cuenta —</option>
                                        {accounts.map(a => (
                                            <option key={a._id} value={a._id}>
                                                {a.accountNumber} — Q {a.balance?.toLocaleString('es-GT')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedAccount && (
                                    <p className="text-[10px] font-bold text-emerald-600 ml-1">
                                        Saldo disponible: Q {selectedAccount.balance?.toLocaleString('es-GT')}
                                    </p>
                                )}
                                {accounts.length === 0 && (
                                    <p className="text-[10px] font-bold text-amber-500 ml-1">
                                        No tienes cuentas disponibles para pagar.
                                    </p>
                                )}
                            </div>

                            {/* Monto */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Monto a Abonar (GTQ)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-600">Q</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={maxAmount}
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder={`Máx. Q ${maxAmount.toLocaleString('es-GT')}`}
                                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 outline-none font-black text-gray-700 bg-gray-50/50 transition-all"
                                    />
                                </div>
                                {/* Acceso rápido: pagar total */}
                                <button
                                    type="button"
                                    onClick={() => setAmount(String(maxAmount))}
                                    className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 ml-1 text-left transition-colors"
                                >
                                    Pagar deuda completa (Q {maxAmount.toLocaleString('es-GT')})
                                </button>
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                    {error}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Acciones */}
                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-emerald-700 font-bold uppercase text-[10px] tracking-widest hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || maxAmount === 0 || accounts.length === 0}
                            className="px-10 py-3.5 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 uppercase text-[10px] tracking-widest"
                        >
                            {loading ? 'Procesando...' : 'Confirmar Pago'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};