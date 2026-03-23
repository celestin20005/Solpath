import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Accueil() {
  return (
    <div style={{ fontFamily:'Arial, sans-serif' }}>
      <div style={{ background:'linear-gradient(135deg, #0F0F1A 0%, #1a0a2e 100%)', color:'#fff', padding:'5rem 2rem', textAlign:'center' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'1.5rem' }}>
          <Logo size={80} showText={true} textSize="xl" />
        </div>
        <p style={{ color:'#F59E0B', fontStyle:'italic', fontSize:'1.2rem', marginBottom:'1rem' }}>
          "Ton soleil travaille pour toi."
        </p>
        <p style={{ color:'#94A3B8', maxWidth:'600px', margin:'0 auto 2rem', lineHeight:1.7 }}>
          Produis de l'énergie solaire au Burkina Faso, gagne des Solar Coins,
          accède à du matériel certifié ANEREE à prix réduit.
        </p>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'2rem' }}>
          <Link to="/inscription" style={{ backgroundColor:'#7C3AED', color:'#fff', padding:'12px 28px', borderRadius:'8px', fontWeight:'bold', fontSize:'1rem' }}>
            Commencer gratuitement
          </Link>
          <Link to="/connexion" style={{ border:'2px solid #06B6D4', color:'#06B6D4', padding:'12px 28px', borderRadius:'8px', fontSize:'1rem' }}>
            Se connecter
          </Link>
        </div>
        <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', flexWrap:'wrap' }}>
          {['⚡ IoT Ready','☁️ G-Cloud','🔒 ANEREE Certifié','📱 Mobile First','🇧🇫 Made in Burkina'].map(t => (
            <span key={t} style={{ backgroundColor:'#ffffff11', border:'1px solid #ffffff22', color:'#94A3B8', padding:'3px 10px', borderRadius:'20px', fontSize:'0.8rem' }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ padding:'3rem 2rem', backgroundColor:'#fff', textAlign:'center' }}>
        <h2 style={{ color:'#0F0F1A', marginBottom:'2rem' }}>Comment ça fonctionne</h2>
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap' }}>
          {[
            { icone:'🌞', titre:'EARN', couleur:'#F59E0B', desc:"Produis de l'énergie solaire et gagne des Solar Coins automatiquement." },
            { icone:'⚡', titre:'SPEND', couleur:'#7C3AED', desc:'Utilise tes Coins pour des réductions sur du matériel certifié ANEREE.' },
            { icone:'🤝', titre:'CONNECT', couleur:'#06B6D4', desc:'Rejoins fournisseurs, installateurs et clients de confiance au Burkina.' },
          ].map(p => (
            <div key={p.titre} style={{ backgroundColor:'#F8FAFC', borderRadius:'12px', padding:'2rem 1.5rem', maxWidth:'280px', borderTop:`3px solid ${p.couleur}`, boxShadow:'0 2px 12px rgba(124,58,237,0.07)' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>{p.icone}</div>
              <h3 style={{ color:p.couleur, marginBottom:'0.8rem' }}>{p.titre}</h3>
              <p style={{ color:'#64748B', fontSize:'0.9rem', lineHeight:1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'2.5rem 2rem', background:'linear-gradient(135deg, #0F0F1A, #1a0a2e)', textAlign:'center' }}>
        <h2 style={{ color:'#fff', marginBottom:'1.5rem', fontSize:'1.2rem' }}>Contexte réel — Burkina Faso 2026</h2>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          {[
            { n:'87,83%', l:'Électrification urbaine', c:'#7C3AED' },
            { n:'10,21%', l:'Électrification rurale', c:'#F59E0B' },
            { n:'81%', l:'Importée du Ghana', c:'#EF4444' },
            { n:'500 000', l:'Nouveaux raccordés PDCEL', c:'#06B6D4' },
          ].map(c => (
            <div key={c.n} style={{ backgroundColor:'#ffffff08', borderRadius:'10px', padding:'1.2rem 1.5rem', minWidth:'140px', borderBottom:`3px solid ${c.c}` }}>
              <div style={{ fontSize:'1.6rem', fontWeight:'bold', color:c.c }}>{c.n}</div>
              <div style={{ fontSize:'0.75rem', color:'#94A3B8', marginTop:'0.3rem' }}>{c.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor:'#0F0F1A', padding:'2rem', textAlign:'center' }}>
        <div style={{ fontSize:'1.2rem', fontWeight:'bold', letterSpacing:'2px', marginBottom:'0.5rem' }}>
          <span style={{ color:'#7C3AED' }}>NEXCID</span>
          <span style={{ color:'#444' }}> · </span>
          <span style={{ color:'#06B6D4' }}>SOLPATH</span>
        </div>
       
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', marginTop:'0.5rem' }}>
          <Link to="/cgu" style={{ color:'#475569', fontSize:'0.78rem' }}>CGU</Link>
          <span style={{ color:'#333' }}>·</span>
          <Link to="/confidentialite" style={{ color:'#475569', fontSize:'0.78rem' }}>Confidentialité</Link>
          <span style={{ color:'#333' }}>·</span>
          <span style={{ color:'#475569', fontSize:'0.78rem' }}>© 2026 NEXCID</span>
        </div>
      </div>
    </div>
  );
}