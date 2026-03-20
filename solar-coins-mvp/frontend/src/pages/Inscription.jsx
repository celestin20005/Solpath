import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inscription } from '../api';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Inscription() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ nom:'', email:'', telephone:'', password:'', role:'client' });
  const [cguAcceptees, setCguAcceptees] = useState(false);
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cguAcceptees) { setErreur('Vous devez accepter les CGU pour continuer'); return; }
    setLoading(true);
    setErreur('');
    try {
      const res = await inscription(form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setErreur(err.response?.data?.erreur || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'linear-gradient(135deg, #0F0F1A 0%, #1a0a2e 100%)' }}>
      <div style={{ backgroundColor:'#fff', padding:'2.5rem', borderRadius:'14px', boxShadow:'0 8px 32px rgba(124,58,237,0.15)', width:'100%', maxWidth:'420px' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'1.5rem' }}>
          <Logo size={40} showText={true} textSize="md" />
        </div>
        <h2 style={{ textAlign:'center', color:'#0F0F1A', marginBottom:'1.5rem' }}>Créer mon compte</h2>
        {erreur && <div style={{ backgroundColor:'#fce8e8', color:'#a32d2d', padding:'10px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.9rem' }}>{erreur}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { name:'nom', label:'Nom complet', type:'text', placeholder:'Ibrahim Dao' },
            { name:'email', label:'Email', type:'email', placeholder:'dao@email.com' },
            { name:'telephone', label:'Téléphone', type:'text', placeholder:'70000000' },
            { name:'password', label:'Mot de passe', type:'password', placeholder:'••••••••' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom:'1rem' }}>
              <label style={labelStyle}>{f.label}</label>
              <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} style={inputStyle} required={f.name !== 'telephone'} />
            </div>
          ))}
          <div style={{ marginBottom:'1rem' }}>
            <label style={labelStyle}>Je suis un</label>
            <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
              <option value="client">Client — j'ai des panneaux solaires</option>
              <option value="agent">Agent terrain Solar Coins</option>
              <option value="fournisseur">Fournisseur de matériel solaire</option>
            </select>
          </div>
          <div style={{ marginBottom:'1rem', display:'flex', alignItems:'flex-start', gap:'0.5rem' }}>
            <input type="checkbox" id="cgu" checked={cguAcceptees} onChange={e => setCguAcceptees(e.target.checked)} style={{ marginTop:'3px', cursor:'pointer', accentColor:'#7C3AED' }} />
            <label htmlFor="cgu" style={{ fontSize:'0.85rem', color:'#555', cursor:'pointer', lineHeight:1.5 }}>
              J'accepte les <Link to="/cgu" target="_blank" style={{ color:'#7C3AED', fontWeight:'bold' }}>CGU</Link> et la <Link to="/confidentialite" target="_blank" style={{ color:'#7C3AED', fontWeight:'bold' }}>Politique de Confidentialité</Link>
            </label>
          </div>
          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'1rem', fontSize:'0.9rem', color:'#666' }}>
          Déjà un compte ? <Link to="/connexion" style={{ color:'#7C3AED', fontWeight:'bold' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = { display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' };
const inputStyle = { width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem', boxSizing:'border-box' };
const btnStyle = { width:'100%', padding:'12px', backgroundColor:'#7C3AED', color:'#fff', border:'none', borderRadius:'8px', fontSize:'1rem', fontWeight:'bold', cursor:'pointer', marginTop:'0.5rem' };