import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getMesInstallations } from '../api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import JaugeEnergie from '../components/JaugeEnergie';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [installations, setInstallations] = useState([]);

  useEffect(() => {
    getStats().then(r => setStats(r.data)).catch(() => {});
    if (user?.role === 'client' || user?.role === 'admin') {
      getMesInstallations().then(r => setInstallations(r.data.installations)).catch(() => {});
    }
  }, [user]);

  return (
    <div style={{ padding:'2rem', maxWidth:'1100px', margin:'0 auto' }}>
      <div style={{ marginBottom:'1.5rem', paddingBottom:'1rem', borderBottom:'1px solid #E2E8F0' }}>
        <h1 style={{ color:'#0F0F1A', fontSize:'1.6rem', margin:'0 0 0.2rem' }}>
          Bonjour {user?.nom} 👋
        </h1>
        <p style={{ color:'#64748B', margin:0, fontSize:'0.9rem' }}>
          Tableau de bord SOLPATH by NEXCID
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'2rem' }}>
          <StatCard icone="⚡" valeur={stats.solde_actuel_coins} label="Solar Coins" couleur="#F59E0B" />
          <StatCard icone="💰" valeur={`${(stats.solde_actuel_fcfa || 0).toLocaleString()} FCFA`} label="Valeur" couleur="#7C3AED" />
          <StatCard icone="☀️" valeur={`${stats.total_kwh_produits || 0} kWh`} label="Total produit" couleur="#06B6D4" />
          <StatCard icone="📅" valeur={stats.nb_mois_saisis || 0} label="Mois déclarés" couleur="#10B981" />
        </div>
      )}
      <div style={{ display:'flex', justifyContent:'center', margin:'2rem 0' }}> <JaugeEnergie /> </div>

      {/* Jauge + Actions rapides */}
<div style={{ display:'flex', gap:'2rem', flexWrap:'wrap', alignItems:'flex-start', marginBottom:'2rem' }}>

  {/* Jauge énergie */}
  <JaugeEnergie />

  {/* Actions rapides */}
  <div style={{ flex:1, minWidth:'200px' }}>
    <h2 style={{ color:'#0F0F1A', marginBottom:'1rem', paddingBottom:'0.5rem', borderBottom:'2px solid #7C3AED' }}>
      Actions rapides
    </h2>
    <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
      {(user?.role === 'client' || user?.role === 'admin') && (
        <Link to="/productions/nouvelle" style={btnStyle('#7C3AED')}>
          ⚡ Saisir ma production
        </Link>
      )}
      <Link to="/wallet" style={btnStyle('#06B6D4')}>
        🪙 Mon wallet
      </Link>
      <Link to="/catalogue" style={btnStyle('#0F0F1A')}>
        🛒 Catalogue
      </Link>
      {(user?.role === 'client' || user?.role === 'admin') && (
        <Link to="/installations/nouvelle" style={btnStyle('#F59E0B')}>
          ➕ Nouvelle installation
        </Link>
      )}
      <Link to="/demander-mission" style={btnStyle('#EF4444')}>
        🔧 Demander une intervention
      </Link>
      <Link to="/techniciens" style={btnStyle('#10B981')}>
        👷 Trouver un technicien
      </Link>
    </div>
  </div>
</div>

      {/* Mes installations */}
      {installations.length > 0 && (
        <div>
          <h2 style={{ color:'#0F0F1A', marginBottom:'1rem', paddingBottom:'0.5rem', borderBottom:'2px solid #7C3AED' }}>
            Mes installations
          </h2>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            {installations.map(inst => (
              <div key={inst.id} style={{ backgroundColor:'#fff', borderRadius:'10px', padding:'1.2rem', minWidth:'160px', textAlign:'center', boxShadow:'0 2px 8px rgba(124,58,237,0.06)', borderTop:`3px solid ${couleurGamme[inst.gamme]}` }}>
                <div style={{ color:couleurGamme[inst.gamme], fontWeight:'bold', fontSize:'0.75rem', marginBottom:'0.3rem', letterSpacing:'1px' }}>
                  {inst.gamme.toUpperCase()}
                </div>
                <div style={{ fontSize:'1.4rem', fontWeight:'bold', color:'#0F0F1A' }}>
                  {inst.puissance_wc} Wc
                </div>
                <div style={{ fontSize:'0.8rem', color:'#94A3B8', marginTop:'0.2rem' }}>
                  {inst.quartier || inst.ville}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si pas d'installation */}
      {installations.length === 0 && (user?.role === 'client' || user?.role === 'admin') && (
        <div style={{ textAlign:'center', padding:'3rem', backgroundColor:'#fff', borderRadius:'12px', boxShadow:'0 2px 12px rgba(124,58,237,0.06)' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>☀️</div>
          <h3 style={{ color:'#0F0F1A', marginBottom:'0.5rem' }}>Pas encore d'installation</h3>
          <p style={{ color:'#64748B', marginBottom:'1.5rem' }}>
            Déclarez votre première installation solaire pour commencer à gagner des Solar Coins.
          </p>
          <Link to="/installations/nouvelle" style={btnStyle('#7C3AED')}>
            ➕ Déclarer mon installation
          </Link>
        </div>
      )}
    </div>
  );
}

const couleurGamme = {
  basic: '#8B5E3C',
  standard: '#1565C0',
  premium: '#E67E00'
};

const btnStyle = (bg) => ({
  backgroundColor: bg,
  color: '#fff',
  padding: '12px 20px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '0.9rem'
});