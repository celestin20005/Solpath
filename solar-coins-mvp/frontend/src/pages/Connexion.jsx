import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connexion } from '../api';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Connexion() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');
    try {
      const res = await connexion(form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'linear-gradient(135deg, #0F0F1A 0%, #1a0a2e 100%)' }}>
      <div style={{ backgroundColor:'#fff', padding:'2.5rem', borderRadius:'14px', boxShadow:'0 8px 32px rgba(124,58,237,0.15)', width:'100%', maxWidth:'400px' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'1.5rem' }}>
          <Logo size={40} showText={true} textSize="md" />
        </div>
        <h2 style={{ textAlign:'center', color:'#0F0F1A', marginBottom:'1.5rem' }}>Connexion</h2>
        {erreur && <div style={{ backgroundColor:'#fce8e8', color:'#a32d2d', padding:'10px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.9rem' }}>{erreur}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'1rem' }}>
            <label style={labelStyle}>Email</label>
            <input name="email" type="email" placeholder="@email.com" value={form.email} onChange={handleChange} style={inputStyle} required />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={labelStyle}>Mot de passe</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} style={inputStyle} required />
          </div>
          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'1rem', fontSize:'0.9rem', color:'#666' }}>
          Pas encore de compte ? <Link to="/inscription" style={{ color:'#7C3AED', fontWeight:'bold' }}>S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = { display:'block', marginBottom:'4px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' };
const inputStyle = { width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem', boxSizing:'border-box' };
const btnStyle = { width:'100%', padding:'12px', backgroundColor:'#7C3AED', color:'#fff', border:'none', borderRadius:'8px', fontSize:'1rem', fontWeight:'bold', cursor:'pointer', marginTop:'0.5rem' };