import { useEffect, useState } from 'react';
import { useLoanApplicationStore } from '../User/Store/ClientStore.js';
import { useMyAccountStore } from '../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../shared/utils/toast.jsx';
import { BaseModal } from '../../shared/components/BaseModal.jsx';
import { BaseButton } from '../../shared/components/BaseButton.jsx';

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
        <BaseModal
            isOpen={true}
            onClose={onClose}
            title="Nueva Solicitud de Préstamo"
            subtitle="Completa los datos para tu solicitud"
        >
            <div className="space-y-4">
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
                    <BaseButton variant="ghost" onClick={onClose}>
                        Cancelar
                    </BaseButton>
                    <BaseButton
                        variant="primary"
                        onClick={handleSubmit}
                        loading={loading}
                        loadingText="Enviando..."
                    >
                        Enviar Solicitud
                    </BaseButton>
                </div>
            </div>
        </BaseModal>
    );
};