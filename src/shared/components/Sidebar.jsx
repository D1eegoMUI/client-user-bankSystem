import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore.js';
import { SupportModal } from "../../features/Support/components/SupportModal.jsx";

import AccountIcon from '../../assets/Icons/user.svg';
import CardIcon from '../../assets/Icons/credit-card.svg';
import TransactionIcon from '../../assets/Icons/transaction.svg';
import LoanIcon from '../../assets/Icons/Loan.svg';
import AppLoanIcon from '../../assets/Icons/LoanApp.svg';
import FavoriteIcon from '../../assets/Icons/star.svg';
import ExchangeIcon from '../../assets/Icons/exchange.svg';
import PurchaseIcon from '../../assets/Icons/tag.svg';

const Sidebar = ({ isOpen, onClose }) => {
    const logout = useAuthStore((s) => s.logout);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/'); };

    const items = [
        { label: 'Mis Cuentas', icon: AccountIcon, path: 'account' },
        { label: 'Tarjetas Débito', icon: CardIcon, path: 'cards' },
        { label: 'Tarjetas Crédito', icon: CardIcon, path: 'credit-cards' },
        { label: 'Transferencias', icon: TransactionIcon, path: 'transactions' },
        { label: 'Mis Préstamos', icon: LoanIcon, path: 'loans' },
        { label: 'Solicitar Préstamo', icon: AppLoanIcon, path: 'loan-applications' },
        { label: 'Compras', icon: PurchaseIcon, path: 'purchases' },
        { label: 'Favoritos', icon: FavoriteIcon, path: 'favorites' },
        { label: 'Tipo de Cambio', icon: ExchangeIcon, path: 'exchange' },
    ];

    return (
        <>
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-300 ease-in-out transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:sticky md:top-16 md:self-start
        h-screen md:h-[calc(100vh-4rem)] p-4 flex flex-col justify-between border-r border-gray-100 shadow-xl md:shadow-sm overflow-y-auto
      `}>
                <div>
                    {/* Cerrar en móvil */}
                    <div className="flex items-center justify-between mb-4 md:hidden px-4">
                        <span className="text-sm font-bold text-emerald-900">Mi Banca</span>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-4 px-4 hidden md:block">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mi Banca</p>
                    </div>

                    <ul className="space-y-2">
                        {items.map((item) => (
                            <li key={item.label}>
                                <NavLink
                                    to={`/dashboard/${item.path}`}
                                    onClick={() => { if (window.innerWidth < 768) onClose(); }}
                                    className={({ isActive }) => `
                    group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${isActive
                                            ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100'
                                            : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}
                  `}
                                >
                                    <span className="group-hover:scale-110 transition-transform flex items-center">
                                        <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100" style={{ filter: 'grayscale(100%)' }} />
                                    </span>
                                    <span className="text-sm">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sección inferior */}
                <div className="space-y-3 mt-8">
                    <div className="px-4 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-xs font-semibold text-emerald-900">Soporte Kinal</p>
                        <p className="text-[10px] text-gray-500 mt-1">¿Necesitas ayuda?</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-3 text-[10px] bg-white border border-gray-200 w-full py-2 rounded-lg font-bold text-emerald-700 hover:bg-emerald-700 hover:text-white transition-all active:scale-95">
                            Contactar
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition-all group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
            <SupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export { Sidebar };