import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CoinsBadge from './CoinsBadge';
import Logo from './Logo';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2rem', height:'60px', backgroundColor:'#0F0F1A', position:'sticky', top:0, zIndex:100, borderBottom:'1px solid #7C3AED33' }}>
      <Link to="/" style={{ textDecoration:'none' }}>
        <Logo size={36} showText={true} textSize="sm" />
      </Link>
      <div style={{ display:'flex', gap:'1.5rem' }}>
        {user && (
          <>
            <Link to="/dashboard" style={lien}>Dashboard</Link>
            <Link to="/catalogue" style={lien}>Catalogue</Link>
            {(user.role === 'client' || user.role === 'admin') && (
              <Link to="/installations" style={lien}>Installations</Link>
            )}
            {(user.role === 'client' || user.role === 'agent' || user.role === 'admin') && (
              <Link to="/productions/nouvelle" style={lien}>Production</Link>
            )}
            {user.role === 'fournisseur' && (
              <Link to="/mon-catalogue" style={lien}>Mon catalogue</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" style={lien}>Admin</Link>
            )}
          </>
        )}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        {user ? (
          <>
            <CoinsBadge />
            <span style={{ fontSize:'0.82rem', color:'#64748B' }}>👤 {user.nom}</span>
            <button onClick={handleLogout} style={{ background:'transparent', border:'1px solid #7C3AED', color:'#7C3AED', padding:'4px 12px', borderRadius:'4px', cursor:'pointer', fontSize:'0.82rem' }}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/connexion" style={lien}>Connexion</Link>
            <Link to="/inscription" style={{ backgroundColor:'#7C3AED', color:'#fff', padding:'6px 14px', borderRadius:'4px', textDecoration:'none', fontSize:'0.88rem' }}>S'inscrire</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const lien = { color:'#94A3B8', textDecoration:'none', fontSize:'0.88rem' };