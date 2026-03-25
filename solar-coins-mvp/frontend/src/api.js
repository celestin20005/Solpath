import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
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

// Missions
export const creerMission = (data) => API.post('/missions', data);
export const getMesMissions = () => API.get('/missions/mes');
export const getMissionsDisponibles = () => API.get('/missions/disponibles');
export const accepterMission = (id) => API.put(`/missions/${id}/accepter`);
export const creerDevis = (missionId, data) => API.post(`/missions/${missionId}/devis`, data);
export const accepterDevis = (devisId) => API.put(`/missions/devis/${devisId}/accepter`);
export const validerTravaux = (missionId) => API.put(`/missions/${missionId}/valider-travaux`);

// Techniciens
export const getTechniciens = (params) => API.get('/techniciens', { params });
export const creerProfilTechnicien = (data) => API.post('/techniciens', data);
export const updateDisponibilite = (data) => API.put('/techniciens/disponibilite', data);
export const validerInstallationTech = (id, data) => API.put(`/techniciens/valider-installation/${id}`, data);

export default API;

// Commandes
export const passerCommande = (data) =>
  API.post('/commandes', data);
export const getMesCommandes = () =>
  API.get('/commandes/mes');
export const getCommandesRecues = () =>
  API.get('/commandes/recues');
export const updateStatutCommande = (id, statut) =>
  API.put(`/commandes/${id}/statut`, { statut });

// Notifications
export const getMesNotifications = () =>
  API.get('/commandes/notifications');
export const marquerNotificationsLues = () =>
  API.put('/commandes/notifications/lues');