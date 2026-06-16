import { useEffect, useState } from 'react';
import { useLoanApplicationStore } from '../User/Store/ClientStore.js';
import { useMyAccountStore } from '../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../shared/utils/toast.jsx';

export const CreateLoanApplicationModal = ({ onClose }) => {
    const { createLoanApplication, loading } = useLoanApplicationStore();
    const { accounts, getMyAccounts } = useMyAccountStore();

    const [form, setForm] = useState({
        account: '',
        amount: '',
        termMonths: '',
        monthlyIncome: '',
    });

    useEffect(() => {
        getMyAccounts();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!form.account || !form.amount || !form.termMonths || !form.monthlyIncome) {
            showError('Por favor completa todos los campos');
            return;
        }
        try {
            await createLoanApplication({
                account: form.account,
                amount: parseFloat(form.amount),
                termMonths: parseInt(form.termMonths),
                monthlyIncome: parseFloat(form.monthlyIncome),
            });
            showSuccess('¡Solicitud de préstamo enviada exitosamente!');
            onClose();
        } catch (err) {
            showError(err.response?.data?.message || 'Error al enviar la solicitud');
        }
    };

    return (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex justify-center items-center z-50 px-3">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100">
                <div className="p-6 text-white" style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 100%)' }}>
                    <h2 className="text-2xl font-bold tracking-tight">Nueva Solicitud de Préstamo</h2>
                    <p className="text-emerald-100 text-sm opacity-90">Completa los datos para tu solicitud</p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Cuenta destino */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cuenta destino</label>
                        <select
                            name="account"
                            value={form.account}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                            <option value="">Selecciona una cuenta</option>
                            {accounts.map((acc) => (
                                <option key={acc._id} value={acc._id}>
                                    {acc.accountNumber} — {acc.accountType}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Monto */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Monto solicitado (GTQ)</label>
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Ej: 10000"
                            min="100"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                    </div>

                    {/* Plazo */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Plazo (meses)</label>
                        <input
                            type="number"
                            name="termMonths"
                            value={form.termMonths}
                            onChange={handleChange}
                            placeholder="Ej: 24"
                            min="1"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                    </div>

                    {/* Ingreso mensual */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ingreso mensual (GTQ)</label>
                        <input
                            type="number"
                            name="monthlyIncome"
                            value={form.monthlyIncome}
                            onChange={handleChange}
                            placeholder="Ej: 5000"
                            min="1"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                    </div>

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