import { useState, useEffect } from 'react';
import { getMonSolde } from '../api';
import { useAuth } from '../context/AuthContext';

export default function CoinsBadge() {
  const { user } = useAuth();
  const [solde, setSolde] = useState(0);

  useEffect(() => {
    if (user) {
      getMonSolde().then((r) => setSolde(r.data.solde_coins)).catch(() => {});
    }
  }, [user]);

  return (
    <span style={{ background:'linear-gradient(135deg, #F59E0B, #D97706)', color:'#fff', padding:'4px 12px', borderRadius:'20px', fontSize:'0.85rem', fontWeight:'bold' }}>
      ⚡ {solde} Coins
    </span>
  );
}