import { useEffect } from 'react';
import { useFavoritesStore } from '../User/Store/ClientStore.js';
import { showSuccess, showError } from '../../shared/utils/toast.jsx';
import { Star, PlusCircle, Trash2 } from 'lucide-react';

export const FavoritesList = ({ onAddNew }) => {
    const { favorites, getMyFavorites, removeFavorite, loading } = useFavoritesStore();

    useEffect(() => {
        getMyFavorites();
    }, []);

    const handleRemove = async (id) => {
        try {
            await removeFavorite(id);
            showSuccess('Favorito eliminado');
        } catch (err) {
            showError(err.response?.data?.message || 'Error al eliminar');
        }
    };

    if (loading) return (
        <div className="p-10 text-center font-bold text-emerald-900">
            Cargando favoritos...
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">
                        Cuentas <span className="text-emerald-600 font-light">Favoritas</span>
                    </h1>
                    <p className="text-gray-500">Tus cuentas guardadas para transferencias rápidas</p>
                </div>
                <button
                    onClick={onAddNew}
                    className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl text-white font-bold transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
                >
                    <PlusCircle size={18} />
                    Agregar Favorito
                </button>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">
                    <Star size={48} className="mx-auto mb-4 opacity-30" />
                    No tienes cuentas favoritas guardadas aún.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => (
                        <div
                            key={fav._id}
                            className="bg-white rounded-2xl shadow-sm border border-emerald-50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 overflow-hidden group"
                        >
                            <div className="h-2 w-full bg-emerald-500 transition-all group-hover:h-3" />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Star size={18} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-emerald-900">{fav.alias}</p>
                                            <p className="text-xs text-gray-400">
                                                {fav.account?.user?.UserName} {fav.account?.user?.UserSurname}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-5 text-sm text-gray-600">
                                    <p>
                                        <span className="font-semibold">N° de Cuenta:</span>{' '}
                                        <span className="font-mono">{fav.account?.accountNumber}</span>
                                    </p>
                                    <p><span className="font-semibold">Tipo:</span> {fav.account?.accountType}</p>
                                    <p><span className="font-semibold">Banco:</span> {fav.account?.bank || 'Banco Kinal'}</p>
                                </div>

                                <button
                                    onClick={() => handleRemove(fav._id)}
                                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-bold rounded-xl border border-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    Eliminar Favorito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};