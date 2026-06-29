import { useEffect } from 'react';
import { useLoanApplicationStore } from '../../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';
import { PlusCircle, FileText } from 'lucide-react';

const STATUS_STYLES = {
    PENDING:     { label: 'Pendiente',    cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    UNDER_REVIEW:{ label: 'En revisión',  cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    APPROVED:    { label: 'Aprobado',     cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    REJECTED:    { label: 'Rechazado',    cls: 'bg-red-100 text-red-700 border-red-200' },
    CANCELLED:   { label: 'Cancelado',    cls: 'bg-gray-100 text-gray-500 border-gray-200' },
};

export const LoanApplicationList = ({ onCreateNew, onEdit }) => {
    const { applications, getMyLoanApplications, cancelLoanApplication, loading } =
        useLoanApplicationStore();

    useEffect(() => {
        getMyLoanApplications();
    }, []);

    const handleCancel = async (id) => {
        try {
            await cancelLoanApplication(id);
            showSuccess('Solicitud cancelada exitosamente');
        } catch (err) {
            showError(err.response?.data?.message || 'Error al cancelar');
        }
    };

    if (loading) return (
        <div className="p-10 text-center font-bold text-emerald-900">
            Cargando solicitudes...
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">
                        Solicitudes de <span className="text-emerald-600 font-light">Préstamo</span>
                    </h1>
                    <p className="text-gray-500">Gestiona tus solicitudes de financiamiento</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl text-white font-bold transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
                >
                    <PlusCircle size={18} />
                    Nueva Solicitud
                </button>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">
                    <FileText size={48} className="mx-auto mb-4 opacity-30" />
                    Aún no tienes solicitudes de préstamo.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app) => {
                        const status = STATUS_STYLES[app.status] || STATUS_STYLES.PENDING;
                        const isPending = app.status === 'PENDING';

                        return (
                            <div
                                key={app._id}
                                className="bg-white rounded-2xl shadow-sm border border-emerald-50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 overflow-hidden group"
                            >
                                <div className={`h-2 w-full ${isPending ? 'bg-yellow-400' : app.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Monto Solicitado</p>
                                            <p className="text-2xl font-bold text-emerald-900">
                                                GTQ {app.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-lg border ${status.cls}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="space-y-1 mb-5 text-sm text-gray-600">
                                        <p><span className="font-semibold">Plazo:</span> {app.termMonths} meses</p>
                                        <p><span className="font-semibold">Tasa de interés:</span> {(app.interestRate * 100).toFixed(0)}%</p>
                                        <p><span className="font-semibold">Ingreso mensual:</span> GTQ {app.monthlyIncome?.toLocaleString()}</p>
                                        <p><span className="font-semibold">Cuenta destino:</span> {app.account?.accountNumber || '—'}</p>
                                        <p className="text-xs text-gray-400">
                                            Creada: {new Date(app.createdAt).toLocaleDateString('es-GT')}
                                        </p>
                                    </div>

                                    {isPending && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEdit(app)}
                                                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm font-bold rounded-xl border border-emerald-100 transition-colors"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => handleCancel(app._id)}
                                                className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-bold rounded-xl border border-red-100 transition-colors"
                                            >
                                                ✕ Cancelar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};