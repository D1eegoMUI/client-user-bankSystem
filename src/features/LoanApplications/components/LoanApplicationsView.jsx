import { useState } from 'react';
import { LoanApplicationList } from './LoanApplicationList.jsx';
import { CreateLoanApplicationModal } from './CreateLoanApplicationModal.jsx';
import { EditLoanApplicationModal } from './EditLoanApplicationModal.jsx';

export const LoanApplicationsView = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null);

    return (
        <div className="relative">
            <LoanApplicationList
                onCreateNew={() => setIsCreateOpen(true)}
                onEdit={(app) => setEditingApp(app)}
            />

            {isCreateOpen && (
                <CreateLoanApplicationModal onClose={() => setIsCreateOpen(false)} />
            )}

            {editingApp && (
                <EditLoanApplicationModal
                    application={editingApp}
                    onClose={() => setEditingApp(null)}
                />
            )}
        </div>
    );
};