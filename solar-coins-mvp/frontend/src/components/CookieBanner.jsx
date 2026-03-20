import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepte = localStorage.getItem('solpath_cookies');
    if (!accepte) setTimeout(() => setVisible(true), 1500);
  }, []);

  const accepter = () => { localStorage.setItem('solpath_cookies', 'accepte'); setVisible(false); };
  const refuser = () => { localStorage.setItem('solpath_cookies', 'refuse'); setVisible(false); };

  if (!visible) return null;

  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'1rem', zIndex:2000 }}>
      <div style={{ backgroundColor:'#0F0F1A', border:'1px solid #7C3AED55', borderRadius:'14px', padding:'1.5rem', maxWidth:'560px', margin:'0 auto', boxShadow:'0 -4px 40px rgba(124,58,237,0.25)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'1rem' }}>
          <span style={{ fontSize:'1.8rem' }}>🍪</span>
          <div>
            <div style={{ color:'#fff', fontWeight:'bold', fontSize:'0.95rem' }}>SOLPATH utilise des cookies</div>
            <div style={{ color:'#7C3AED', fontSize:'0.7rem', letterSpacing:'1.5px' }}>by NEXCID</div>
          </div>
        </div>
        <p style={{ color:'#94A3B8', fontSize:'0.85rem', lineHeight:1.6, marginBottom:'1rem' }}>
          Uniquement des cookies essentiels pour votre session. <strong style={{ color:'#fff' }}>Aucun tracking, aucune pub.</strong>
        </p>
        <div style={{ fontSize:'0.78rem', color:'#475569', marginBottom:'1rem' }}>
          <Link to="/confidentialite" style={{ color:'#7C3AED', fontWeight:'bold' }}>Politique de confidentialité</Link>
          {' · '}
          <Link to="/cgu" style={{ color:'#7C3AED', fontWeight:'bold' }}>CGU</Link>
        </div>
        <div style={{ display:'flex', gap:'0.8rem', justifyContent:'flex-end' }}>
          <button onClick={refuser} style={{ background:'transparent', border:'1px solid #475569', color:'#94A3B8', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontSize:'0.82rem' }}>
            Refuser
          </button>
          <button onClick={accepter} style={{ backgroundColor:'#7C3AED', border:'none', color:'#fff', padding:'8px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'0.85rem' }}>
            J'accepte ✓
          </button>
        </div>
      </div>
    </div>
  );
}