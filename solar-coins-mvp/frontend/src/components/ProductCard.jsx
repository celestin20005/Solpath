import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { passerCommande } from '../api';

export default function ProductCard({ produit, onAchat }) {
  const { user } = useAuth();
  const [modal, setModal] = useState(false);
  const [coinsUtilises, setCoinsUtilises] = useState(0);
  const [modeLivraison, setModeLivraison] = useState('retrait');
  const [adresse, setAdresse] = useState('');
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(null);

  const reductionFcfa = coinsUtilises * 5;
  const prixFinal = Math.max(0, produit.prix_fcfa - reductionFcfa);

  const handleAchat = async () => {
    setLoading(true);
    try {
      const res = await passerCommande({
        produit_id: produit.id,
        coins_utilises: coinsUtilises,
        mode_livraison: modeLivraison,
        adresse_livraison: adresse
      });
      setSucces(res.data.resume);
      if (onAchat) onAchat();
    } catch (err) {
      alert(err.response?.data?.erreur || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Carte produit */}
      <div style={s.card}>
        <div style={s.gamme}>
          {produit.gamme_cible?.toUpperCase() || 'TOUS'}
        </div>
        <h3 style={s.nom}>{produit.nom_produit}</h3>
        <p style={s.desc}>{produit.description || 'Aucune description'}</p>

        <div style={s.prix}>
          <span style={s.prixFcfa}>
            {produit.prix_fcfa?.toLocaleString()} FCFA
          </span>
          <span style={s.ou}>ou</span>
          <span style={s.prixCoins}>⚡ {produit.prix_coins} Coins</span>
        </div>

        <div style={s.fourn}>Par : {produit.fournisseur_nom}</div>
        <div style={s.certifie}>✅ Certifié ANEREE</div>

        <button
          onClick={() => setModal(true)}
          style={s.btnAcheter}
        >
          🛒 Commander
        </button>
      </div>

      {/* Modal commande */}
      {modal && !succes && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setModal(false)}
              style={s.fermer}
            >✕</button>

            <h3 style={{ color:'#0F0F1A', marginBottom:'0.5rem' }}>
              🛒 Commander
            </h3>
            <p style={{ color:'#7C3AED', fontWeight:'bold', marginBottom:'1.5rem', fontSize:'0.9rem' }}>
              {produit.nom_produit}
            </p>

            {/* Slider Coins */}
            <div style={s.champ}>
              <label style={s.lbl}>
                Solar Coins à utiliser
                <span style={{ color:'#F59E0B', marginLeft:'0.5rem' }}>
                  ⚡ {coinsUtilises} Coins = -{reductionFcfa.toLocaleString()} FCFA
                </span>
              </label>
              <input
                type="range"
                min="0"
                max={produit.prix_coins}
                step="10"
                value={coinsUtilises}
                onChange={e => setCoinsUtilises(Number(e.target.value))}
                style={{ width:'100%', accentColor:'#7C3AED' }}
              />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#94A3B8' }}>
                <span>0 Coins</span>
                <span>{produit.prix_coins} Coins (gratuit)</span>
              </div>
            </div>

            {/* Prix final */}
            <div style={s.recapCard}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                <span style={{ color:'#64748B' }}>Prix original</span>
                <span>{produit.prix_fcfa?.toLocaleString()} FCFA</span>
              </div>
              {coinsUtilises > 0 && (
                <div style={{ display:'flex', justifyContent:'space-between', color:'#10B981', marginBottom:'0.3rem' }}>
                  <span>Réduction Coins</span>
                  <span>- {reductionFcfa.toLocaleString()} FCFA</span>
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'1.1rem', paddingTop:'0.5rem', borderTop:'1px solid #E2E8F0' }}>
                <span style={{ color:'#0F0F1A' }}>À payer</span>
                <span style={{ color:'#7C3AED' }}>
                  {prixFinal.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            {/* Mode livraison */}
            <div style={s.champ}>
              <label style={s.lbl}>Mode de récupération</label>
              <div style={{ display:'flex', gap:'0.8rem' }}>
                {[
                  { val:'retrait', label:'🏪 Retrait en boutique', desc:'Gratuit' },
                  { val:'livraison', label:'🚚 Livraison à domicile', desc:'Frais selon distance' }
                ].map(opt => (
                  <div
                    key={opt.val}
                    onClick={() => setModeLivraison(opt.val)}
                    style={{
                      flex:1, padding:'0.8rem', borderRadius:'8px',
                      border: `2px solid ${modeLivraison===opt.val ? '#7C3AED' : '#E2E8F0'}`,
                      backgroundColor: modeLivraison===opt.val ? '#EDE9FE' : '#fff',
                      cursor:'pointer', textAlign:'center'
                    }}
                  >
                    <div style={{ fontSize:'0.85rem', fontWeight:'bold', color: modeLivraison===opt.val ? '#7C3AED' : '#374151' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize:'0.72rem', color:'#94A3B8' }}>
                      {opt.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {modeLivraison === 'livraison' && (
              <div style={s.champ}>
                <label style={s.lbl}>Adresse de livraison</label>
                <input
                  type="text"
                  placeholder="Quartier, rue..."
                  value={adresse}
                  onChange={e => setAdresse(e.target.value)}
                  style={s.inp}
                />
              </div>
            )}

            {/* Info délai */}
            <div style={s.infoDelai}>
              📅 Délai estimé : <strong>7 jours</strong> — Vous recevrez une notification chaque jour jusqu'à la livraison.
            </div>

            <button
              onClick={handleAchat}
              disabled={loading}
              style={{ ...s.btnConfirmer, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Commande en cours...' : `✅ Confirmer — ${prixFinal.toLocaleString()} FCFA`}
            </button>
          </div>
        </div>
      )}

      {/* Modal succès */}
      {succes && (
        <div style={s.overlay} onClick={() => { setModal(false); setSucces(null); }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign:'center', padding:'1rem' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎉</div>
              <h3 style={{ color:'#0F0F1A', marginBottom:'0.5rem' }}>
                Commande confirmée !
              </h3>
              <p style={{ color:'#64748B', fontSize:'0.9rem', marginBottom:'1.5rem' }}>
                {succes.produit}
              </p>

              <div style={s.recapSucces}>
                {succes.coins_utilises > 0 && (
                  <div style={s.recapLigne}>
                    <span>⚡ Coins utilisés</span>
                    <span style={{ color:'#F59E0B' }}>{succes.coins_utilises}</span>
                  </div>
                )}
                {succes.reduction_fcfa > 0 && (
                  <div style={s.recapLigne}>
                    <span>💰 Économie</span>
                    <span style={{ color:'#10B981' }}>
                      -{succes.reduction_fcfa.toLocaleString()} FCFA
                    </span>
                  </div>
                )}
                <div style={{ ...s.recapLigne, fontWeight:'bold', borderTop:'1px solid #E2E8F0', paddingTop:'0.5rem' }}>
                  <span>À payer</span>
                  <span style={{ color:'#7C3AED' }}>
                    {succes.fcfa_a_payer.toLocaleString()} FCFA
                  </span>
                </div>
                <div style={s.recapLigne}>
                  <span>📅 Livraison prévue</span>
                  <span>{succes.date_livraison_prevue}</span>
                </div>
              </div>

              <button
                onClick={() => { setModal(false); setSucces(null); }}
                style={s.btnConfirmer}
              >
                Parfait !
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const s = {
  card: { backgroundColor:'#fff', border:'1px solid #E2E8F0', borderRadius:'10px', padding:'1.2rem', boxShadow:'0 2px 12px rgba(124,58,237,0.06)' },
  gamme: { display:'inline-block', backgroundColor:'#EDE9FE', color:'#7C3AED', fontSize:'0.72rem', fontWeight:'bold', padding:'2px 10px', borderRadius:'12px', marginBottom:'0.5rem' },
  nom: { margin:'0 0 0.5rem', color:'#0F0F1A', fontSize:'1rem' },
  desc: { fontSize:'0.85rem', color:'#64748B', marginBottom:'1rem', lineHeight:1.5 },
  prix: { display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' },
  prixFcfa: { fontWeight:'bold', color:'#374151' },
  ou: { color:'#CBD5E1', fontSize:'0.8rem' },
  prixCoins: { color:'#F59E0B', fontWeight:'bold' },
  fourn: { fontSize:'0.78rem', color:'#94A3B8', marginBottom:'0.3rem' },
  certifie: { fontSize:'0.75rem', color:'#06B6D4', marginBottom:'1rem' },
  btnAcheter: { width:'100%', padding:'10px', backgroundColor:'#7C3AED', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'0.9rem' },
  overlay: { position:'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' },
  modal: { backgroundColor:'#fff', borderRadius:'14px', padding:'2rem', width:'100%', maxWidth:'480px', position:'relative', maxHeight:'90vh', overflowY:'auto' },
  fermer: { position:'absolute', top:'1rem', right:'1rem', background:'transparent', border:'1px solid #E2E8F0', borderRadius:'50%', width:'32px', height:'32px', cursor:'pointer', fontSize:'1rem', color:'#64748B' },
  champ: { marginBottom:'1rem' },
  lbl: { display:'block', marginBottom:'6px', fontSize:'0.88rem', color:'#374151', fontWeight:'bold' },
  inp: { width:'100%', padding:'10px 12px', border:'1.5px solid #E2E8F0', borderRadius:'8px', fontSize:'0.95rem', boxSizing:'border-box' },
  recapCard: { backgroundColor:'#F8FAFC', borderRadius:'8px', padding:'1rem', marginBottom:'1rem' },
  infoDelai: { backgroundColor:'#FFFBEB', border:'1px solid #F59E0B44', borderRadius:'8px', padding:'0.8rem', marginBottom:'1rem', fontSize:'0.85rem', color:'#92400E' },
  btnConfirmer: { width:'100%', padding:'12px', backgroundColor:'#7C3AED', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'0.95rem' },
  recapSucces: { backgroundColor:'#F8FAFC', borderRadius:'8px', padding:'1rem', marginBottom:'1.5rem', textAlign:'left' },
  recapLigne: { display:'flex', justifyContent:'space-between', marginBottom:'0.5rem', fontSize:'0.9rem', color:'#374151' },
};