import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMesInstallations, saisirProduction } from '../api';

export default function SaisirProduction() {
  const navigate = useNavigate();
  const [installations, setInstallations] = useState([]);
  const [form, setForm] = useState({ installation_id:'', mois:'', kwh_produits:'' });
  const [resultat, setResultat] = useState(null);
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  const moisCourant = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    getMesInstallations().then(r => {
      setInstallations(r.data.installations);
      if (r.data.installations.length > 0) {
        setForm(f => ({ ...f, installation_id: r.data.installations[0].id, mois: moisCourant }));
      }
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');
    try {
      const res = await saisirProduction({
        ...form,
        installation_id: parseInt(form.installation_id),
        kwh_produits: parseFloat(form.kwh_produits),
      });
      setResultat(res.data);
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Erreur lors de la saisie');
    } finally {
      setLoading(false);
    }
  };

  if (resultat) {
    return (
      <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', backgroundColor:'#F8FAFC' }}>
        <div style={{ backgroundColor:'#fff', padding:'3rem', borderRadius:'14px', boxShadow:'0 4px 24px rgba(124,58,237,0.1)', textAlign:'center', maxWidth:'400px', width:'100%' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🎉</div>
          <h2 style={{ color:'#0F0F1A', marginBottom:'1rem' }}>Production enregistrée !</h2>
          <div style={{ fontSize:'2.8rem', fontWeight:'bold', color:'#F59E0B', marginBottom:'0.3rem' }}>
            +{resultat.coins_gagnes} Solar Coins
          </div>
          <div style={{ fontSize:'1.1rem', color:'#06B6D4', marginBottom:'1rem' }}>
            = {(resultat.valeur_fcfa || 0).toLocaleString()} FCFA
          </div>
          <p style={{ color:'#64748B', fontSize:'0.9rem', marginBottom:'1.5rem' }}>{resultat.message}</p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
            <button onClick={() => setResultat(null)} style={{ backgroundColor:'#7C3AED', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' }}>
              Nouvelle saisie
            </button>
            <button onClick={() => navigate('/wallet')} style={{ backgroundColor:'#06B6D4', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' }}>
              Mon wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'80vh', backgroundColor:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ backgroundColor:'#fff', padding:'2.5rem', borderRadius:'14px', boxShadow:'0 4px 24px rgba(124,58,237,0.1)', width:'100%', maxWidth:'460px' }}>
        <h2 style={{ color:'#0F0F1A', marginBottom:'0.5rem' }}>⚡ Saisir ma production du mois</h2>
        <p style={{ color:'#64748B', fontSize:'0.9rem', marginBottom:'1.5rem' }}>
          Lisez la valeur kWh sur votre contrôleur de charge.
        </p>
        {erreur && <div style={{ backgroundColor:'#fce8e8', color:'#a32d2d', padding:'10px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.9rem' }}>{erreur}</div>}
        {installations.length === 0 ? (
          <div style={{ textAlign:'center', padding:'2rem', color:'#64748B' }}>
            <p>Aucune installation trouvée.</p>
            <a href="/installations/nouvelle" style={{ color:'#7C3AED', fontWeight:'bold' }}>
              Déclarer mon installation →
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'1rem' }}>
              <label style={lbl}>Installation</label>
              <select name="installation_id" value={form.installation_id} onChange={handleChange} style={inp} required>
                {installations.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.gamme.toUpperCase()} — {i.puissance_wc}Wc — {i.quartier || i.ville}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={lbl}>Mois</label>
              <input name="mois" type="month" value={form.mois} onChange={handleChange} style={inp} required />
            </div>
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={lbl}>Production en kWh</label>
              <input name="kwh_produits" type="number" step="0.1" min="0.1" placeholder="ex: 45.5" value={form.kwh_produits} onChange={handleChange} style={inp} required />
            </div>
            <button type="submit" style={{ width:'100%', padding:'12px', backgroundColor:'#7C3AED', color:'#fff', border:'none', borderRadius:'8px', fontSize:'1rem', fontWeight:'bold', cursor:'pointer' }} disabled={loading}>
              {loading ? 'Enregistrement...' : 'Valider et gagner mes Coins ☀️'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const lbl = { display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' };
const inp = { width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem', boxSizing:'border-box' };