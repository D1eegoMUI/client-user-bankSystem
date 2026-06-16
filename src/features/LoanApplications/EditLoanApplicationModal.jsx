import { useState } from 'react';
import { useLoanApplicationStore } from '../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../shared/utils/toast.jsx';

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
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex justify-center items-center z-50 px-3">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100">
                <div className="p-6 text-white" style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 100%)' }}>
                    <h2 className="text-2xl font-bold">Editar Solicitud</h2>
                    <p className="text-emerald-100 text-sm opacity-90">Solo puedes editar solicitudes pendientes</p>
                </div>

                <div className="p-6 space-y-4">
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
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-60"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};