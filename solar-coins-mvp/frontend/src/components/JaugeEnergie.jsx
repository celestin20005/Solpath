import { useState, useEffect } from 'react';
import { getMonSolde, getStats } from '../api';
import { useAuth } from '../context/AuthContext';

export default function JaugeEnergie() {
  const { user } = useAuth();
  const [coins, setCoins] = useState(0);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getMonSolde().then(r => setCoins(r.data.solde_coins || 0)).catch(() => {});
    getStats().then(r => setStats(r.data)).catch(() => {});
  }, [user]);

  const maintenant = new Date();
  const jourActuel = maintenant.getDate();
  const totalJours = new Date(
    maintenant.getFullYear(),
    maintenant.getMonth() + 1, 0
  ).getDate();
  const jourRestants = totalJours - jourActuel;

  const aProduiCeMois = stats?.nb_mois_saisis > 0;
  const pourcentage = aProduiCeMois
    ? 100
    : Math.round((jourActuel / totalJours) * 85);

  const getCouleur = (n) => {
    if (n < 25) return '#EF4444';
    if (n < 50) return '#F59E0B';
    if (n < 75) return '#06B6D4';
    return '#10B981';
  };

  const couleur = getCouleur(pourcentage);

  return (
    <div style={{
      backgroundColor: '#0F0F1A',
      borderRadius: '16px',
      padding: '1.5rem',
      width: '240px',
      border: '1px solid #7C3AED33',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
    }}>
      {/* Titre */}
      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
        <span style={{ color: couleur }}>⚡</span> Énergie du mois
      </div>

      {/* Éclair SVG simple sans animation */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem', position: 'relative' }}>

        {/* Halo */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '130px', height: '230px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${couleur}33 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <svg width="110" height="210" viewBox="0 0 110 210" style={{ overflow: 'visible' }}>
          {/* Fond éclair */}
          <polygon
            points="65,5 22,97 50,97 18,205 90,80 58,80 90,5"
            fill="#1a1a2e"
            stroke="#3D3D5E"
            strokeWidth="2"
          />

          {/* Liquide — rectangle clippé manuellement */}
          <clipPath id="clipEclair">
            <polygon points="65,5 22,97 50,97 18,205 90,80 58,80 90,5" />
          </clipPath>

          <rect
            x="0"
            y={210 - (210 * pourcentage / 100)}
            width="110"
            height={210 * pourcentage / 100}
            fill={couleur}
            opacity="0.85"
            clipPath="url(#clipEclair)"
            style={{ transition: 'y 1.5s ease, height 1.5s ease' }}
          />

          {/* Contour éclair lumineux */}
          <polygon
            points="65,5 22,97 50,97 18,205 90,80 58,80 90,5"
            fill="none"
            stroke={couleur}
            strokeWidth="2.5"
          />

          {/* Pourcentage */}
          <text
            x="55" y="112"
            textAnchor="middle"
            fill={pourcentage > 50 ? '#fff' : couleur}
            fontSize="20"
            fontWeight="bold"
            fontFamily="Arial"
          >
            {Math.round(pourcentage)}%
          </text>
        </svg>
      </div>

      {/* Coins */}
      <div style={{
        backgroundColor: '#16213E',
        borderRadius: '10px',
        padding: '0.8rem',
        marginBottom: '1rem',
        border: `1px solid ${couleur}`,
      }}>
        <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.2rem', letterSpacing: '1px' }}>
          SOLAR COINS CE MOIS
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: couleur }}>
          ⚡ {coins}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
          = {(coins * 5).toLocaleString()} FCFA
        </div>
      </div>

      {/* Barre jours */}
      <div style={{ marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Jour {jourActuel}/{totalJours}</span>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{jourRestants}j restants</span>
        </div>
        <div style={{ backgroundColor: '#2D2D4E', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
          <div style={{
            width: `${(jourActuel / totalJours) * 100}%`,
            height: '100%',
            backgroundColor: couleur,
            borderRadius: '4px',
          }} />
        </div>
      </div>

      {/* Message */}
      <div style={{ fontSize: '0.78rem', color: couleur, fontStyle: 'italic' }}>
        {pourcentage < 25 && `🌱 Encore ${jourRestants} jours...`}
        {pourcentage >= 25 && pourcentage < 50 && '⚡ Votre énergie travaille !'}
        {pourcentage >= 50 && pourcentage < 75 && '🚀 Excellent mois !'}
        {pourcentage >= 75 && '🏆 Vos Coins vous attendent !'}
      </div>
    </div>
  );
}