import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CoinsBadge from './CoinsBadge';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav style={s.nav}>
      {/* Logo */}
      <Link to="/dashboard" style={s.logo}>
        <span style={{ fontSize:'1.4rem' }}>☀️</span>
        <div>
          <span style={{ color:'#7C3AED', fontWeight:'bold', fontSize:'1rem' }}>SOL</span>
          <span style={{ color:'#06B6D4', fontWeight:'bold', fontSize:'1rem' }}>PATH</span>
          <div style={{ color:'#94A3B8', fontSize:'0.6rem', letterSpacing:'2px' }}>by NEXCID</div>
        </div>
      </Link>

      {/* Liens selon le rôle */}
      <div style={s.liens}>

        {user.role === 'client' && (
          <>
            <Link to="/dashboard" style={s.lien}>Dashboard</Link>
            <Link to="/catalogue" style={s.lien}>Catalogue</Link>
            <Link to="/installations" style={s.lien}>Installations</Link>
            <Link to="/productions" style={s.lien}>Production</Link>
            <Link to="/demander-mission" style={s.lien}>🔧 Intervention</Link>
            <Link to="/techniciens" style={s.lien}>👷 Techniciens</Link>
            <Link to="/messages" style={s.lien}>💬 Messages</Link>
          </>
        )}

        {user.role === 'fournisseur' && (
          <>
            <Link to="/dashboard" style={s.lien}>Dashboard</Link>
            <Link to="/mes-produits" style={s.lien}>Mes Produits</Link>
            <Link to="/catalogue" style={s.lien}>Catalogue</Link>
            <Link to="/messages" style={s.lien}>💬 Messages</Link>
          </>
        )}

        {user.role === 'agent' && (
          <>
            <Link to="/dashboard" style={s.lien}>Dashboard</Link>
            <Link to="/missions/disponibles" style={s.lien}>Missions</Link>
            <Link to="/mon-profil-tech" style={s.lien}>Mon Profil</Link>
            <Link to="/messages" style={s.lien}>💬 Messages</Link>
          </>
        )}

        {user.role === 'admin' && (
          <>
            <Link to="/dashboard" style={s.lien}>Dashboard</Link>
            <Link to="/admin" style={{ ...s.lien, color:'#F59E0B', fontWeight:'bold' }}>⚙️ Admin</Link>
            <Link to="/admin/users" style={s.lien}>Utilisateurs</Link>
            <Link to="/admin/installations" style={s.lien}>Installations</Link>
            <Link to="/catalogue" style={s.lien}>Catalogue</Link>
            <Link to="/messages" style={s.lien}>💬 Messages</Link>
          </>
        )}

      </div>

      {/* Droite */}
      <div style={s.droite}>
        <CoinsBadge />
        <span style={s.nom}>
          {roleIcon(user.role)} {user.nom?.split(' ')[0]}
        </span>
        <button onClick={handleLogout} style={s.btnLogout}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

function roleIcon(role) {
  const icons = {
    client: '👤',
    fournisseur: '🏪',
    agent: '🔧',
    admin: '⚙️',
  };
  return icons[role] || '👤';
}

const s = {
  nav: {
    backgroundColor: '#0F0F1A',
    padding: '0 1.5rem',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #7C3AED33',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    gap: '1rem',
    flexWrap: 'wrap',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    flexShrink: 0,
  },
  liens: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
  },
  lien: {
    color: '#94A3B8',
    textDecoration: 'none',
    fontSize: '0.85rem',
    padding: '0.3rem 0.6rem',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
  },
  droite: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  nom: {
    color: '#64748B',
    fontSize: '0.82rem',
    whiteSpace: 'nowrap',
  },
  btnLogout: {
    backgroundColor: 'transparent',
    border: '1px solid #7C3AED',
    color: '#7C3AED',
    padding: '0.3rem 0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    whiteSpace: 'nowrap',
  },
};