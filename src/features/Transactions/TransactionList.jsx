import { useEffect, useState } from 'react';
import { ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactionStore } from '../User/Store/ClientStore.js';
import { BaseButton } from '../../shared/components/BaseButton.jsx';

const TRANSACTION_TYPES = [
    { value: '',                  label: 'Todas' },
    { value: 'TRANSFER',          label: 'Transferencia' },
    { value: 'DEPOSIT',           label: 'Depósito' },
    { value: 'WITHDRAWAL',        label: 'Retiro' },
    { value: 'LOAN_PAYMENT',      label: 'Pago Préstamo' },
    { value: 'CARD_PAYMENT',      label: 'Pago Tarjeta' },
    { value: 'SERVICE_PAYMENT',   label: 'Pago Servicio' },
    { value: 'FEE',               label: 'Comisión' },
];

const TYPE_STYLES = {
    TRANSFER:        'bg-blue-100 text-blue-700 border-blue-200',
    DEPOSIT:         'bg-emerald-100 text-emerald-700 border-emerald-200',
    WITHDRAWAL:      'bg-orange-100 text-orange-700 border-orange-200',
    LOAN_PAYMENT:    'bg-purple-100 text-purple-700 border-purple-200',
    CARD_PAYMENT:    'bg-pink-100 text-pink-700 border-pink-200',
    SERVICE_PAYMENT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    FEE:             'bg-red-100 text-red-700 border-red-200',
};

const formatAmount = (amount, currency = 'GTQ') =>
    `${currency} ${amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export const TransactionList = ({ onNewTransfer }) => {
    const { transactions, pagination, loading, getMyTransactions } = useTransactionStore();
    const [activeType, setActiveType] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const params = { page, limit: 10 };
        if (activeType) params.type = activeType;
        getMyTransactions(params);
    }, [activeType, page]);

    const handleTypeChange = (type) => {
        setActiveType(type);
        setPage(1);
    };

    if (loading) return (
        <div className="p-10 text-center font-bold text-emerald-900">
            Cargando transacciones...
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">
                        Mis <span className="text-emerald-600 font-light">Transacciones</span>
                    </h1>
                    <p className="text-gray-500">Historial de movimientos en todas tus cuentas</p>
                </div>
                <BaseButton
                    variant="primary"
                    size="lg"
                    icon={<ArrowLeftRight size={18} />}
                    onClick={onNewTransfer}
                >
                    Nueva Transferencia
                </BaseButton>
            </div>

            {/* Filtros de tipo */}
            <div className="flex flex-wrap gap-2 mb-8">
                {TRANSACTION_TYPES.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => handleTypeChange(value)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            activeType === value
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Lista */}
            {transactions.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">
                    <ArrowLeftRight size={48} className="mx-auto mb-4 opacity-30" />
                    No se encontraron transacciones
                    {activeType && ` del tipo "${TRANSACTION_TYPES.find(t => t.value === activeType)?.label}"`}.
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((tx) => {
                        const badgeCls = TYPE_STYLES[tx.type] || 'bg-gray-100 text-gray-600 border-gray-200';
                        const typeLabel = TRANSACTION_TYPES.find(t => t.value === tx.type)?.label || tx.type;

                        return (
                            <div
                                key={tx._id}
                                className="bg-white rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                                        tx.type === 'DEPOSIT' ? 'bg-emerald-100' : 'bg-red-50'
                                    }`}>
                                        {tx.type === 'DEPOSIT'
                                            ? <TrendingUp size={18} className="text-emerald-600" />
                                            : <TrendingDown size={18} className="text-red-500" />
                                        }
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg border ${badgeCls}`}>
                                                {typeLabel}
                                            </span>
                                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg border ${
                                                tx.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : tx.status === 'FAILED'  ? 'bg-red-50 text-red-600 border-red-100'
                                                :                           'bg-gray-100 text-gray-500 border-gray-200'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium truncate">
                                            {tx.description || 'Sin descripción'}
                                        </p>
                                        <div className="text-xs text-gray-400 mt-0.5 flex flex-wrap gap-x-3">
                                            {tx.originAccount && (
                                                <span>Origen: <span className="font-mono">{tx.originAccount.accountNumber}</span></span>
                                            )}
                                            {tx.destinationAccount && (
                                                <span>Destino: <span className="font-mono">{tx.destinationAccount.accountNumber}</span></span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <p className="text-lg font-black text-emerald-900">
                                            {formatAmount(tx.amount, tx.currency)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(tx.createdAt).toLocaleDateString('es-GT', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8">
                    <BaseButton variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                        ← Anterior
                    </BaseButton>
                    <span className="text-sm text-gray-500 font-medium">
                        Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <BaseButton variant="secondary" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>
                        Siguiente →
                    </BaseButton>
                </div>
            )}
        </div>
    );
};