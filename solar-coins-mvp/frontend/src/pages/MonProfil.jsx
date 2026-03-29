import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfil, updateProfil } from '../api';

export default function MonProfil() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    nom: '', telephone: '', ville: '', bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);

  useEffect(() => {
    getProfil().then(r => {
      const u = r.data.user;
      setForm({
        nom: u.nom || '',
        telephone: u.telephone || '',
        ville: u.ville || '',
        bio: u.bio || ''
      });
    }).catch(() => {});
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await updateProfil(form);
      setSucces(true);
      setTimeout(() => setSucces(false), 3000);
    } catch (err) {
      alert(err.response?.data?.erreur || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = {
    client: '👤 Client',
    fournisseur: '🏪 Fournisseur',
    agent: '🔧 Technicien',
    admin: '⚙️ Administrateur'
  };

  return (
    <div style={{ padding:'2rem', maxWidth:'600px', margin:'0 auto' }}>
      <h1 style={{ color:'#0F0F1A', marginBottom:'0.5rem' }}>👤 Mon Profil</h1>

      {/* Badge rôle */}
      <div style={{ display:'inline-block', backgroundColor:'#EDE9FE', color:'#7C3AED', padding:'4px 14px', borderRadius:'20px', fontSize:'0.85rem', fontWeight:'bold', marginBottom:'1.5rem' }}>
        {roleLabel[user?.role] || user?.role}
      </div>

      {succes && (
        <div style={{ backgroundColor:'#D1FAE5', color:'#065F46', padding:'10px', borderRadius:'8px', marginBottom:'1rem', fontSize:'0.9rem' }}>
          ✅ Profil mis à jour avec succès !
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor:'#fff', padding:'2rem', borderRadius:'12px', boxShadow:'0 2px 12px rgba(124,58,237,0.08)' }}>

        {/* Infos de base */}
        <h3 style={{ color:'#7C3AED', marginBottom:'1rem', fontSize:'0.95rem' }}>
          Informations de base
        </h3>

        {[
          { name:'nom', label:'Nom complet', type:'text' },
          { name:'telephone', label:'Téléphone', type:'tel' },
          { name:'ville', label:'Ville', type:'text', placeholder:'Ex: Bobo-Dioulasso' },
        ].map(f => (
          <div key={f.name} style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' }}>
              {f.label}
            </label>
            <input
              type={f.type}
              name={f.name}
              placeholder={f.placeholder || ''}
              value={form[f.name]}
              onChange={handleChange}
              style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem', boxSizing:'border-box' }}
            />
          </div>
        ))}

        {/* Bio */}
        <div style={{ marginBottom:'1.5rem' }}>
          <label style={{ display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' }}>
            {user?.role === 'fournisseur'
              ? 'Description de votre boutique'
              : user?.role === 'agent'
              ? 'Votre expertise et expérience'
              : 'À propos de vous'}
          </label>
          <textarea
            name="bio"
            placeholder={
              user?.role === 'fournisseur'
                ? 'Ex: Spécialiste en panneaux solaires certifiés ANEREE depuis 2018...'
                : user?.role === 'agent'
                ? 'Ex: Technicien certifié ANEREE avec 5 ans d\'expérience...'
                : 'Ex: Propriétaire de panneaux solaires depuis 2023...'
            }
            value={form.bio}
            onChange={handleChange}
            style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem', height:'100px', resize:'vertical', boxSizing:'border-box' }}
          />
        </div>

        {/* Email (non modifiable) */}
        <div style={{ backgroundColor:'#F8FAFC', padding:'0.8rem', borderRadius:'8px', marginBottom:'1.5rem', fontSize:'0.85rem', color:'#64748B' }}>
          📧 Email : <strong>{user?.email}</strong>
          <span style={{ marginLeft:'0.5rem', fontSize:'0.75rem' }}>(non modifiable)</span>
        </div>

        <button type="submit" disabled={loading}
          style={{ width:'100%', padding:'12px', backgroundColor:'#7C3AED', color:'#fff', border:'none', borderRadius:'8px', fontSize:'1rem', fontWeight:'bold', cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Enregistrement...' : '💾 Enregistrer'}
        </button>
      </form>
    </div>
  );
}