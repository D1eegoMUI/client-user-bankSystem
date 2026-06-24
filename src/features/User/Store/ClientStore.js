import * as client from '../../../shared/Api/client.js';
import { create } from 'zustand';

// ===== ACCOUNTS STORE (de Diego - no tocar) =====
export const useMyAccountStore = create((set) => ({
    accounts: [],
    history: [],
    loading: false,
    loadingHistory: false,

    getMyAccounts: async () => {
        set({ loading: true });
        try {
            const { data } = await client.getMyAccounts();
            set({ accounts: data.data || [] });
        } finally {
            set({ loading: false });
        }
    },

    openMyAccount: async ({ accountType }) => {
        const { data } = await client.openMyAccount({ accountType });
        set((state) => ({ accounts: [data.data, ...state.accounts] }));
        return data;
    },

    getMyAccountHistory: async (accountId) => {
        set({ loadingHistory: true, history: [] });
        try {
            const { data } = await client.getMyAccountHistory(accountId);
            set({ history: data.data || [] });
        } finally {
            set({ loadingHistory: false });
        }
    },
}));

export const useMyPurchaseStore = create((set) => ({
    purchaseCatalog: [],
    debitAccounts: [],
    creditCards: [],
    purchases: [],
    loadingCatalog: false,
    loadingPaymentMethods: false,
    loadingPurchases: false,
    processingPurchase: false,

    getPurchaseCatalog: async () => {
        set({ loadingCatalog: true });
        try {
            const { data } = await client.getPurchaseCatalog({ limit: 100 });
            set({ purchaseCatalog: data.data || data.purchases || [] });
        } finally {
            set({ loadingCatalog: false });
        }
    },

    getPaymentMethods: async () => {
        set({ loadingPaymentMethods: true });

        try {
            const [accountsResponse, creditCardsResponse] = await Promise.all([
                client.getMyAccounts(),
                client.getMyCreditCards(),
            ]);
            set({
                debitAccounts: accountsResponse.data?.data || [],
                creditCards: creditCardsResponse.data?.data || [],
            });
        } catch (error) {
            console.error("ERROR PAYMENT METHODS", error);
        } finally {
            set({ loadingPaymentMethods: false });
        }
    },

    getPurchasesByCardId: async (cardId) => {
        if (!cardId) {
            set({ purchases: [] });
            return;
        }

        set({ loadingPurchases: true, purchases: [] });
        try {
            const { data } = await client.getMyPurchases({ cardId });
            set({ purchases: data.data || [] });
        } finally {
            set({ loadingPurchases: false });
        }
    },

    processPurchase: async (purchaseData) => {
        set({ processingPurchase: true });
        try {
            const { data } = await client.processMyPurchase(purchaseData);
            return data;
        } finally {
            set({ processingPurchase: false });
        }
    },
}));

export const useExchangeStore = create((set) => ({
    lastConversion: null,
    loading: false,
    error: null,

    convert: async (amount, from, to) => {
        set({
            loading: true,
            error: null,
        });
        try {
            const { data } = await client.convertAmount({
                amount,
                from,
                to,
            });
            set({lastConversion: data.conversion, });
            return data;
        } catch (error) {
            set({
                error:
                    error.response?.data?.message ||
                    'Error al convertir moneda',
            });
            throw error;
        } finally {
            set({loading: false});
        }
    },
}));

// ===== LOAN APPLICATIONS STORE =====
export const useLoanApplicationStore = create((set) => ({
    applications: [],
    loading: false,

    getMyLoanApplications: async () => {
        set({ loading: true });
        try {
            const { data } = await client.getMyLoanApplications();
            set({ applications: data.data || [] });
        } finally {
            set({ loading: false });
        }
    },

    createLoanApplication: async (payload) => {
        const { data } = await client.createLoanApplication(payload);
        set((state) => ({ applications: [data.data, ...state.applications] }));
        return data;
    },

    updateLoanApplication: async (id, payload) => {
        const { data } = await client.updateLoanApplication(id, payload);
        set((state) => ({
            applications: state.applications.map((a) =>
                a._id === id ? data.data : a
            ),
        }));
        return data;
    },

    cancelLoanApplication: async (id) => {
        await client.cancelLoanApplication(id);
        set((state) => ({
            applications: state.applications.map((a) =>
                a._id === id ? { ...a, status: 'CANCELLED' } : a
            ),
        }));
    },
}));

// ===== FAVORITES STORE =====
export const useFavoritesStore = create((set) => ({
    favorites: [],
    loading: false,

    getMyFavorites: async () => {
        set({ loading: true });
        try {
            const { data } = await client.getMyFavorites();
            set({ favorites: data.favorites || [] });
        } finally {
            set({ loading: false });
        }
    },

    addFavorite: async (payload) => {
        const { data } = await client.addFavorite(payload);
        await useFavoritesStore.getState().getMyFavorites();
        return data;
    },

    removeFavorite: async (id) => {
        await client.removeFavorite(id);
        set((state) => ({
            favorites: state.favorites.filter((f) => f._id !== id),
        }));
    },

}));

// ===== TRANSACTIONS STORE =====
export const useTransactionStore = create((set) => ({
    transactions: [],
    pagination: null,
    loading: false,
    loadingTransfer: false,

    getMyTransactions: async (params = {}) => {
        set({ loading: true });
        try {
            const { data } = await client.getMyTransactions(params);
            set({
                transactions: data.data || [],
                pagination: data.pagination || null,
            });
        } finally {
            set({ loading: false });
        }
    },

    createTransfer: async (payload) => {
        set({ loadingTransfer: true });
        try {
            const { data } = await client.createMyTransaction(payload);
            return data;
        } finally {
            set({ loadingTransfer: false });
        }
    },
}));

// ===== LOANS STORE =====
export const useLoansStore = create((set) => ({
    loans: [],
    loading: false,

    getMyLoans: async () => {
        set({ loading: true });
        try {
            const { data } = await client.getMyLoans();
            set({ loans: data.data || [] });
        } finally {
            set({ loading: false });
        }
    },
}));

// ===== LOAN DETAIL STORE =====
export const useLoanDetailStore = create((set) => ({
    details: [],
    loadingDetails: false,
    loadingPayment: false,

    getLoanDetails: async (loanId) => {
        set({ loadingDetails: true, details: [] });
        try {
            const { data } = await client.getLoanDetails(loanId);
            set({ details: data.data || [] });
        } finally {
            set({ loadingDetails: false });
        }
    },

    payNextInstallment: async ({ loanId, accountId }) => {
        set({ loadingPayment: true });
        try {
            const { data } = await client.payLoanInstallment({ loanId, accountId });
            return data;
        } finally {
            set({ loadingPayment: false });
        }
    },
}));