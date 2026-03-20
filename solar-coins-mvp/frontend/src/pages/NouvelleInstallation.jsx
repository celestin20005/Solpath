import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { creerInstallation } from '../api';

export default function NouvelleInstallation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ puissance_wc:'', gamme:'standard', quartier:'', ville:'Bobo-Dioulasso', date_installation:'' });
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');
    try {
      await creerInstallation({ ...form, puissance_wc: parseInt(form.puissance_wc) });
      navigate('/installations');
    } catch (err) {
      setErreur(err.response?.data?.erreur || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'80vh', backgroundColor:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ backgroundColor:'#fff', padding:'2.5rem', borderRadius:'14px', boxShadow:'0 4px 24px rgba(124,58,237,0.1)', width:'100%', maxWidth:'460px' }}>
        <h2 style={{ color:'#0F0F1A', marginBottom:'1.5rem' }}>➕ Nouvelle installation solaire</h2>
        {erreur && <div style={{ backgroundColor:'#fce8e8', color:'#a32d2d', padding:'10px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.9rem' }}>{erreur}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'1rem' }}>
            <label style={lbl}>Puissance totale (Wc)</label>
            <input name="puissance_wc" type="number" min="1" placeholder="ex: 400" value={form.puissance_wc} onChange={handleChange} style={inp} required />
            <small style={{ color:'#aaa', fontSize:'0.8rem' }}>Ex: 2 panneaux de 200W = 400 Wc</small>
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={lbl}>Gamme</label>
            <select name="gamme" value={form.gamme} onChange={handleChange} style={inp}>
              <option value="basic">Basic — éclairage + chargeurs</option>
              <option value="standard">Standard — frigo, TV, ventilos</option>
              <option value="premium">Premium — climatisation, usage intensif</option>
            </select>
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={lbl}>Quartier</label>
            <input name="quartier" type="text" placeholder="ex: Sarfalao" value={form.quartier} onChange={handleChange} style={inp} />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={lbl}>Ville</label>
            <input name="ville" type="text" placeholder="Bobo-Dioulasso" value={form.ville} onChange={handleChange} style={inp} />
          </div>
          <div style={{ marginBottom:'1.5rem' }}>
            <label style={lbl}>Date d'installation</label>
            <input name="date_installation" type="date" value={form.date_installation} onChange={handleChange} style={inp} />
          </div>
          <button type="submit" style={{ width:'100%', padding:'12px', backgroundColor:'#7C3AED', color:'#fff', border:'none', borderRadius:'8px', fontSize:'1rem', fontWeight:'bold', cursor:'pointer' }} disabled={loading}>
            {loading ? 'Enregistrement...' : '✅ Enregistrer mon installation'}
          </button>
        </form>
      </div>
    </div>
  );
}

const lbl = { display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' };
const inp = { width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem', boxSizing:'border-box' };