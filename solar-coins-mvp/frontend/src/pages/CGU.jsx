import { Link } from 'react-router-dom';

export default function CGU() {
  return (
    <div style={{ backgroundColor:'#F8FAFC', minHeight:'100vh', padding:'2rem 1rem', fontFamily:'Arial, sans-serif' }}>
      <div style={{ maxWidth:'800px', margin:'0 auto', backgroundColor:'#fff', borderRadius:'12px', padding:'2.5rem', boxShadow:'0 2px 20px rgba(124,58,237,0.08)' }}>
        <h1 style={{ color:'#0F0F1A', marginBottom:'0.3rem', borderBottom:'2px solid #7C3AED', paddingBottom:'1rem' }}>
          Conditions Générales d'Utilisation
        </h1>
        <p style={{ color:'#94A3B8', fontSize:'0.85rem', marginBottom:'2rem' }}>
          SOLPATH by NEXCID — Version 1.0 — 2025
        </p>

        <div style={{ backgroundColor:'#EDE9FE', border:'1px solid #7C3AED44', borderRadius:'8px', padding:'1rem', marginBottom:'2rem', color:'#5B21B6', fontSize:'0.9rem' }}>
          En vous inscrivant sur SOLPATH, vous acceptez les présentes conditions.
        </div>

        {[
          { titre:'1. Présentation de SOLPATH', texte:"SOLPATH est une plateforme numérique développée par NEXCID, entreprise technologique basée à Bobo-Dioulasso, Burkina Faso. Elle permet aux producteurs d'énergie solaire de valoriser leur production via un système de récompense appelé Solar Coins." },
          { titre:'2. Les Solar Coins', texte:"Les Solar Coins sont des crédits virtuels de récompense. 1 Solar Coin = 5 FCFA de réduction. Ils ne constituent pas une monnaie légale ou une cryptomonnaie. Ils sont utilisables uniquement sur la plateforme SOLPATH." },
          { titre:'3. Déclaration de production', texte:"Les utilisateurs s'engagent à déclarer leur production d'énergie solaire de manière honnête. Toute fausse déclaration entraînera la suspension du compte et l'annulation des Coins obtenus frauduleusement." },
          { titre:'4. Propriété intellectuelle', texte:"La marque NEXCID, le nom SOLPATH, le logo et tous les contenus sont protégés par les droits de propriété intellectuelle, notamment par le dépôt de marque OAPI couvrant 17 pays africains." },
          { titre:'5. Contact', texte:"Pour toute question : contact@solpath.nexcid.bf — NEXCID, Bobo-Dioulasso, Burkina Faso." },
        ].map(s => (
          <div key={s.titre} style={{ marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid #F1F5F9' }}>
            <h2 style={{ color:'#7C3AED', fontSize:'1.1rem', marginBottom:'0.8rem' }}>{s.titre}</h2>
            <p style={{ color:'#374151', fontSize:'0.92rem', lineHeight:1.7 }}>{s.texte}</p>
          </div>
        ))}

        <div style={{ textAlign:'center', paddingTop:'1rem' }}>
          <Link to="/confidentialite" style={{ color:'#7C3AED', fontWeight:'bold', marginRight:'1rem' }}>
            Politique de Confidentialité
          </Link>
          <Link to="/" style={{ color:'#64748B' }}>Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}