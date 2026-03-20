import { useState, useEffect } from 'react';
import { getAdminDashboard, getProductionsEnAttente, validerProduction } from '../api';
import StatCard from '../components/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [enAttente, setEnAttente] = useState([]);

  const charger = () => {
    getAdminDashboard().then(r => setStats(r.data.stats)).catch(() => {});
    getProductionsEnAttente().then(r => setEnAttente(r.data.productions)).catch(() => {});
  };

  useEffect(() => { charger(); }, []);

  const handleValider = async (id) => {
    try {
      await validerProduction(id);
      charger();
    } catch (err) {
      alert(err.response?.data?.erreur || 'Erreur');
    }
  };

  return (
    <div style={{ padding:'2rem', maxWidth:'1100px', margin:'0 auto' }}>
      <h1 style={{ color:'#0F0F1A', marginBottom:'1.5rem' }}>🛠️ Dashboard Administrateur — SOLPATH</h1>

      {stats && (
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'2rem' }}>
          <StatCard icone="👥" valeur={stats.total_users} label="Utilisateurs" couleur="#7C3AED" />
          <StatCard icone="⚡" valeur={stats.total_installations} label="Installations" couleur="#06B6D4" />
          <StatCard icone="🪙" valeur={stats.total_coins_emis} label="Coins émis" couleur="#F59E0B" />
          <StatCard icone="💰" valeur={`${(stats.valeur_coins_fcfa || 0).toLocaleString()} FCFA`} label="Valeur totale" couleur="#F59E0B" />
          <StatCard icone="⏳" valeur={stats.productions_en_attente} label="En attente" couleur="#EF4444" />
          <StatCard icone="🛒" valeur={stats.total_produits} label="Produits" couleur="#10B981" />
        </div>
      )}

      <h2 style={{ color:'#0F0F1A', marginBottom:'1rem', paddingBottom:'0.5rem', borderBottom:'2px solid #7C3AED' }}>
        ⏳ Productions en attente ({enAttente.length})
      </h2>

      {enAttente.length === 0 ? (
        <div style={{ color:'#10B981', padding:'1rem', backgroundColor:'#F0FDF4', borderRadius:'8px' }}>
          ✅ Aucune production en attente — tout est à jour !
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {enAttente.map(p => (
            <div key={p.id} style={{ backgroundColor:'#fff', padding:'1rem 1.5rem', borderRadius:'10px', boxShadow:'0 1px 6px rgba(124,58,237,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
              <div>
                <strong style={{ color:'#0F0F1A' }}>{p.client_nom}</strong>
                <span style={{ color:'#94A3B8', fontSize:'0.85rem' }}> — {p.client_email}</span>
              </div>
              <span style={{ color:'#64748B', fontSize:'0.9rem' }}>
                {p.mois} · {p.gamme?.toUpperCase()} · {p.kwh_produits} kWh
              </span>
              <span style={{ color:'#F59E0B', fontWeight:'bold' }}>⚡ {p.coins_gagnes} Coins</span>
              <button onClick={() => handleValider(p.id)} style={{ backgroundColor:'#7C3AED', color:'#fff', border:'none', padding:'6px 16px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', fontSize:'0.85rem' }}>
                ✅ Valider
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}