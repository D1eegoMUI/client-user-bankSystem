import { useState, useEffect } from 'react';
import { useMyCardStore, useMyAccountStore } from '../../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';
import { BaseModal } from '../../../shared/components/BaseModal.jsx';
import { BaseButton } from '../../../shared/components/BaseButton.jsx';
import { MapPickerView } from '../../../shared/components/MapPickerView.jsx';

export const RequestCardModal = ({ isOpen, onClose }) => {
    const { createCardRequest, loadingRequest } = useMyCardStore();
    const { accounts, getMyAccounts } = useMyAccountStore();

    const [form, setForm] = useState({
        account: '',
        holderName: '',
        brand: 'VISA',
        address: '',
        latitude: null,
        longitude: null,
    });

    useEffect(() => {
        if (isOpen) {
            getMyAccounts();
            setForm({ account: '', holderName: '', brand: 'VISA', address: '', latitude: null, longitude: null });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePick = (lat, lng) => {
        setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    };

    const handleSubmit = async () => {
        const { account, holderName, brand, address, latitude, longitude } = form;

        if (!account || !holderName || !brand) {
            showError('Por favor completa todos los campos.');
            return;
        }
        if (!address.trim()) {
            showError('Escribe la dirección de entrega.');
            return;
        }
        if (latitude == null || longitude == null) {
            showError('Selecciona la ubicación de entrega en el mapa.');
            return;
        }

        try {
            const result = await createCardRequest({
                account,
                holderName: holderName.toUpperCase(),
                brand,
                deliveryAddress: { address: address.trim(), latitude, longitude },
            });
            showSuccess(result.message || 'Solicitud de tarjeta enviada. Pendiente de aprobación bancaria.');
            onClose();
        } catch (err) {
            showError(err.response?.data?.message || 'Error al enviar la solicitud');
        }
    };

    const inputClass = "w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 outline-none font-bold bg-gray-50/50 transition-all text-sm";
    const labelClass = "text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1 tracking-widest";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Solicitar Tarjeta de Débito"
            subtitle="Pendiente de aprobación bancaria"
            maxWidth="max-w-lg"
        >
            <div className="space-y-5">

                {/* Cuenta vinculada */}
                <div className="flex flex-col">
                    <label className={labelClass}>Cuenta Vinculada</label>
                    <select
                        name="account"
                        value={form.account}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="">Selecciona una cuenta...</option>
                        {accounts.map((acc) => (
                            <option key={acc._id} value={acc._id}>
                                {acc.accountNumber} — {acc.accountType} (Q {acc.balance?.toLocaleString()})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Nombre en el plástico */}
                <div className="flex flex-col">
                    <label className={labelClass}>Nombre en el Plástico</label>
                    <input
                        type="text"
                        name="holderName"
                        value={form.holderName}
                        onChange={handleChange}
                        placeholder="TAL CUAL APARECERÁ EN LA TARJETA"
                        className={`${inputClass} uppercase`}
                    />
                </div>

                {/* Franquicia */}
                <div className="flex flex-col">
                    <label className={labelClass}>Franquicia / Red</label>
                    <select
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="VISA">VISA</option>
                        <option value="MASTERCARD">MASTERCARD</option>
                    </select>
                </div>

                {/* Dirección de entrega: texto + mapa */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <label className={labelClass}>Dirección de Entrega</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Ej. 5ta avenida 12-34, zona 10, Ciudad de Guatemala"
                            className={inputClass}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass}>Ubicación en el Mapa</label>
                        <MapPickerView
                            latitude={form.latitude}
                            longitude={form.longitude}
                            onPick={handlePick}
                            editable
                        />
                    </div>
                </div>

                {/* Nota informativa */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <p className="text-xs font-bold text-blue-700">Revisión bancaria requerida</p>
                    <p className="text-[11px] text-blue-600 mt-1">
                        Tu solicitud será revisada por el banco antes de ser emitida. La tarjeta física será enviada a la ubicación indicada una vez aprobada.
                    </p>
                </div>

                {/* Acciones */}
                <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                    <BaseButton
                        variant="ghost"
                        size="md"
                        onClick={onClose}
                        className="text-[10px] uppercase tracking-widest font-black"
                    >
                        Cancelar
                    </BaseButton>
                    <BaseButton
                        variant="primary"
                        size="md"
                        onClick={handleSubmit}
                        loading={loadingRequest}
                        loadingText="Enviando solicitud..."
                        className="text-[10px] uppercase tracking-widest font-black"
                    >
                        Enviar Solicitud
                    </BaseButton>
                </div>
            </div>
        </BaseModal>
    );
};