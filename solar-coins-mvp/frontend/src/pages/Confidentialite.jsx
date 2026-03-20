import { Link } from 'react-router-dom';

export default function Confidentialite() {
  return (
    <div style={{ backgroundColor:'#F8FAFC', minHeight:'100vh', padding:'2rem 1rem', fontFamily:'Arial, sans-serif' }}>
      <div style={{ maxWidth:'800px', margin:'0 auto', backgroundColor:'#fff', borderRadius:'12px', padding:'2.5rem', boxShadow:'0 2px 20px rgba(124,58,237,0.08)' }}>
        <h1 style={{ color:'#0F0F1A', marginBottom:'0.3rem', borderBottom:'2px solid #06B6D4', paddingBottom:'1rem' }}>
          Politique de Confidentialité
        </h1>
        <p style={{ color:'#94A3B8', fontSize:'0.85rem', marginBottom:'2rem' }}>
          SOLPATH by NEXCID — Version 1.0 — 2025
        </p>

        <div style={{ backgroundColor:'#ECFEFF', border:'1px solid #06B6D444', borderRadius:'8px', padding:'1rem', marginBottom:'2rem', color:'#0E7490', fontSize:'0.9rem' }}>
          Chez NEXCID, nous respectons votre vie privée. Vos données restent sur nos serveurs au Burkina Faso.
        </div>

        {[
          { titre:'1. Données collectées', texte:'Nous collectons : nom, email, téléphone, données d\'installation (puissance, quartier, ville), données de production (kWh mensuels), et historique des Solar Coins.' },
          { titre:'2. Utilisation des données', texte:'Vos données sont utilisées uniquement pour : gérer votre compte, calculer vos Solar Coins, vous connecter aux fournisseurs, et améliorer la plateforme. Nous ne vendons jamais vos données.' },
          { titre:'3. Cookies', texte:'SOLPATH utilise uniquement des cookies essentiels pour maintenir votre session de connexion. Aucun cookie publicitaire, aucun tracking tiers.' },
          { titre:'4. Vos droits', texte:'Vous pouvez à tout moment : accéder à vos données, les corriger, demander leur suppression. Contactez-nous à privacy@solpath.nexcid.bf.' },
          { titre:'5. Contact', texte:'Responsable de la protection des données : privacy@solpath.nexcid.bf — NEXCID, Bobo-Dioulasso, Burkina Faso.' },
        ].map(s => (
          <div key={s.titre} style={{ marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid #F1F5F9' }}>
            <h2 style={{ color:'#06B6D4', fontSize:'1.1rem', marginBottom:'0.8rem' }}>{s.titre}</h2>
            <p style={{ color:'#374151', fontSize:'0.92rem', lineHeight:1.7 }}>{s.texte}</p>
          </div>
        ))}

        <div style={{ textAlign:'center', paddingTop:'1rem' }}>
          <Link to="/cgu" style={{ color:'#7C3AED', fontWeight:'bold', marginRight:'1rem' }}>CGU</Link>
          <Link to="/" style={{ color:'#64748B' }}>Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}