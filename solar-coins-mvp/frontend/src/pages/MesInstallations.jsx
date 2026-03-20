import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMesInstallations } from '../api';

export default function MesInstallations() {
  const [installations, setInstallations] = useState([]);

  useEffect(() => {
    getMesInstallations().then(r => setInstallations(r.data.installations)).catch(() => {});
  }, []);

  const couleurs = { basic:'#8B5E3C', standard:'#1565C0', premium:'#E67E00' };

  return (
    <div style={{ padding:'2rem', maxWidth:'1000px', margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <h1 style={{ color:'#0F0F1A', margin:0 }}>⚡ Mes Installations Solaires</h1>
        <Link to="/installations/nouvelle" style={{ backgroundColor:'#7C3AED', color:'#fff', padding:'10px 20px', borderRadius:'6px', fontWeight:'bold' }}>
          ➕ Ajouter
        </Link>
      </div>

      {installations.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', backgroundColor:'#fff', borderRadius:'12px', color:'#64748B' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>☀️</div>
          <p style={{ fontSize:'1.1rem', marginBottom:'1.5rem' }}>Aucune installation enregistrée.</p>
          <Link to="/installations/nouvelle" style={{ backgroundColor:'#7C3AED', color:'#fff', padding:'12px 24px', borderRadius:'8px', fontWeight:'bold' }}>
            Déclarer ma première installation
          </Link>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'1.5rem' }}>
          {installations.map(inst => (
            <div key={inst.id} style={{ backgroundColor:'#fff', borderRadius:'8px', padding:'1.5rem', boxShadow:'0 2px 8px rgba(124,58,237,0.06)', borderTop:`4px solid ${couleurs[inst.gamme]}` }}>
              <div style={{ color:couleurs[inst.gamme], fontWeight:'bold', fontSize:'0.85rem', marginBottom:'0.5rem' }}>
                {inst.gamme.toUpperCase()}
              </div>
              <div style={{ fontSize:'1.8rem', fontWeight:'bold', color:'#0F0F1A', marginBottom:'0.5rem' }}>
                {inst.puissance_wc} Wc
              </div>
              <div style={{ fontSize:'0.85rem', color:'#888', marginBottom:'0.3rem' }}>
                📍 {inst.quartier || '—'}, {inst.ville}
              </div>
              {inst.date_installation && (
                <div style={{ fontSize:'0.85rem', color:'#888' }}>
                  📅 {inst.date_installation}
                </div>
              )}
              <div style={{ marginTop:'0.8rem', fontSize:'0.85rem', color: inst.actif ? '#10B981' : '#EF4444' }}>
                {inst.actif ? '✅ Active' : '❌ Inactive'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}