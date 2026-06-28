import { axiosClient } from './api';

// ===== ACCOUNTS =====
export const getMyAccounts = async () =>
  await axiosClient.get('/accounts');

export const getMyAccountDetails = async (id) =>
  await axiosClient.get(`/accounts/${id}`);

export const openMyAccount = async (data) =>
  await axiosClient.post('/accounts', data);

// ===== TRANSACTIONS =====
export const getMyTransactions = async (params) =>
  await axiosClient.get('/transactions', { params });

export const getMyAccountHistory = async (id) =>
  await axiosClient.get(`/transactions/account/${id}`);

export const createMyTransaction = async (data) =>
  await axiosClient.post('/transactions', data);

export const findAccountByNumber = async (accountNumber) =>
    await axiosClient.get('/accounts/find', { params: { accountNumber } });

// ===== CARDS (DÉBITO) =====
export const getMyCards = async (params) =>
  await axiosClient.get('/cards', { params });

// Solicitud de tarjeta → va a cardRequests, no a cards directamente
export const createCardRequest = async (data) =>
  await axiosClient.post('/cardRequests', data);

export const getMyCardRequests = async () =>
  await axiosClient.get('/cardRequests');

export const cancelCardRequest = async (id) =>
  await axiosClient.patch(`/cardRequests/${id}/cancel`);

// Solicitud de cambio de estado (activar/desactivar)
export const createCardStatusRequest = async (data) =>
  await axiosClient.post('/cardStatusRequests', data);

export const getMyCardStatusRequests = async () =>
  await axiosClient.get('/cardStatusRequests');

export const cancelCardStatusRequest = async (id) =>
  await axiosClient.patch(`/cardStatusRequests/${id}/cancel`);

// ===== CREDIT CARDS =====
export const getMyCreditCards = async () =>
  await axiosClient.get('/creditCards');

export const requestCreditCard = async (data) =>
  await axiosClient.post('/creditCards', data);

// DESPUÉS
export const payCreditCard = async (data) =>
  await axiosClient.post('/creditCardPayments/pay', data);

export const getMyCreditCardPayments = async (params) =>
  await axiosClient.get('/creditCardPayments/payments', { params });
// ===== LOANS =====
export const getMyLoans = async () =>
  await axiosClient.get('/loans');

export const getMyLoanById = async (id) =>
  await axiosClient.get(`/loans/${id}`);

export const payLoanInstallment = async (data) =>
  await axiosClient.post('/loanDetails/pay', data);

export const getLoanDetails = async (loanId) =>
    await axiosClient.get(`/loanDetails/${loanId}`);

// ===== LOAN APPLICATIONS =====
export const getMyLoanApplications = async () =>
  await axiosClient.get('/loanApplications');

export const createLoanApplication = async (data) =>
  await axiosClient.post('/loanApplications', data);

export const updateLoanApplication = async (id, data) =>
  await axiosClient.put(`/loanApplications/${id}`, data);

export const cancelLoanApplication = async (id) =>
  await axiosClient.patch(`/loanApplications/${id}/cancel`);

// ===== PRODUCTS =====
export const getActiveProducts = async (params) =>
  await axiosClient.get('/products', { params });

// ===== PURCHASES =====
export const getPurchaseCatalog = async (params) =>
  await getActiveProducts(params);

export const getMyPurchases = async (params) =>
  await axiosClient.get('/purchases', { params });

export const processMyPurchase = async (data) =>
  await axiosClient.post('/purchases', data);

// ===== FAVORITES =====
export const getMyFavorites = async () =>
  await axiosClient.get('/favorites');

export const addFavorite = async (data) =>
  await axiosClient.post('/favorites', data);

export const removeFavorite = async (id) =>
  await axiosClient.delete(`/favorites/${id}`);

// ===== EXTRA FINANCING =====
export const getMyFinancings = async () =>
  await axiosClient.get('/extra-financings');

export const requestExtraFinancing = async (data) =>
  await axiosClient.post('/extra-financings', data);

// ===== EXCHANGE =====
export const convertAmount = async (data) =>
  await axiosClient.post('/exchange/convert', data);
// ===== CREDIT CARD REQUESTS (solicitud de nueva tarjeta crédito) =====
export const getMyCreditCardRequests = async () =>
  await axiosClient.get('/creditCardRequests');

export const createMyCreditCardRequest = async (data) =>
  await axiosClient.post('/creditCardRequests', data);

export const cancelMyCreditCardRequest = async (id) =>
  await axiosClient.patch(`/creditCardRequests/${id}/cancel`);
// ===== EXTRA FINANCING REQUESTS =====
export const getMyExtraFinancingRequests = async () =>
  await axiosClient.get('/extraFinancingRequests');

export const createMyExtraFinancingRequest = async (data) =>
  await axiosClient.post('/extraFinancingRequests', data);

export const cancelMyExtraFinancingRequest = async (id) =>
  await axiosClient.patch(`/extraFinancingRequests/${id}/cancel`);

// Extra Financing detail por tarjeta (financiamientos activos)
export const getMyFinancingsByCard = async (creditCardId) =>
  await axiosClient.get(`/extraFinancings/card/${creditCardId}`);

export const getMyFinancingDetails = async (financingId) =>
  await axiosClient.get(`/extraFinancingDetails/${financingId}`);

export const payMyFinancingInstallment = async (data) =>
  await axiosClient.post('/extraFinancingPayments', data);