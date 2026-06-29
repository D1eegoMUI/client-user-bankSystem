import { useState } from 'react';
import { useMyAccountStore } from '../../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';
import { BaseButton } from '../../../shared/components/BaseButton.jsx';

export const OpenAccountModal = ({ onClose }) => {
    const { openMyAccount, loading } = useMyAccountStore(); // ⬅️ FIX: esto faltaba
    const [accountType, setAccountType] = useState('AHORRO');
    const [currency, setCurrency] = useState('GTQ');
    const [bank] = useState('Banco Kinal'); // fijo, sin select

    const handleSubmit = async () => {
        try {
            await openMyAccount({ accountType, currency, bank });
            showSuccess('¡Tu solicitud fue enviada y está pendiente de aprobación!');
            onClose();
        } catch (err) {
            showError(err.response?.data?.message || 'Error al enviar la solicitud');
        }
    };

    const types = [
        { value: 'AHORRO', label: 'Cuenta de Ahorro', desc: 'Ideal para guardar y hacer crecer tu dinero con seguridad.', icon: '🏦' },
        { value: 'MONETARIA', label: 'Cuenta Monetaria', desc: 'Perfecta para operaciones diarias, pagos y transferencias.', icon: '💳' }
    ];

    const currencies = [
        { code: 'GTQ', name: 'Quetzal Guatemalteco' },
        { code: 'USD', name: 'Dólar Estadounidense' },
        { code: 'EUR', name: 'Euro' }
    ];

    return (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex justify-center items-center z-50 px-3">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100">
                <div className="p-6 text-white" style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 100%)' }}>
                    <h2 className="text-2xl font-bold tracking-tight">Abrir Nueva Cuenta</h2>
                    <p className="text-emerald-100 text-sm opacity-90">Elige el tipo de cuenta que mejor se adapte a ti</p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Selector de tipo */}
                    <div className="space-y-3">
                        {types.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setAccountType(type.value)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${accountType === type.value
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 hover:border-emerald-300 bg-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{type.icon}</span>
                                    <div>
                                        <p className={`font-bold text-sm ${accountType === type.value ? 'text-emerald-800' : 'text-gray-700'}`}>
                                            {type.label}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">{type.desc}</p>
                                    </div>
                                    {accountType === type.value && (
                                        <span className="ml-auto text-emerald-600 font-black text-lg">✓</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Selector de moneda — NUEVO */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Moneda
                        </label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                            {currencies.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.code} - {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <p className="text-xs text-gray-400 text-center">
                        Tu cuenta se abrirá en <strong>{bank}</strong>. El número de cuenta se generará automáticamente
                        al aprobarse la solicitud. El saldo inicial es Q0.00.
                    </p>

                    {/* Acciones */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-60"
                        >
                            {loading ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};