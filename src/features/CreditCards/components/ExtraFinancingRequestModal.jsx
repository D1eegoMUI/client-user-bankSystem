import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMyExtraFinancingStore } from '../../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';

export const ExtraFinancingRequestModal = ({ isOpen, onClose, card, onSuccess }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { installments: 12 }
    });
    const { createRequest, loading } = useMyExtraFinancingStore();

    useEffect(() => {
        if (isOpen) reset({ installments: 12 });
    }, [isOpen, reset]);

    const onSubmit = async (formData) => {
        try {
            await createRequest({
                creditCard: card._id,
                description: formData.description,
                totalAmount: Number(formData.totalAmount),
                installments: Number(formData.installments),
            });
            showSuccess('Solicitud enviada. Pendiente de aprobación bancaria.');
            onSuccess?.();
            onClose();
        } catch (e) {
            showError(e?.response?.data?.message || 'Error al enviar la solicitud');
        }
    };

    if (!isOpen || !card) return null;

    return (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex justify-center items-center z-[110] px-3 animate-fadeIn">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100 animate-slideDown"
            >
                {/* Header */}
                <div
                    className="p-7 text-white"
                    style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 100%)' }}
                >
                    <h2 className="text-2xl font-bold tracking-tight">Solicitar Financiamiento</h2>
                    <p className="text-emerald-100 text-xs opacity-90 uppercase font-black tracking-widest mt-1">
                        Tarjeta: **** {card.cardNumber?.slice(-4)}
                    </p>
                </div>

                <div className="p-8 space-y-5">
                    {/* Aviso informativo */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                            Tu solicitud será revisada por el banco. Una vez aprobada, el financiamiento estará disponible en tu tarjeta.
                        </p>
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1 tracking-widest">
                            Concepto / Descripción
                        </label>
                        <input
                            {...register('description', { required: true })}
                            type="text"
                            placeholder="Ej. Compra de mobiliario"
                            className={`px-4 py-3.5 rounded-2xl border-2 outline-none font-bold transition-all ${
                                errors.description
                                    ? 'border-red-200 bg-red-50'
                                    : 'border-gray-100 focus:border-emerald-500 bg-gray-50/50 text-emerald-900'
                            }`}
                        />
                    </div>

                    {/* Monto */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1 tracking-widest">
                            Monto a Financiar (GTQ)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-600">Q</span>
                            <input
                                {...register('totalAmount', { required: true, min: 1 })}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 outline-none font-black text-emerald-900 transition-all ${
                                    errors.totalAmount
                                        ? 'border-red-200 bg-red-50'
                                        : 'border-gray-100 focus:border-emerald-500 bg-gray-50/50'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Plazo */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1 tracking-widest">
                            Plazo de pago
                        </label>
                        <select
                            {...register('installments', { required: true })}
                            className="px-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 bg-gray-50/50 outline-none font-bold text-emerald-900 cursor-pointer"
                        >
                            <option value={12}>12 meses</option>
                            <option value={24}>24 meses</option>
                            <option value={36}>36 meses</option>
                            <option value={48}>48 meses</option>
                        </select>
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-emerald-700 font-bold uppercase text-[10px] tracking-widest hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-10 py-3.5 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 uppercase text-[10px] tracking-widest"
                        >
                            {loading ? 'Enviando...' : 'Solicitar'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};