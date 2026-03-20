export default function ProductCard({ produit }) {
  return (
    <div style={{ backgroundColor:'#fff', border:'1px solid #E2E8F0', borderRadius:'10px', padding:'1.2rem', boxShadow:'0 2px 12px rgba(124,58,237,0.06)' }}>
      <div style={{ display:'inline-block', backgroundColor:'#EDE9FE', color:'#7C3AED', fontSize:'0.7rem', fontWeight:'bold', padding:'2px 10px', borderRadius:'12px', marginBottom:'0.5rem' }}>
        {produit.gamme_cible?.toUpperCase() || 'TOUS'}
      </div>
      <h3 style={{ margin:'0 0 0.5rem', color:'#0F0F1A', fontSize:'1rem' }}>{produit.nom_produit}</h3>
      <p style={{ fontSize:'0.85rem', color:'#64748B', marginBottom:'1rem' }}>{produit.description || 'Aucune description'}</p>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.4rem' }}>
        <span style={{ fontWeight:'bold', color:'#374151' }}>{produit.prix_fcfa?.toLocaleString()} FCFA</span>
        <span style={{ color:'#CBD5E1', fontSize:'0.8rem' }}>ou</span>
        <span style={{ color:'#F59E0B', fontWeight:'bold' }}>⚡ {produit.prix_coins?.toLocaleString()} Coins</span>
      </div>
      <div style={{ fontSize:'0.75rem', color:'#94A3B8' }}>Par : {produit.fournisseur_nom}</div>
      <div style={{ fontSize:'0.72rem', color:'#06B6D4', marginTop:'0.2rem' }}>✅ Certifié ANEREE</div>
    </div>
  );
}