export const Spinner = ({ small = false }) => {

    if (small) {

        return (
<div className="flex items-center justify-center">
<div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
</div>

        );

    }
 
    return (
<div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50/50">
<div className="animate-spin rounded-full h-16 w-16 border-4 border-kinal-yellow border-t-kinal-red"></div>
<p className="mt-4 font-bold text-gray-500 animate-pulse">Cargando...</p>
</div>

    );

};
 