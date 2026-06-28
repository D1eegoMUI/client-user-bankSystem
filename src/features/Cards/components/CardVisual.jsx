import { getCardPalette } from '../cardPallete';

export const CardVisual = ({ data, variant }) => {
    const isCredit = variant === 'CREDIT';

    const palette = !isCredit
        ? "from-emerald-900 to-emerald-600 border-emerald-500 text-emerald-100"
        : getCardPalette(data.type).gradient;

    return (
        <div className={`h-44 rounded-[2rem] p-5 text-white bg-gradient-to-br ${palette} shadow-2xl relative overflow-hidden transition-transform hover:scale-[1.02] duration-300 border-r-4`}>
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

            <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
                            Kinal Bank
                        </p>
                        <p className="text-[10px] font-black uppercase italic tracking-tighter opacity-90">
                            {isCredit ? `${data.type} Line` : 'Debit Access'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] font-black italic tracking-widest leading-none">
                            {data.brand || 'VISA'}
                        </p>
                    </div>
                </div>

                {/* Chip */}
                <div className="w-9 h-7 bg-gradient-to-br from-yellow-100 to-yellow-500 rounded-md shadow-inner border border-yellow-200/50 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full opacity-30 flex flex-col justify-around p-1">
                        <div className="h-[1px] bg-black" />
                        <div className="h-[1px] bg-black" />
                        <div className="h-[1px] bg-black" />
                    </div>
                </div>

                <div>
                    <p className="text-base font-mono tracking-[0.2em] mb-1.5 drop-shadow-lg">
                        {data.cardNumber?.replace(/(.{4})/g, '$1 ').trim() || '**** **** **** ****'}
                    </p>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest">
                                {data.holderName
                                    || (data.user?.UserName
                                        ? `${data.user.UserName} ${data.user.UserSurname}`
                                        : 'VALUED CUSTOMER')}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[7px] uppercase font-black opacity-60 mb-0.5 tracking-tighter">Expires</p>
                            <p className="text-[10px] font-black">{data.expirationDate || '12/28'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};