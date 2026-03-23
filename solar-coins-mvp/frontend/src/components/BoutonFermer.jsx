import { useNavigate } from 'react-router-dom';

export default function BoutonFermer({ vers = -1 }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(vers)}
      title="Fermer"
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'transparent',
        border: '1px solid #E2E8F0',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        cursor: 'pointer',
        fontSize: '1rem',
        color: '#64748B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
    >
      ✕
    </button>
  );
}