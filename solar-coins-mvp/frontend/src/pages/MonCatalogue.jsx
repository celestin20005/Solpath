import { useState, useEffect } from 'react';
import { getCatalogue, ajouterProduit } from '../api';
import { useAuth } from '../context/AuthContext';

export default function MonCatalogue() {
  const { user } = useAuth();
  const [produits, setProduits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom_produit:'', description:'', categorie:'panneau', prix_fcfa:'', prix_coins:'', gamme_cible:'tous' });
  const [erreur, setErreur] = useState('');

  const charger = () => {
    getCatalogue().then(r => {
      const mesProduits = r.data.produits.filter(p => p.fournisseur_id === user?.id);
      setProduits(mesProduits);
    }).catch(() => {});
  };

  useEffect(() => { charger(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      await ajouterProduit({ ...form, prix_fcfa: parseInt(form.prix_fcfa), prix_coins: parseInt(form.prix_coins) });
      setForm({ nom_produit:'', description:'', categorie:'panneau', prix_fcfa:'', prix_coins:'', gamme_cible:'tous' });
      setShowForm(false);
      charger();
    } catch (err) {
      setErreur(err.response?.data?.erreur || "Erreur lors de l'ajout");
    }
  };

  return (
    <div style={{ padding:'2rem', maxWidth:'1100px', margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h1 style={{ color:'#0F0F1A', margin:0 }}>🏪 Mon Catalogue</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor:'#7C3AED', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' }}>
          {showForm ? '✕ Annuler' : '➕ Ajouter un produit'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor:'#fff', padding:'1.5rem', borderRadius:'8px', boxShadow:'0 2px 10px rgba(124,58,237,0.08)', marginBottom:'1.5rem' }}>
          <h3 style={{ color:'#0F0F1A', marginBottom:'1rem' }}>Nouveau produit</h3>
          {erreur && <div style={{ backgroundColor:'#fce8e8', color:'#a32d2d', padding:'10px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.9rem' }}>{erreur}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { name:'nom_produit', label:'Nom du produit', type:'text', placeholder:'Panneau 550W Mono-PERC' },
              { name:'description', label:'Description', type:'text', placeholder:'Description courte', required:false },
              { name:'prix_fcfa', label:'Prix en FCFA', type:'number', placeholder:'75000' },
              { name:'prix_coins', label:'Prix en Coins', type:'number', placeholder:'15000' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom:'0.8rem' }}>
                <label style={lbl}>{f.label}</label>
                <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} style={inp} required={f.required !== false} />
              </div>
            ))}
            <div style={{ marginBottom:'0.8rem' }}>
              <label style={lbl}>Catégorie</label>
              <select name="categorie" value={form.categorie} onChange={handleChange} style={inp}>
                {['panneau','batterie','onduleur','accessoire','kit','service','autre'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={lbl}>Gamme cible</label>
              <select name="gamme_cible" value={form.gamme_cible} onChange={handleChange} style={inp}>
                <option value="tous">Tous</option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <button type="submit" style={{ backgroundColor:'#7C3AED', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' }}>
              ✅ Ajouter au catalogue
            </button>
          </form>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'1rem' }}>
        {produits.length === 0 ? (
          <p style={{ color:'#888' }}>Vous n'avez pas encore de produits dans le catalogue.</p>
        ) : (
          produits.map(p => (
            <div key={p.id} style={{ backgroundColor:'#fff', borderRadius:'8px', padding:'1.2rem', boxShadow:'0 2px 6px rgba(124,58,237,0.06)' }}>
              <div style={{ color:'#7C3AED', fontSize:'0.75rem', fontWeight:'bold', marginBottom:'0.3rem' }}>{p.gamme_cible?.toUpperCase()}</div>
              <h3 style={{ color:'#0F0F1A', margin:'0 0 0.5rem', fontSize:'1rem' }}>{p.nom_produit}</h3>
              <p style={{ color:'#888', fontSize:'0.85rem', marginBottom:'0.8rem' }}>{p.description}</p>
              <div style={{ display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'0.9rem' }}>
                <span>{p.prix_fcfa?.toLocaleString()} FCFA</span>
                <span style={{ color:'#F59E0B' }}>⚡ {p.prix_coins?.toLocaleString()} Coins</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const lbl = { display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' };
const inp = { width:'100%', padding:'8px', border:'1px solid #ddd', borderRadius:'6px', boxSizing:'border-box' };