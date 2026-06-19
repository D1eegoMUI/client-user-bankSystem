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

// ===== CARDS (DÉBITO) =====
export const getMyCards = async (params) =>
  await axiosClient.get('/cards', { params });

export const requestCard = async (data) =>
  await axiosClient.post('/cards', data);

export const toggleMyCardStatus = async (id) =>
  await axiosClient.patch(`/cards/${id}/status`);

// ===== CREDIT CARDS =====
export const getMyCreditCards = async () =>
  await axiosClient.get('/creditCards');

export const requestCreditCard = async (data) =>
  await axiosClient.post('/creditCards', data);

export const payCreditCard = async (data) =>
  await axiosClient.post('/creditCards/pay', data);

export const getMyCreditCardPayments = async (params) =>
  await axiosClient.get('/creditCards/payments', { params });

// ===== LOANS =====
export const getMyLoans = async () =>
  await axiosClient.get('/loans');

export const getMyLoanById = async (id) =>
  await axiosClient.get(`/loans/${id}`);

export const payLoanInstallment = async (data) =>
  await axiosClient.post('/loan-payments', data);

// ===== LOAN APPLICATIONS =====
export const getMyLoanApplications = async () =>
  await axiosClient.get('/loan-applications');

export const createLoanApplication = async (data) =>
  await axiosClient.post('/loan-applications', data);

export const updateLoanApplication = async (id, data) =>
  await axiosClient.put(`/loan-applications/${id}`, data);

export const cancelLoanApplication = async (id) =>
  await axiosClient.patch(`/loan-applications/${id}/cancel`);

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

export const payMyFinancingInstallment = async (data) =>
  await axiosClient.post('/extra-financing-payments', data);

// ===== EXCHANGE =====
export const convertAmount = async (data) =>
  await axiosClient.post('/exchange/convert', data);
