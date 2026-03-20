import { useState, useEffect } from 'react';
import { getCatalogue } from '../api';
import ProductCard from '../components/ProductCard';

export default function Catalogue() {
  const [produits, setProduits] = useState([]);
  const [filtre, setFiltre] = useState('');
  const [categorie, setCategorie] = useState('');

  useEffect(() => {
    const params = {};
    if (filtre) params.gamme = filtre;
    if (categorie) params.categorie = categorie;
    getCatalogue(params).then(r => setProduits(r.data.produits)).catch(() => {});
  }, [filtre, categorie]);

  return (
    <div style={{ padding:'2rem', maxWidth:'1100px', margin:'0 auto' }}>
      <h1 style={{ color:'#0F0F1A', marginBottom:'0.5rem' }}>🛒 Catalogue Solar Coins</h1>
      <p style={{ color:'#64748B', marginBottom:'1.5rem', fontSize:'0.9rem' }}>
        Fournisseurs certifiés ANEREE — matériel de qualité garantie
      </p>

      {/* Filtres gamme */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
        {[
          { val:'', label:'Toutes gammes' },
          { val:'basic', label:'🟤 Basic' },
          { val:'standard', label:'🔵 Standard' },
          { val:'premium', label:'🟡 Premium' },
        ].map(g => (
          <button key={g.val} onClick={() => setFiltre(g.val)} style={{ padding:'5px 16px', borderRadius:'20px', border:`1.5px solid ${filtre===g.val ? '#7C3AED' : '#E2E8F0'}`, backgroundColor: filtre===g.val ? '#7C3AED' : '#fff', color: filtre===g.val ? '#fff' : '#64748B', cursor:'pointer', fontSize:'0.88rem', fontWeight: filtre===g.val ? 'bold' : 'normal' }}>
            {g.label}
          </button>
        ))}
      </div>

      {/* Filtres catégorie */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {[
          { val:'', label:'Tout' },
          { val:'panneau', label:'🔆 Panneaux' },
          { val:'batterie', label:'🔋 Batteries' },
          { val:'onduleur', label:'⚡ Onduleurs' },
          { val:'accessoire', label:'🔌 Accessoires' },
          { val:'kit', label:'📦 Kits' },
          { val:'service', label:'🔧 Services' },
        ].map(c => (
          <button key={c.val} onClick={() => setCategorie(c.val)} style={{ padding:'4px 12px', borderRadius:'20px', border:`1.5px solid ${categorie===c.val ? '#06B6D4' : '#E2E8F0'}`, backgroundColor: categorie===c.val ? '#06B6D4' : '#fff', color: categorie===c.val ? '#fff' : '#64748B', cursor:'pointer', fontSize:'0.82rem' }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grille produits */}
      {produits.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', backgroundColor:'#fff', borderRadius:'12px', color:'#64748B' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🏪</div>
          <p style={{ fontSize:'1.1rem', marginBottom:'0.5rem' }}>Aucun produit disponible pour l'instant.</p>
          <p style={{ fontSize:'0.9rem', color:'#aaa' }}>Les fournisseurs partenaires ajouteront bientôt leurs produits.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'1.5rem' }}>
          {produits.map(p => <ProductCard key={p.id} produit={p} />)}
        </div>
      )}
    </div>
  );
}