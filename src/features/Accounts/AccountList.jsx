import { useEffect, useState, useMemo } from 'react';
import { useMyAccountStore } from '../User/Store/ClientStore.js';
import { Search, History, PlusCircle } from 'lucide-react';
import { BaseButton } from '../../shared/components/BaseButton.jsx';

export const AccountList = ({ onOpenAccount, onViewHistory }) => {
    const { accounts, getMyAccounts, loading } = useMyAccountStore();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('TODAS');

    useEffect(() => {
        getMyAccounts();
    }, []);

    const filteredAccounts = useMemo(() => {
        return accounts.filter((acc) => {
            const matchesSearch =
                (acc.accountNumber || '').includes(search) ||
                (acc.currency || '').toLowerCase().includes(search.toLowerCase()) ||
                (acc.bank || '').toLowerCase().includes(search.toLowerCase());
            const matchesType = filterType === 'TODAS' || acc.accountType === filterType;
            return matchesSearch && matchesType;
        });
    }, [accounts, search, filterType]);

    const getStatusBadge = (account) => {
        if (account.requestStatus === 'PENDING') {
            return { bar: 'bg-amber-400', pill: 'text-amber-600 bg-amber-50', label: 'Pendiente de aprobación' };
        }
        if (account.requestStatus === 'REJECTED') {
            return { bar: 'bg-red-400', pill: 'text-red-600 bg-red-50', label: 'Rechazada' };
        }
        return account.status
            ? { bar: 'bg-emerald-500', pill: 'text-emerald-600 bg-emerald-50', label: 'Activa' }
            : { bar: 'bg-red-400', pill: 'text-red-600 bg-red-50', label: 'Inactiva' };
    };

    if (loading) return (
        <div className="p-10 text-center font-bold text-emerald-900">
            Cargando tus cuentas...
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">
                        Mis <span className="text-emerald-600 font-light">Cuentas</span>
                    </h1>
                    <p className="text-gray-500">Gestiona y consulta tus productos bancarios</p>
                </div>
                <BaseButton variant="primary" size="lg" icon={<PlusCircle size={18} />} onClick={onOpenAccount}>
                    Abrir Nueva Cuenta
                </BaseButton>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar por número, moneda o banco..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                </div>
                <div className="flex gap-2">
                    {['TODAS', 'AHORRO', 'MONETARIA'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilterType(opt)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${filterType === opt
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-xs text-gray-400 mb-4">
                Mostrando {filteredAccounts.length} de {accounts.length} cuentas
            </p>

            {filteredAccounts.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">
                    {accounts.length === 0
                        ? 'Aún no tienes cuentas. ¡Abre tu primera cuenta bancaria!'
                        : 'No se encontraron cuentas con los filtros aplicados.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAccounts.map((account) => {
                        const badge = getStatusBadge(account);
                        return (
                            <div
                                key={account._id}
                                className="bg-white rounded-2xl shadow-sm border border-emerald-50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 overflow-hidden group"
                            >
                                <div className={`h-2 w-full transition-all group-hover:h-3 ${badge.bar}`} />
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">Número de Cuenta</h3>
                                            <p className="text-xl font-mono font-bold text-emerald-900">
                                                {account.accountNumber || 'Pendiente de aprobación'}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100">
                                            {account.accountType}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-400 text-xs">Saldo Disponible</p>
                                        <h2 className="text-3xl font-bold text-emerald-900">
                                            <span className="text-emerald-500 mr-1 text-xl">{account.currency}</span>
                                            {account.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '0.00'}
                                        </h2>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            🏦 {account.bank || 'Banco Kinal'}
                                        </span>
                                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${badge.pill}`}>
                                            ● {badge.label}
                                        </span>
                                    </div>

                                    {account.requestStatus === 'REJECTED' && account.rejectionReason && (
                                        <p className="text-xs text-red-500 mb-4 italic">
                                            Motivo: {account.rejectionReason}
                                        </p>
                                    )}

                                    <BaseButton
                                        variant="secondary"
                                        fullWidth
                                        icon={<History size={15} />}
                                        disabled={!account.accountNumber}
                                        onClick={() => onViewHistory(account._id)}
                                        className={!account.accountNumber ? 'opacity-50 cursor-not-allowed' : ''}
                                    >
                                        Ver Movimientos
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