import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProduits } from '../api';
import { useAuth } from '../context/AuthContext';

export default function MesProduits() {
  const { user } = useAuth();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduits()
      .then(r => {
        // Filtrer seulement les produits du fournisseur connecté
        const mesProduits = r.data.produits.filter(
          p => p.fournisseur_id === user.id
        );
        setProduits(mesProduits);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div style={{ padding:'2rem', maxWidth:'1000px', margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h1 style={{ color:'#0F0F1A', margin:0 }}>🏪 Mes Produits</h1>
        <Link
          to="/produit/nouveau"
          style={{ backgroundColor:'#7C3AED', color:'#fff', padding:'10px 20px', borderRadius:'8px', textDecoration:'none', fontWeight:'bold', fontSize:'0.9rem' }}
        >
          ➕ Ajouter un produit
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'#7C3AED' }}>☀️ Chargement...</div>
      ) : produits.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', backgroundColor:'#fff', borderRadius:'12px', color:'#64748B' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📦</div>
          <p style={{ marginBottom:'1.5rem' }}>Vous n'avez pas encore de produits.</p>
          <Link
            to="/produit/nouveau"
            style={{ backgroundColor:'#7C3AED', color:'#fff', padding:'12px 24px', borderRadius:'8px', textDecoration:'none', fontWeight:'bold' }}
          >
            ➕ Ajouter mon premier produit
          </Link>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'1.5rem' }}>
          {produits.map(p => (
            <div key={p.id} style={{ backgroundColor:'#fff', borderRadius:'12px', padding:'1.5rem', boxShadow:'0 2px 12px rgba(124,58,237,0.07)', border:'1px solid #E2E8F0' }}>
              <div style={{ display:'inline-block', backgroundColor:'#EDE9FE', color:'#7C3AED', fontSize:'0.72rem', fontWeight:'bold', padding:'2px 10px', borderRadius:'12px', marginBottom:'0.8rem' }}>
                {p.categorie?.toUpperCase() || 'AUTRE'}
              </div>
              <h3 style={{ color:'#0F0F1A', margin:'0 0 0.5rem', fontSize:'1rem' }}>{p.nom_produit}</h3>
              <p style={{ fontSize:'0.85rem', color:'#64748B', marginBottom:'1rem' }}>{p.description}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:'bold', color:'#374151' }}>{p.prix_fcfa?.toLocaleString()} FCFA</div>
                  <div style={{ fontSize:'0.8rem', color:'#F59E0B' }}>⚡ {p.prix_coins} Coins</div>
                </div>
                <div style={{ fontSize:'0.8rem', color: p.disponible ? '#10B981' : '#EF4444', fontWeight:'bold' }}>
                  {p.disponible ? '✅ En ligne' : '❌ Hors ligne'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}