import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { creerMission } from '../api';
import BoutonFermer from '../components/BoutonFermer';

export default function DemanderMission() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'depannage',
    description: '',
    adresse: '',
    ville: 'Bobo-Dioulasso',
    date_souhaitee: ''
  });
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');
    try {
      await creerMission(form);
      setSucces(true);
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };

  if (succes) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ fontSize:'3rem', textAlign:'center', marginBottom:'1rem' }}>✅</div>
          <h2 style={{ color:'#0F0F1A', textAlign:'center', marginBottom:'1rem' }}>
            Demande envoyée !
          </h2>
          <p style={{ color:'#64748B', textAlign:'center', marginBottom:'1.5rem' }}>
            Les techniciens disponibles dans votre zone vont être notifiés.
            Vous recevrez une réponse sous 24h.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
            <button onClick={() => navigate('/dashboard')} style={s.btn('#7C3AED')}>
              Tableau de bord
            </button>
            <button onClick={() => setSucces(false)} style={s.btn('#06B6D4')}>
              Nouvelle demande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={{ ...s.card, position:'relative' }}>
        <BoutonFermer />
        <h2 style={{ color:'#0F0F1A', marginBottom:'0.5rem' }}>
          🔧 Demander une intervention
        </h2>
        <p style={{ color:'#64748B', fontSize:'0.9rem', marginBottom:'1.5rem' }}>
          Décrivez votre besoin — un technicien certifié vous contactera avec un devis.
        </p>

        {erreur && (
          <div style={{ backgroundColor:'#fce8e8', color:'#a32d2d', padding:'10px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.9rem' }}>
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={s.champ}>
            <label style={s.lbl}>Type d'intervention</label>
            <select name="type" value={form.type} onChange={handleChange} style={s.inp}>
              <option value="depannage">🔧 Dépannage — problème sur installation existante</option>
              <option value="installation_basic">⚡ Installation Basic — usage minimal</option>
              <option value="installation_standard">☀️ Installation Standard — frigo, TV, ventilos</option>
              <option value="installation_premium">🏆 Installation Premium — système complet autonome</option>
            </select>
          </div>

          <div style={s.champ}>
            <label style={s.lbl}>Description du problème ou besoin</label>
            <textarea
              name="description"
              placeholder="Ex: Mon onduleur ne s'allume plus depuis ce matin. J'ai 2 panneaux de 200W..."
              value={form.description}
              onChange={handleChange}
              style={{ ...s.inp, height:'100px', resize:'vertical' }}
              required
            />
            <small style={{ color:'#aaa', fontSize:'0.78rem' }}>
              Plus vous êtes précis, plus le devis sera rapide et exact.
            </small>
          </div>

          <div style={s.champ}>
            <label style={s.lbl}>Quartier / Adresse</label>
            <input
              name="adresse"
              type="text"
              placeholder="ex: Quartier Sarfalao, rue 14"
              value={form.adresse}
              onChange={handleChange}
              style={s.inp}
            />
          </div>

          <div style={s.champ}>
            <label style={s.lbl}>Ville</label>
            <input
              name="ville"
              type="text"
              value={form.ville}
              onChange={handleChange}
              style={s.inp}
            />
          </div>

          <div style={s.champ}>
            <label style={s.lbl}>Date souhaitée</label>
            <input
              name="date_souhaitee"
              type="date"
              value={form.date_souhaitee}
              onChange={handleChange}
              style={s.inp}
            />
          </div>

          <div style={{ backgroundColor:'#FFFBEB', border:'1px solid #F59E0B44', borderRadius:'8px', padding:'0.8rem 1rem', marginBottom:'1rem', fontSize:'0.85rem', color:'#92400E' }}>
            🪙 Vous pourrez utiliser vos Solar Coins pour payer une partie du matériel lors de la réception du devis.
          </div>

          <button
            type="submit"
            style={{ ...s.btn('#7C3AED'), width:'100%' }}
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : '📤 Envoyer ma demande'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:'80vh', backgroundColor:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' },
  card: { backgroundColor:'#fff', padding:'2.5rem', borderRadius:'14px', boxShadow:'0 4px 24px rgba(124,58,237,0.1)', width:'100%', maxWidth:'520px' },
  champ: { marginBottom:'1rem' },
  lbl: { display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' },
  inp: { width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem', boxSizing:'border-box' },
  btn: (bg) => ({ padding:'10px 20px', backgroundColor:bg, color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'0.9rem' }),
};