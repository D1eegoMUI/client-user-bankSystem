import { useState } from 'react';
import { useFavoritesStore } from '../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../shared/utils/toast.jsx';
import { BaseModal } from '../../shared/components/BaseModal.jsx';
import { BaseButton } from '../../shared/components/BaseButton.jsx';

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
        <BaseModal
            isOpen={true}
            onClose={onClose}
            title="Agregar Cuenta Favorita"
            subtitle="Guarda una cuenta para transferencias rápidas"
        >
            <div className="space-y-4">
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
                    <BaseButton variant="ghost" onClick={onClose}>
                        Cancelar
                    </BaseButton>
                    <BaseButton
                        variant="primary"
                        onClick={handleSubmit}
                        loading={loading}
                        loadingText="Guardando..."
                    >
                        Agregar Favorito
                    </BaseButton>
                </div>
            </div>
        </BaseModal>
    );
};