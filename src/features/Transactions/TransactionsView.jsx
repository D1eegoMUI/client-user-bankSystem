import { useState } from 'react';
import { TransactionList } from './TransactionList.jsx';
import { TransferModal } from './TransferModal.jsx';

export const TransactionsView = () => {
    const [isTransferOpen, setIsTransferOpen] = useState(false);

    return (
        <div className="relative">
            <TransactionList onNewTransfer={() => setIsTransferOpen(true)} />
            {isTransferOpen && (
                <TransferModal onClose={() => setIsTransferOpen(false)} />
            )}
        </div>
    );
};