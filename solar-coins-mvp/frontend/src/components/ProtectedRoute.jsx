import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', color:'#7C3AED', fontSize:'1.2rem' }}>
        ☀️ Chargement...
      </div>
    );
  }

  if (!user) return <Navigate to="/connexion" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;

  return children;
}