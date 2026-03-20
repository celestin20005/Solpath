import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [installEvent, setInstallEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallEvent(e);
      setVisible(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    const result = await installEvent.userChoice;
    if (result.outcome === 'accepted') setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{ position:'fixed', bottom:'1rem', left:'1rem', right:'1rem', zIndex:2000, pointerEvents:'none' }}>
      <div style={{ backgroundColor:'#0F0F1A', border:'1px solid #7C3AED', borderRadius:'14px', padding:'1.5rem', maxWidth:'560px', margin:'0 auto', boxShadow:'0 -4px 40px rgba(124,58,237,0.25)', pointerEvents:'all' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'1rem' }}>
          <span style={{ fontSize:'1.8rem' }}>☀️</span>
          <div>
            <div style={{ color:'#fff', fontWeight:'bold', fontSize:'0.95rem' }}>Installer SOLPATH</div>
            <div style={{ color:'#7C3AED', fontSize:'0.7rem', letterSpacing:'1.5px' }}>by NEXCID</div>
          </div>
        </div>
        <p style={{ color:'#94A3B8', fontSize:'0.85rem', lineHeight:1.6, marginBottom:'1rem' }}>
          Accès rapide depuis ton téléphone — aucun store nécessaire.
        </p>
        <div style={{ display:'flex', gap:'0.8rem', justifyContent:'flex-end' }}>
          <button onClick={() => setVisible(false)} style={{ background:'transparent', border:'1px solid #475569', color:'#94A3B8', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontSize:'0.82rem' }}>
            Plus tard
          </button>
          <button onClick={handleInstall} style={{ backgroundColor:'#7C3AED', border:'none', color:'#fff', padding:'8px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'0.85rem' }}>
            Installer
          </button>
        </div>
      </div>
    </div>
  );
}