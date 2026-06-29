import { useState } from 'react';
import { AccountList } from './AccountList.jsx';
import { OpenAccountModal } from './OpenAccountModal.jsx';
import { AccountHistoryModal } from './AccountHistoryModal.jsx';
 
export const AccountsView = () => {
    const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState(null);
 
    return (
        <div className="relative">
            <AccountList
                onOpenAccount={() => setIsOpenModalOpen(true)}
                onViewHistory={(id) => setSelectedAccountId(id)}
            />
 
            {isOpenModalOpen && (
                <OpenAccountModal onClose={() => setIsOpenModalOpen(false)} />
            )}
 
            {selectedAccountId && (
                <AccountHistoryModal
                    accountId={selectedAccountId}
                    onClose={() => setSelectedAccountId(null)}
                />
            )}
        </div>
    );
};