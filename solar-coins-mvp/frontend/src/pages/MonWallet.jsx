import { useState, useEffect } from 'react';
import { getMonSolde, getHistorique, getStats } from '../api';
import StatCard from '../components/StatCard';

export default function MonWallet() {
  const [solde, setSolde] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getMonSolde().then(r => setSolde(r.data)).catch(() => {});
    getHistorique().then(r => setHistorique(r.data.historique)).catch(() => {});
    getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ padding:'2rem', maxWidth:'900px', margin:'0 auto' }}>
      <h1 style={{ color:'#0F0F1A', marginBottom:'1.5rem' }}>⚡ Mon Wallet Solar Coins</h1>

      {/* Solde principal */}
      {solde && (
        <div style={{ background:'linear-gradient(135deg, #0F0F1A 0%, #1a0a2e 100%)', borderRadius:'14px', padding:'2.5rem', textAlign:'center', marginBottom:'2rem', border:'1px solid #7C3AED33' }}>
          <div style={{ fontSize:'0.82rem', color:'#94A3B8', marginBottom:'0.5rem', letterSpacing:'1px' }}>SOLDE ACTUEL</div>
          <div style={{ fontSize:'3.5rem', fontWeight:'bold', color:'#F59E0B' }}>{solde.solde_coins} Coins</div>
          <div style={{ fontSize:'1.2rem', color:'#06B6D4', marginTop:'0.4rem' }}>
            = {(solde.valeur_fcfa || 0).toLocaleString()} FCFA
          </div>
          <div style={{ fontSize:'0.78rem', color:'#475569', marginTop:'0.4rem' }}>1 Solar Coin = 5 FCFA</div>
        </div>
      )}

      {/* Statistiques */}
      {stats && (
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'2rem' }}>
          <StatCard icone="☀️" valeur={`${stats.total_kwh_produits || 0} kWh`} label="Total produit" couleur="#06B6D4" />
          <StatCard icone="🏆" valeur={stats.total_coins_gagnes_historique || 0} label="Coins gagnés total" couleur="#F59E0B" />
          <StatCard icone="📅" valeur={stats.nb_mois_saisis || 0} label="Mois déclarés" couleur="#7C3AED" />
          <StatCard icone="⚡" valeur={`${stats.meilleur_mois_kwh || 0} kWh`} label="Meilleur mois" couleur="#10B981" />
        </div>
      )}

      {/* Historique */}
      <h2 style={{ color:'#0F0F1A', marginBottom:'1rem', paddingBottom:'0.5rem', borderBottom:'2px solid #7C3AED' }}>
        Historique des productions
      </h2>

      {historique.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', backgroundColor:'#fff', borderRadius:'12px', color:'#64748B' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📊</div>
          <p>Aucune production déclarée pour l'instant.</p>
        </div>
      ) : (
        <div style={{ backgroundColor:'#fff', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 12px rgba(124,58,237,0.07)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', padding:'10px 16px', backgroundColor:'#0F0F1A', color:'#fff', fontSize:'0.78rem', fontWeight:'bold' }}>
            {['Mois','kWh','Coins','FCFA','Statut'].map(h => <span key={h}>{h}</span>)}
          </div>
          {historique.map((h, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', padding:'10px 16px', borderBottom:'1px solid #F1F5F9', fontSize:'0.88rem', color:'#374151' }}>
              <span>{h.mois}</span>
              <span>{h.kwh_produits} kWh</span>
              <span style={{ color:'#F59E0B', fontWeight:'bold' }}>⚡ {h.coins_gagnes}</span>
              <span>{(h.valeur_fcfa || 0).toLocaleString()} FCFA</span>
              <span style={{ color: h.valide ? '#10B981' : '#F59E0B' }}>
                {h.valide ? '✅ Validé' : '⏳ En attente'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}