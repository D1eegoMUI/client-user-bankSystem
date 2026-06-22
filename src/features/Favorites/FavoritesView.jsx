import { useState } from 'react';
import { FavoritesList } from './FavoritesList.jsx';
import { AddFavoriteModal } from './AddFavoriteModal.jsx';

export const FavoritesView = () => {
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <div className="relative">
            <FavoritesList onAddNew={() => setIsAddOpen(true)} />
            {isAddOpen && (
                <AddFavoriteModal onClose={() => setIsAddOpen(false)} />
            )}
        </div>
    );
};