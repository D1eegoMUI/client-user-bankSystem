import { useState } from 'react';
import { useLoanApplicationStore } from '../../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';
import { BaseModal } from '../../../shared/components/BaseModal.jsx';
import { BaseButton } from '../../../shared/components/BaseButton.jsx';

export const EditLoanApplicationModal = ({ application, onClose }) => {
    const { updateLoanApplication, loading } = useLoanApplicationStore();

    const [form, setForm] = useState({
        amount: application.amount || '',
        termMonths: application.termMonths || '',
        monthlyIncome: application.monthlyIncome || '',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            await updateLoanApplication(application._id, {
                amount: parseFloat(form.amount),
                termMonths: parseInt(form.termMonths),
                monthlyIncome: parseFloat(form.monthlyIncome),
            });
            showSuccess('Solicitud actualizada exitosamente');
            onClose();
        } catch (err) {
            showError(err.response?.data?.message || 'Error al actualizar');
        }
    };

    return (
        <BaseModal
            isOpen={true}
            onClose={onClose}
            title="Editar Solicitud"
            subtitle="Solo puedes editar solicitudes pendientes"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Monto solicitado (GTQ)</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
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
                        loadingText="Guardando..."
                    >
                        Guardar Cambios
                    </BaseButton>
                </div>
            </div>
        </BaseModal>
    );
};