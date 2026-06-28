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
    debitCards: [],        
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
            const [cardsResponse, creditCardsResponse] = await Promise.all([
                client.getMyCards({ isActive: true }),   
                client.getMyCreditCards(),
            ]);
            set({
                debitCards: (cardsResponse.data?.data || []).filter(c => c.isApproved),
                creditCards: creditCardsResponse.data?.data || [],
            });
        } catch (error) {
            console.error('ERROR PAYMENT METHODS', error);
        } finally {
            set({ loadingPaymentMethods: false });
        }
    },

    getPurchasesByCardId: async (cardId, debitCardId = null) => {
        if (!cardId) {
            set({ purchases: [] });
            return;
        }
        set({ loadingPurchases: true, purchases: [] });
        try {
            const params = { cardId };
            if (debitCardId) params.debitCardId = debitCardId;
            const { data } = await client.getMyPurchases(params);
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

// ------------------CARD----------------------
export const useMyCardStore = create((set) => ({
    cards: [],
    cardRequests: [],
    cardStatusRequests: [],
    loading: false,
    loadingRequest: false,
    loadingToggle: false,
    loadingRequestsList: false,

    getMyCards: async () => {
        set({ loading: true });
        try {
            const { data } = await client.getMyCards();
            set({ cards: data.data || [] });
        } finally {
            set({ loading: false });
        }
    },

    // Solicitudes de tarjeta nueva — para saber si hay alguna rechazada
    getMyCardRequests: async () => {
        set({ loadingRequestsList: true });
        try {
            const { data } = await client.getMyCardRequests();
            set({ cardRequests: data.data || [] });
        } finally {
            set({ loadingRequestsList: false });
        }
    },

    // Solicitudes de cambio de estado — para saber si hay alguna rechazada por tarjeta
    getMyCardStatusRequests: async () => {
        set({ loadingRequestsList: true });
        try {
            const { data } = await client.getMyCardStatusRequests();
            set({ cardStatusRequests: data.data || [] });
        } finally {
            set({ loadingRequestsList: false });
        }
    },

    updateCardLocally: (cardId, patch) => {
        set((state) => ({
            cards: state.cards.map((c) =>
                c._id === cardId ? { ...c, ...patch } : c
            ),
        }));
    },

    // Crea una CardRequest — no una tarjeta directamente
    createCardRequest: async (payload) => {
        set({ loadingRequest: true });
        try {
            const { data } = await client.createCardRequest(payload);
            return data;
        } finally {
            set({ loadingRequest: false });
        }
    },

    // Solicita activación o desactivación — no toca isActive directamente
    createCardStatusRequest: async (payload) => {
        set({ loadingToggle: true });
        try {
            const { data } = await client.createCardStatusRequest(payload);
            return data;
        } finally {
            set({ loadingToggle: false });
        }
    },
}));
// ------------------CREDIT CARDS----------------------
export const useMyCreditCardStore = create((set) => ({
    creditCards: [],
    creditCardRequests: [],
    creditCardStatusRequests: [],
    loading: false,
    loadingRequest: false,
    loadingToggle: false,

    getMyCreditCards: async () => {
        set({ loading: true });
        try {
            const { data } = await client.getMyCreditCards();
            set({ creditCards: data.data || [] });
        } finally {
            set({ loading: false });
        }
    },

    getMyCreditCardRequests: async () => {
        try {
            const { data } = await client.getMyCreditCardRequests();
            set({ creditCardRequests: data.data || [] });
        } catch {
            // silencioso — no bloquea la vista
        }
    },

    // Reutiliza el endpoint genérico de cardStatusRequests
    // filtrando solo las de tipo CREDIT en el cliente
    getMyCreditCardStatusRequests: async () => {
        try {
            const { data } = await client.getMyCardStatusRequests();
            const creditOnly = (data.data || []).filter(
                (r) => r.cardType === 'CREDIT'
            );
            set({ creditCardStatusRequests: creditOnly });
        } catch {
            // silencioso
        }
    },

    createCreditCardRequest: async (payload) => {
        set({ loadingRequest: true });
        try {
            const { data } = await client.createMyCreditCardRequest(payload);
            return data;
        } finally {
            set({ loadingRequest: false });
        }
    },

    cancelCreditCardRequest: async (id) => {
        const { data } = await client.cancelMyCreditCardRequest(id);
        set((state) => ({
            creditCardRequests: state.creditCardRequests.map((r) =>
                r._id === id ? { ...r, status: 'CANCELLED' } : r
            ),
        }));
        return data;
    },

    createCreditCardStatusRequest: async (payload) => {
        set({ loadingToggle: true });
        try {
            // cardType: 'CREDIT' para que el backend sepa que es CreditCard
            const { data } = await client.createCardStatusRequest({
                ...payload,
                cardType: 'CREDIT',
            });
            return data;
        } finally {
            set({ loadingToggle: false });
        }
    },
}));
// ===== EXTRA FINANCING STORE =====
export const useMyExtraFinancingStore = create((set) => ({
    requests: [],
    financings: [],
    details: [],
    loading: false,
    loadingDetails: false,
    loadingPayment: false,

    getMyRequests: async () => {
        set({ loading: true });
        try {
            const { data } = await client.getMyExtraFinancingRequests();
            set({ requests: data.data || [] });
        } finally {
            set({ loading: false });
        }
    },

    createRequest: async (payload) => {
        const { data } = await client.createMyExtraFinancingRequest(payload);
        set((state) => ({ requests: [data.data, ...state.requests] }));
        return data;
    },

    cancelRequest: async (id) => {
        const { data } = await client.cancelMyExtraFinancingRequest(id);
        set((state) => ({
            requests: state.requests.map((r) =>
                r._id === id ? { ...r, status: 'CANCELLED' } : r
            )
        }));
        return data;
    },

    getFinancingsByCard: async (creditCardId) => {
        set({ loading: true, financings: [] });
        try {
            const { data } = await client.getMyFinancingsByCard(creditCardId);
            set({ financings: data.data || [] });
        } finally {
            set({ loading: false });
        }
    },

    getDetails: async (financingId) => {
        set({ loadingDetails: true, details: [] });
        try {
            const { data } = await client.getMyFinancingDetails(financingId);
            set({ details: data.data || [] });
        } finally {
            set({ loadingDetails: false });
        }
    },

    payInstallment: async (payload) => {
        set({ loadingPayment: true });
        try {
            const { data } = await client.payMyFinancingInstallment(payload);
            return data;
        } finally {
            set({ loadingPayment: false });
        }
    },
}));