import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Wallet } from 'lucide-react';
import { BaseModal }  from '../../../shared/components/BaseModal.jsx';
import { BaseButton } from '../../../shared/components/BaseButton.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';
import { useLoanDetailStore } from '../../User/Store/ClientStore.js';
import { useMyAccountStore }  from '../../User/Store/ClientStore.js';

const INSTALLMENT_STYLES = {
    PENDING: { icon: <Clock size={16} className="text-yellow-500" />,     cls: 'bg-yellow-50 border-yellow-200 text-yellow-700',   label: 'Pendiente' },
    PAID:    { icon: <CheckCircle2 size={16} className="text-emerald-500" />, cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Pagado' },
    OVERDUE: { icon: <AlertCircle size={16} className="text-red-500" />,  cls: 'bg-red-50 border-red-200 text-red-700',           label: 'Vencido' },
};

export const LoanDetailModal = ({ loan, onClose }) => {
    const { details, loadingDetails, loadingPayment, getLoanDetails, payNextInstallment } = useLoanDetailStore();
    const { accounts, getMyAccounts, loading: loadingAccounts } = useMyAccountStore();
    const [selectedAccountId, setSelectedAccountId] = useState('');

    useEffect(() => {
        getLoanDetails(loan._id);
        getMyAccounts();
    }, [loan._id]);

    const nextPending = details.find(d => d.status === 'PENDING');

    const handlePay = async () => {
        if (!selectedAccountId) { showError('Selecciona una cuenta para realizar el pago'); return; }
        if (!nextPending) { showError('No hay cuotas pendientes'); return; }

        try {
            const result = await payNextInstallment({ loanId: loan._id, accountId: selectedAccountId });
            showSuccess(result.message || `Cuota #${nextPending.installmentNumber} pagada exitosamente`);
            getLoanDetails(loan._id);
        } catch (err) {
            showError(err.response?.data?.message || 'Error al procesar el pago');
        }
    };

    return (
        <BaseModal
            isOpen={true}
            onClose={onClose}
            title="Cuotas del Préstamo"
            subtitle={`GTQ ${loan.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })} — ${loan.termMonths} meses`}
            maxWidth="max-w-2xl"
        >
            <div className="space-y-6">

                {/* Resumen financiero */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                        { label: 'Monto Original',  value: `GTQ ${loan.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
                        { label: 'Saldo Restante',  value: `GTQ ${loan.remainingBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, highlight: true },
                        { label: 'Tasa de Interés', value: `${loan.interestRate?.toFixed(2)}%` },
                    ].map(({ label, value, highlight }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">{label}</p>
                            <p className={`text-base font-black ${highlight ? 'text-red-600' : 'text-emerald-900'}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Panel de pago */}
                {nextPending && (
                    <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50">
                        <div className="flex items-center gap-2 mb-3">
                            <Wallet size={18} className="text-emerald-600" />
                            <p className="text-sm font-bold text-emerald-900">
                                Pagar Cuota #{nextPending.installmentNumber}
                                <span className="font-normal text-emerald-700 ml-1">
                                    — Vence: {new Date(nextPending.expectedDate).toLocaleDateString('es-GT')}
                                </span>
                            </p>
                        </div>

                        <p className="text-lg font-black text-emerald-900 mb-3">
                            GTQ {nextPending.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            <span className="text-xs font-normal text-gray-500 ml-2">
                                (Capital: GTQ {nextPending.principal?.toFixed(2)} + Interés: GTQ {nextPending.interest?.toFixed(2)})
                            </span>
                        </p>

                        <label className="block text-xs font-semibold text-gray-700 mb-1">Débitar desde cuenta</label>
                        {loadingAccounts ? (
                            <p className="text-xs text-gray-400">Cargando cuentas...</p>
                        ) : (
                            <select
                                value={selectedAccountId}
                                onChange={e => setSelectedAccountId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white mb-3"
                            >
                                <option value="">-- Selecciona una cuenta --</option>
                                {accounts.filter(acc => acc.status).map(acc => (
                                    <option key={acc._id} value={acc._id}>
                                        {acc.accountNumber} — {acc.currency} {acc.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </option>
                                ))}
                            </select>
                        )}

                        <BaseButton variant="primary" fullWidth onClick={handlePay} loading={loadingPayment} loadingText="Procesando pago...">
                            Pagar Cuota #{nextPending.installmentNumber}
                        </BaseButton>
                    </div>
                )}

                {/* Tabla de cuotas */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Detalle de Cuotas ({details.length} total)</h3>

                    {loadingDetails ? (
                        <div className="text-center py-10 text-gray-400">Cargando cuotas...</div>
                    ) : details.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">No hay cuotas registradas.</div>
                    ) : (
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {details.map(d => {
                                const style  = INSTALLMENT_STYLES[d.status] || INSTALLMENT_STYLES.PENDING;
                                const isNext = nextPending?._id === d._id;

                                return (
                                    <div
                                        key={d._id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                                            isNext ? 'border-emerald-300 bg-emerald-50/70' : 'border-gray-100 bg-gray-50'
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-black text-gray-600 flex-shrink-0">
                                            {d.installmentNumber}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {isNext && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">← Próxima</span>}
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold ${style.cls}`}>
                                                    {style.icon}{style.label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Vence: {new Date(d.expectedDate).toLocaleDateString('es-GT')}
                                                {d.paymentDate && <> · Pagado: {new Date(d.paymentDate).toLocaleDateString('es-GT')}</>}
                                            </p>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-black text-emerald-900">
                                                GTQ {d.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                Cap: {d.principal?.toFixed(2)} | Int: {d.interest?.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                    <BaseButton variant="ghost" onClick={onClose}>Cerrar</BaseButton>
                </div>
            </div>
        </BaseModal>
    );
};