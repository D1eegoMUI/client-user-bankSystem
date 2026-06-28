// Paleta única de tarjetas — debe coincidir exactamente con la del backend (admin)
export const CARD_PALETTE = {
    CLASSIC:  { gradient: 'from-indigo-900 to-indigo-600 border-indigo-500 text-indigo-100', swatch: 'bg-indigo-600',  ring: 'border-indigo-500', soft: 'bg-indigo-50',  text: 'text-indigo-800' },
    GOLD:     { gradient: 'from-amber-800 to-amber-500 border-amber-400 text-amber-100',    swatch: 'bg-amber-500',   ring: 'border-amber-400',  soft: 'bg-amber-50',   text: 'text-amber-800'  },
    PLATINUM: { gradient: 'from-slate-800 to-slate-500 border-slate-400 text-slate-100',    swatch: 'bg-slate-500',   ring: 'border-slate-400',  soft: 'bg-slate-50',   text: 'text-slate-800'  },
    BLACK:    { gradient: 'from-zinc-950 to-zinc-700 border-zinc-600 text-zinc-100',         swatch: 'bg-zinc-800',    ring: 'border-zinc-600',   soft: 'bg-zinc-100',   text: 'text-zinc-900'   },
};

export const getCardPalette = (type) => CARD_PALETTE[type] || {
    gradient: 'from-gray-800 to-gray-500 border-gray-400 text-gray-100',
    swatch: 'bg-gray-500', ring: 'border-gray-400', soft: 'bg-gray-50', text: 'text-gray-800',
};

// Límites de crédito hardcodeados por categoría (al elegir, se setean automáticamente)
export const CARD_LIMITS = {
    CLASSIC:  5000,
    GOLD:     15000,
    PLATINUM: 30000,
    BLACK:    60000,
};

// Día de corte fijo para toda nueva solicitud
export const FIXED_CUTOFF_DATE = 17;