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
            const { data } = await getMyAccounts();
            set({ accounts: data.data || [] });
        } finally {
            set({ loading: false });
        }
    },

    openMyAccount: async ({ accountType }) => {
        const { data } = await openMyAccount({ accountType });
        set((state) => ({ accounts: [data.data, ...state.accounts] }));
        return data;
    },

    getMyAccountHistory: async (accountId) => {
        set({ loadingHistory: true, history: [] });
        try {
            const { data } = await getMyAccountHistory(accountId);
            set({ history: data.data || [] });
        } finally {
            set({ loadingHistory: false });
        }
    },
}));