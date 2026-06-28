import { useState } from 'react';
import { useMyCreditCardStore } from '../../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../../shared/utils/toast.jsx';
import { BaseModal } from '../../../shared/components/BaseModal.jsx';
import { BaseButton } from '../../../shared/components/BaseButton.jsx';
import { MapPickerView } from '../../../shared/components/MapPickerView.jsx';
import { CARD_PALETTE, CARD_LIMITS, FIXED_CUTOFF_DATE } from '../../Cards/cardPallete.js';

export const RequestCreditCardModal = ({ isOpen, onClose, onSuccess }) => {
    const { createCreditCardRequest, loadingRequest } = useMyCreditCardStore();

    const [form, setForm] = useState({
        cardType: 'CLASSIC',
        address: '',
        latitude: null,
        longitude: null,
    });

    const handlePick = (lat, lng) => {
        setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    };

    const handleAddressChange = (e) => {
        setForm((prev) => ({ ...prev, address: e.target.value }));
    };

    const handleSubmit = async () => {
        const { cardType, address, latitude, longitude } = form;

        if (!address.trim()) {
            showError('Escribe la dirección de entrega.');
            return;
        }
        if (latitude == null || longitude == null) {
            showError('Selecciona la ubicación de entrega en el mapa.');
            return;
        }

        try {
            const result = await createCreditCardRequest({
                cardType,
                requestedCreditLimit: CARD_LIMITS[cardType],
                cutoffDate: FIXED_CUTOFF_DATE,
                deliveryAddress: { address: address.trim(), latitude, longitude },
            });
            showSuccess(result.message || '¡Solicitud de tarjeta de crédito enviada exitosamente!');
            onSuccess?.();
            onClose();
        } catch (err) {
            showError(err?.response?.data?.message || 'Error al solicitar la tarjeta de crédito.');
        }
    };

    const inputClass = 'w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 outline-none font-bold bg-gray-50/50 transition-all text-sm';
    const labelClass = 'text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1 tracking-widest';

    const cardTypes = [
        { value: 'CLASSIC',  label: 'Classic',  desc: 'Límite estándar' },
        { value: 'GOLD',     label: 'Gold',      desc: 'Beneficios adicionales' },
        { value: 'PLATINUM', label: 'Platinum',  desc: 'Límite alto' },
        { value: 'BLACK',    label: 'Black',     desc: 'Exclusiva' },
    ];

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Solicitar Tarjeta de Crédito"
            subtitle="Requiere revisión y aprobación bancaria"
            maxWidth="max-w-lg"
        >
            <div className="space-y-5">

                {/* Tipo de tarjeta — color real en lugar de emoji */}
                <div className="flex flex-col">
                    <label className={labelClass}>Tipo de Tarjeta</label>
                    <div className="grid grid-cols-2 gap-3">
                        {cardTypes.map((opt) => {
                            const palette = CARD_PALETTE[opt.value];
                            const selected = form.cardType === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, cardType: opt.value }))}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                        selected ? `${palette.ring} ${palette.soft}` : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <span className={`inline-block w-6 h-6 rounded-full bg-gradient-to-br ${palette.gradient} shadow-sm border border-white/40`} />
                                    <p className={`font-black text-sm mt-1 ${selected ? palette.text : 'text-gray-700'}`}>
                                        {opt.label}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</p>
                                    <p className="text-[10px] font-bold text-gray-500 mt-1">
                                        Límite: Q {CARD_LIMITS[opt.value].toLocaleString('es-GT')}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Resumen de condiciones automáticas */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Límite asignado</p>
                        <p className="text-sm font-black text-emerald-700">
                            Q {CARD_LIMITS[form.cardType].toLocaleString('es-GT')}
                        </p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Día de corte</p>
                        <p className="text-sm font-black text-gray-700">Día {FIXED_CUTOFF_DATE}</p>
                    </div>
                </div>

                {/* Dirección de entrega: texto + mapa */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <label className={labelClass}>Dirección de Entrega</label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={handleAddressChange}
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

                {/* Nota */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <p className="text-xs font-bold text-amber-700">Revisión bancaria requerida</p>
                    <p className="text-[11px] text-amber-600 mt-1">
                        Tu solicitud será revisada por el banco. El límite aprobado puede diferir del solicitado.
                    </p>
                </div>

                {/* Acciones */}
                <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                    <BaseButton variant="ghost" size="md" onClick={onClose} className="text-[10px] uppercase tracking-widest font-black">
                        Cancelar
                    </BaseButton>
                    <BaseButton
                        variant="primary" size="md"
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