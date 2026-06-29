import { useState } from 'react';
import { LoanList }        from './LoanList.jsx';
import { LoanDetailModal } from './LoanDetailModal.jsx';

export const LoansView = () => {
    const [selectedLoan, setSelectedLoan] = useState(null);

    return (
        <div className="relative">
            <LoanList onViewDetail={(loan) => setSelectedLoan(loan)} />
            {selectedLoan && (
                <LoanDetailModal
                    loan={selectedLoan}
                    onClose={() => setSelectedLoan(null)}
                />
            )}
        </div>
    );
};