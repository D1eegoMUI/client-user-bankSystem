import { useEffect } from 'react';
import { Landmark, ChevronRight } from 'lucide-react';
import { useLoansStore } from '../User/Store/ClientStore.js';
import { BaseButton }    from '../../shared/components/BaseButton.jsx';

const STATUS_STYLES = {
    ACTIVE:    { label: 'Activo',  cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    PAID:      { label: 'Pagado',  cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    DEFAULTED: { label: 'En mora', cls: 'bg-red-100 text-red-700 border-red-200' },
};

const HEADER_COLORS = {
    ACTIVE:    'bg-emerald-500',
    PAID:      'bg-blue-400',
    DEFAULTED: 'bg-red-400',
};

const calcProgress = (amount, remaining) => {
    if (!amount || amount === 0) return 0;
    return Math.max(0, Math.min(100, ((amount - remaining) / amount) * 100));
};

export const LoanList = ({ onViewDetail }) => {
    const { loans, getMyLoans, loading } = useLoansStore();

    useEffect(() => {
        getMyLoans();
    }, []);

    if (loading) return (
        <div className="p-10 text-center font-bold text-emerald-900">
            Cargando préstamos...
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">
                        Mis <span className="text-emerald-600 font-light">Préstamos Activos</span>
                    </h1>
                    <p className="text-gray-500">Consulta el estado y cuotas de tus préstamos vigentes</p>
                </div>
            </div>

            {loans.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">
                    <Landmark size={48} className="mx-auto mb-4 opacity-30" />
                    No tienes préstamos registrados.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loans.map((loan) => {
                        const status    = STATUS_STYLES[loan.status] || STATUS_STYLES.ACTIVE;
                        const headerCls = HEADER_COLORS[loan.status] || HEADER_COLORS.ACTIVE;
                        const progress  = calcProgress(loan.amount, loan.remainingBalance);

                        return (
                            <div
                                key={loan._id}
                                className="bg-white rounded-2xl shadow-sm border border-emerald-50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 overflow-hidden group"
                            >
                                <div className={`h-2 w-full ${headerCls} transition-all group-hover:h-3`} />

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Monto Original</p>
                                            <p className="text-2xl font-bold text-emerald-900">
                                                GTQ {loan.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-lg border ${status.cls}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Saldo restante */}
                                    <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-400 mb-0.5">Saldo Restante</p>
                                        <p className="text-xl font-black text-red-600">
                                            GTQ {loan.remainingBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 text-right">{progress.toFixed(0)}% pagado</p>
                                    </div>

                                    <div className="space-y-1 mb-5 text-sm text-gray-600">
                                        <p><span className="font-semibold">Plazo:</span> {loan.termMonths} meses</p>
                                        <p><span className="font-semibold">Tasa de interés:</span> {loan.interestRate?.toFixed(2)}%%</p>
                                        <p><span className="font-semibold">Cuenta asociada:</span> <span className="font-mono">{loan.account?.accountNumber || '—'}</span></p>
                                        <p className="text-xs text-gray-400">Inicio: {new Date(loan.startDate).toLocaleDateString('es-GT')}</p>
                                    </div>

                                    <BaseButton variant="secondary" fullWidth icon={<ChevronRight size={15} />} onClick={() => onViewDetail(loan)}>
                                        Ver Cuotas y Pagar
                                    </BaseButton>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};