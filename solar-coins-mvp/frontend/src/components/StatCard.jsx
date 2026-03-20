export default function StatCard({ icone, valeur, label, couleur = '#7C3AED' }) {
  return (
    <div style={{ backgroundColor:'#fff', borderRadius:'10px', padding:'1.5rem', textAlign:'center', boxShadow:'0 2px 12px rgba(124,58,237,0.08)', minWidth:'160px', borderTop:`3px solid ${couleur}` }}>
      <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>{icone}</div>
      <div style={{ fontSize:'1.8rem', fontWeight:'bold', color:couleur, marginBottom:'0.3rem' }}>{valeur}</div>
      <div style={{ fontSize:'0.82rem', color:'#64748B' }}>{label}</div>
    </div>
  );
}