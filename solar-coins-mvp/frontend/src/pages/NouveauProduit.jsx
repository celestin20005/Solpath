import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ajouterProduit } from '../api';
import BoutonFermer from '../components/BoutonFermer';

export default function NouveauProduit() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom_produit: '',
    description: '',
    categorie: 'panneau',
    prix_fcfa: '',
    prix_coins: '',
    gamme_cible: 'tous'
  });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');
    try {
      await ajouterProduit(form);
      navigate('/mes-produits');
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'80vh', backgroundColor:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ backgroundColor:'#fff', padding:'2.5rem', borderRadius:'14px', boxShadow:'0 4px 24px rgba(124,58,237,0.1)', width:'100%', maxWidth:'520px', position:'relative' }}>
        <BoutonFermer vers="/mes-produits" />
        <h2 style={{ color:'#0F0F1A', marginBottom:'1.5rem' }}>➕ Ajouter un produit</h2>

        {erreur && (
          <div style={{ backgroundColor:'#fce8e8', color:'#a32d2d', padding:'10px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.9rem' }}>
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { name:'nom_produit', label:'Nom du produit', type:'text', placeholder:'Ex: Panneau 550W Mono-PERC' },
            { name:'prix_fcfa', label:'Prix en FCFA', type:'number', placeholder:'Ex: 75000' },
            { name:'prix_coins', label:'Prix en Solar Coins', type:'number', placeholder:'Ex: 15000' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' }}>
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={handleChange}
                required
                style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem', boxSizing:'border-box' }}
              />
            </div>
          ))}

          <div style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' }}>
              Catégorie
            </label>
            <select name="categorie" value={form.categorie} onChange={handleChange}
              style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem' }}>
              <option value="panneau">🔆 Panneau solaire</option>
              <option value="batterie">🔋 Batterie</option>
              <option value="onduleur">⚡ Onduleur</option>
              <option value="accessoire">🔌 Accessoire</option>
              <option value="kit">📦 Kit complet</option>
              <option value="service">🔧 Service</option>
            </select>
          </div>

          <div style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' }}>
              Gamme cible
            </label>
            <select name="gamme_cible" value={form.gamme_cible} onChange={handleChange}
              style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem' }}>
              <option value="tous">Toutes les gammes</option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div style={{ marginBottom:'1.5rem' }}>
            <label style={{ display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' }}>
              Description
            </label>
            <textarea
              name="description"
              placeholder="Décrivez votre produit..."
              value={form.description}
              onChange={handleChange}
              style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem', height:'80px', resize:'vertical', boxSizing:'border-box' }}
            />
          </div>

          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'12px', backgroundColor:'#7C3AED', color:'#fff', border:'none', borderRadius:'8px', fontSize:'1rem', fontWeight:'bold', cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Ajout en cours...' : '✅ Ajouter le produit'}
          </button>
        </form>
      </div>
    </div>
  );
}