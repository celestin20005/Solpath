import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('solpath_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const inscription = (data) => API.post('/auth/inscription', data);
export const connexion = (data) => API.post('/auth/connexion', data);
export const getProfil = () => API.get('/auth/profil');

// Installations
export const creerInstallation = (data) => API.post('/installations', data);
export const getMesInstallations = () => API.get('/installations/mes');

// Productions
export const saisirProduction = (data) => API.post('/productions', data);
export const getMesProductions = () => API.get('/productions/mes');

// Wallet
export const getMonSolde = () => API.get('/wallet/mon-solde');
export const getHistorique = () => API.get('/wallet/historique');
export const getStats = () => API.get('/wallet/stats');

// Produits
export const getCatalogue = (params) => API.get('/produits', { params });
export const ajouterProduit = (data) => API.post('/produits', data);
export const modifierProduit = (id, data) => API.put(`/produits/${id}`, data);

// Admin
export const getAdminDashboard = () => API.get('/admin/dashboard');
export const getAdminUsers = () => API.get('/admin/users');
export const getProductionsEnAttente = () => API.get('/admin/productions/en-attente');
export const validerProduction = (id) => API.put(`/productions/${id}/valider`);

export default API;