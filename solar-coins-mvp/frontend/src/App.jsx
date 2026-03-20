import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import InstallPWA from './components/InstallPWA';
import CookieBanner from './components/CookieBanner';

import Accueil from './pages/Accueil';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';
import Dashboard from './pages/Dashboard';
import MesInstallations from './pages/MesInstallations';
import NouvelleInstallation from './pages/NouvelleInstallation';
import SaisirProduction from './pages/SaisirProduction';
import MonWallet from './pages/MonWallet';
import Catalogue from './pages/Catalogue';
import MonCatalogue from './pages/MonCatalogue';
import AdminDashboard from './pages/AdminDashboard';
import CGU from './pages/CGU';
import Confidentialite from './pages/Confidentialite';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><MonWallet /></ProtectedRoute>} />
          <Route path="/catalogue" element={<ProtectedRoute><Catalogue /></ProtectedRoute>} />
          <Route path="/installations" element={<ProtectedRoute roles={['client','admin']}><MesInstallations /></ProtectedRoute>} />
          <Route path="/installations/nouvelle" element={<ProtectedRoute roles={['client','admin']}><NouvelleInstallation /></ProtectedRoute>} />
          <Route path="/productions/nouvelle" element={<ProtectedRoute roles={['client','agent','admin']}><SaisirProduction /></ProtectedRoute>} />
          <Route path="/mon-catalogue" element={<ProtectedRoute roles={['fournisseur','admin']}><MonCatalogue /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <CookieBanner />
        <InstallPWA />
      </BrowserRouter>
    </AuthProvider>
  );
}