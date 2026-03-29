import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTechniciens } from '../api';

const badges = {
  platine: { label:'⭐⭐⭐⭐⭐ PLATINE', color:'#7C3AED', bg:'#EDE9FE' },
  or:      { label:'⭐⭐⭐⭐ OR',       color:'#D97706', bg:'#FEF3C7' },
  argent:  { label:'⭐⭐⭐ ARGENT',    color:'#64748B', bg:'#F1F5F9' },
  bronze:  { label:'⭐⭐ BRONZE',      color:'#92400E', bg:'#FEF9C3' },
};

export default function ListeTechniciens() {
  const navigate = useNavigate();
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [zone, setZone] = useState('');

  useEffect(() => {
    const params = { disponible: 'true' };
    if (zone) params.zone = zone;
    getTechniciens(params)
      .then(r => setTechniciens(r.data.techniciens))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [zone]);

  // Filtrage local par nom, zone, diplôme
  const techniciensFiltres = techniciens.filter(t =>
    t.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
    t.zone_intervention?.toLowerCase().includes(recherche.toLowerCase()) ||
    t.diplome_type?.toLowerCase().includes(recherche.toLowerCase()) ||
    t.institution?.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div style={{ padding:'2rem', maxWidth:'1100px', margin:'0 auto' }}>

      {/* Titre */}
      <h1 style={{ color:'#0F0F1A', marginBottom:'0.5rem' }}>
        🔧 Techniciens disponibles
      </h1>
      <p style={{ color:'#64748B', marginBottom:'1.5rem', fontSize:'0.9rem' }}>
        Tous nos techniciens sont vérifiés — 4 niveaux officiels
      </p>

      {/* Légende niveaux */}
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        {Object.entries(badges).map(([key, b]) => (
          <span key={key} style={{
            backgroundColor:b.bg, color:b.color,
            fontSize:'0.72rem', fontWeight:'bold',
            padding:'3px 10px', borderRadius:'12px'
          }}>
            {b.label}
          </span>
        ))}
      </div>

      {/* Barre de recherche */}
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher par nom, diplôme, institution..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={s.input}
        />
        <input
          type="text"
          placeholder="📍 Filtrer par zone ou quartier..."
          value={zone}
          onChange={e => setZone(e.target.value)}
          style={s.input}
        />
      </div>

      {/* Contenu */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'#7C3AED' }}>
          ☀️ Chargement...
        </div>
      ) : techniciensFiltres.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', backgroundColor:'#fff', borderRadius:'12px', color:'#64748B' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔧</div>
          <p style={{ marginBottom:'0.5rem' }}>
            Aucun technicien trouvé pour cette recherche.
          </p>
          <p style={{ fontSize:'0.85rem', color:'#aaa' }}>
            Essayez avec un autre nom ou une autre zone.
          </p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'1.5rem' }}>
          {techniciensFiltres.map(t => {
            const badge = badges[t.niveau_solar_coins] || badges.bronze;
            return (
              <div key={t.id} style={s.card}>

                {/* Badge niveau */}
                <div style={{
                  display:'inline-block',
                  backgroundColor:badge.bg,
                  color:badge.color,
                  fontSize:'0.72rem',
                  fontWeight:'bold',
                  padding:'3px 10px',
                  borderRadius:'12px',
                  marginBottom:'0.8rem'
                }}>
                  {badge.label}
                </div>

                {/* Nom */}
                <h3 style={{ color:'#0F0F1A', margin:'0 0 0.3rem', fontSize:'1rem' }}>
                  {t.nom}
                </h3>

                {/* Diplôme */}
                {t.diplome_type && (
                  <div style={s.info}>
                    🎓 {t.diplome_type}
                    {t.institution && ` — ${t.institution}`}
                  </div>
                )}

                {/* Zone */}
                <div style={s.info}>
                  📍 {t.zone_intervention || 'Bobo-Dioulasso'}
                  {t.rayon_km && ` (rayon ${t.rayon_km} km)`}
                </div>

                {/* Expérience */}
                {t.annees_experience > 0 && (
                  <div style={s.info}>
                    🛠️ {t.annees_experience} an{t.annees_experience > 1 ? 's' : ''} d'expérience
                  </div>
                )}

                {/* Note */}
                {t.note_moyenne > 0 && (
                  <div style={{ ...s.info, color:'#F59E0B' }}>
                    ⭐ {parseFloat(t.note_moyenne).toFixed(1)}/5
                    — {t.nb_missions} missions
                  </div>
                )}

                {/* Bio */}
                {t.bio && (
                  <div style={{ fontSize:'0.82rem', color:'#64748B', marginBottom:'0.5rem', lineHeight:1.5, fontStyle:'italic' }}>
                    "{t.bio}"
                  </div>
                )}

                {/* ANEREE */}
                {t.agrement_aneree && (
                  <div style={{ fontSize:'0.78rem', color:'#10B981', marginBottom:'0.5rem' }}>
                    ✅ Certifié ANEREE
                  </div>
                )}

                {/* Disponibilité + tarif */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.8rem', paddingTop:'0.8rem', borderTop:'1px solid #F1F5F9' }}>
                  <span style={{ fontSize:'0.8rem', color: t.disponible ? '#10B981' : '#EF4444', fontWeight:'bold' }}>
                    {t.disponible ? '🟢 Disponible' : '🔴 Occupé'}
                  </span>
                  {t.tarif_horaire && (
                    <span style={{ fontSize:'0.8rem', color:'#7C3AED', fontWeight:'bold' }}>
                      {t.tarif_horaire?.toLocaleString()} FCFA/h
                    </span>
                  )}
                </div>

                {/* Boutons */}
                <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.8rem' }}>
                  <button
                    onClick={() => navigate(`/messages/${t.user_id}`)}
                    style={s.btnMsg}
                  >
                    💬 Message
                  </button>
                  <button
                    onClick={() => navigate('/demander-mission')}
                    style={s.btnMission}
                  >
                    🔧 Demander
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  input: {
    padding:'10px 16px',
    border:'1.5px solid #E2E8F0',
    borderRadius:'8px',
    fontSize:'0.95rem',
    flex:1,
    minWidth:'200px',
    boxSizing:'border-box',
  },
  card: {
    backgroundColor:'#fff',
    borderRadius:'12px',
    padding:'1.5rem',
    boxShadow:'0 2px 12px rgba(124,58,237,0.07)',
    border:'1px solid #E2E8F0',
  },
  info: {
    fontSize:'0.85rem',
    color:'#64748B',
    marginBottom:'0.3rem',
  },
  btnMsg: {
    flex:1,
    padding:'8px',
    backgroundColor:'#7C3AED',
    color:'#fff',
    border:'none',
    borderRadius:'6px',
    cursor:'pointer',
    fontSize:'0.82rem',
    fontWeight:'bold',
  },
  btnMission: {
    flex:1,
    padding:'8px',
    backgroundColor:'#EF4444',
    color:'#fff',
    border:'none',
    borderRadius:'6px',
    cursor:'pointer',
    fontSize:'0.82rem',
    fontWeight:'bold',
  },
};