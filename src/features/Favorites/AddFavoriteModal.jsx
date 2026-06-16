import { useState } from 'react';
import { useFavoritesStore } from '../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../shared/utils/toast.jsx';

export const AddFavoriteModal = ({ onClose }) => {
    const { addFavorite, loading } = useFavoritesStore();
    const [form, setForm] = useState({ accountNumber: '', alias: '' });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!form.accountNumber.trim() || !form.alias.trim()) {
            showError('Por favor completa todos los campos');
            return;
        }
        try {
            await addFavorite({ accountNumber: form.accountNumber.trim(), alias: form.alias.trim() });
            showSuccess('Cuenta agregada a favoritos');
            onClose();
        } catch (err) {
            showError(err.response?.data?.message || 'Error al agregar favorito');
        }
    };

    return (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex justify-center items-center z-50 px-3">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100">
                <div className="p-6 text-white" style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 100%)' }}>
                    <h2 className="text-2xl font-bold">Agregar Cuenta Favorita</h2>
                    <p className="text-emerald-100 text-sm opacity-90">Guarda una cuenta para transferencias rápidas</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Número de cuenta</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={form.accountNumber}
                            onChange={handleChange}
                            placeholder="Ej: 6816312282"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                        <p className="text-xs text-gray-400 mt-1">El número de cuenta de 10 dígitos</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Alias</label>
                        <input
                            type="text"
                            name="alias"
                            value={form.alias}
                            onChange={handleChange}
                            placeholder='Ej: "Mamá", "Taller de Carros"'
                            maxLength={50}
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
                            {loading ? 'Guardando...' : 'Agregar Favorito'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};