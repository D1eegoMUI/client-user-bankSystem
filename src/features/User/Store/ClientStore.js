import * as client from '../../../shared/Api/client.js';
import { create } from 'zustand';

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
