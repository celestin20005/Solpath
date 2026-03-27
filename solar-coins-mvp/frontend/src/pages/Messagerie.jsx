import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getConversations,
  getConversation,
  envoyerMessage
} from '../api';

const roleIcon = (role) => {
  const icons = { client:'👤', fournisseur:'🏪', agent:'🔧', admin:'⚙️' };
  return icons[role] || '👤';
};

export default function Messagerie() {
  const { user } = useAuth();
  const { contactId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [contact, setContact] = useState(null);
  const [contenu, setContenu] = useState('');
  const [loading, setLoading] = useState(true);
  const [envoi, setEnvoi] = useState(false);

  // Charger les conversations
  useEffect(() => {
    getConversations()
      .then(r => setConversations(r.data.conversations))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Charger la conversation active
  useEffect(() => {
    if (!contactId) return;
    getConversation(contactId).then(r => {
      setMessages(r.data.messages);
      setContact(r.data.contact);
    }).catch(() => {});
  }, [contactId]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEnvoyer = async (e) => {
    e.preventDefault();
    if (!contenu.trim() || !contactId) return;
    setEnvoi(true);
    try {
      await envoyerMessage({
        destinataire_id: parseInt(contactId),
        contenu: contenu.trim()
      });
      setContenu('');
      // Recharger les messages
      const r = await getConversation(contactId);
      setMessages(r.data.messages);
    } catch (err) {
      alert(err.response?.data?.erreur || 'Erreur envoi');
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div style={s.page}>

      {/* Sidebar conversations */}
      <div style={s.sidebar}>
        <div style={s.sidebarHeader}>
          <h2 style={s.sidebarTitre}>💬 Messages</h2>
        </div>

        {loading ? (
          <div style={s.loading}>Chargement...</div>
        ) : conversations.length === 0 ? (
          <div style={s.vide}>
            <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>💬</div>
            <p style={{ fontSize:'0.85rem', color:'#94A3B8' }}>
              Aucune conversation
            </p>
          </div>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.contact_id}
              onClick={() => navigate(`/messages/${conv.contact_id}`)}
              style={{
                ...s.convItem,
                backgroundColor: contactId == conv.contact_id
                  ? '#EDE9FE' : '#fff',
                borderLeft: contactId == conv.contact_id
                  ? '3px solid #7C3AED' : '3px solid transparent'
              }}
            >
              <div style={s.convAvatar}>
                {roleIcon(conv.contact_role)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={s.convNom}>
                  {conv.contact_nom}
                  {conv.non_lus > 0 && (
                    <span style={s.badge}>{conv.non_lus}</span>
                  )}
                </div>
                <div style={s.convDernier}>
                  {conv.dernier_message?.substring(0, 40)}...
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Zone de chat */}
      <div style={s.chat}>
        {!contactId ? (
          <div style={s.vide}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>💬</div>
            <p style={{ color:'#64748B' }}>
              Sélectionnez une conversation
            </p>
          </div>
        ) : (
          <>
            {/* Header contact */}
            {contact && (
              <div style={s.chatHeader}>
                <span style={{ fontSize:'1.5rem' }}>
                  {roleIcon(contact.role)}
                </span>
                <div>
                  <div style={s.chatNom}>{contact.nom}</div>
                  <div style={s.chatRole}>{contact.role}</div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div style={s.messages}>
              {messages.length === 0 ? (
                <div style={{ textAlign:'center', color:'#94A3B8', padding:'2rem', fontSize:'0.9rem' }}>
                  Commencez la conversation 👋
                </div>
              ) : (
                messages.map(msg => {
                  const estMoi = msg.expediteur_id === user.id;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: estMoi ? 'flex-end' : 'flex-start',
                        marginBottom: '0.8rem'
                      }}
                    >
                      <div style={{
                        ...s.bulle,
                        backgroundColor: estMoi ? '#7C3AED' : '#F1F5F9',
                        color: estMoi ? '#fff' : '#374151',
                        borderRadius: estMoi
                          ? '18px 18px 4px 18px'
                          : '18px 18px 18px 4px',
                      }}>
                        <div style={{ fontSize:'0.9rem', lineHeight:1.5 }}>
                          {msg.contenu}
                        </div>
                        <div style={{
                          fontSize:'0.68rem',
                          marginTop:'4px',
                          color: estMoi ? '#DDD6FE' : '#94A3B8',
                          textAlign: 'right'
                        }}>
                          {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                            hour:'2-digit', minute:'2-digit'
                          })}
                          {estMoi && (
                            <span style={{ marginLeft:'4px' }}>
                              {msg.lu ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <form onSubmit={handleEnvoyer} style={s.inputZone}>
              <input
                type="text"
                placeholder="Écrire un message..."
                value={contenu}
                onChange={e => setContenu(e.target.value)}
                style={s.inputMsg}
                disabled={envoi}
              />
              <button
                type="submit"
                disabled={!contenu.trim() || envoi}
                style={{
                  ...s.btnEnvoyer,
                  opacity: (!contenu.trim() || envoi) ? 0.5 : 1
                }}
              >
                {envoi ? '...' : '➤'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { display:'flex', height:'calc(100vh - 60px)', overflow:'hidden', backgroundColor:'#F8FAFC' },
  sidebar: { width:'300px', borderRight:'1px solid #E2E8F0', backgroundColor:'#fff', display:'flex', flexDirection:'column', flexShrink:0 },
  sidebarHeader: { padding:'1rem 1.2rem', borderBottom:'1px solid #E2E8F0' },
  sidebarTitre: { color:'#0F0F1A', fontSize:'1rem', margin:0 },
  loading: { padding:'1rem', color:'#94A3B8', fontSize:'0.85rem', textAlign:'center' },
  vide: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', textAlign:'center' },
  convItem: { display:'flex', alignItems:'center', gap:'0.8rem', padding:'0.8rem 1.2rem', cursor:'pointer', borderBottom:'1px solid #F8FAFC' },
  convAvatar: { width:'40px', height:'40px', borderRadius:'50%', backgroundColor:'#EDE9FE', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 },
  convNom: { fontWeight:'bold', fontSize:'0.88rem', color:'#0F0F1A', display:'flex', alignItems:'center', gap:'0.4rem' },
  convDernier: { fontSize:'0.78rem', color:'#94A3B8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  badge: { backgroundColor:'#7C3AED', color:'#fff', borderRadius:'10px', padding:'1px 6px', fontSize:'0.68rem' },
  chat: { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  chatHeader: { padding:'1rem 1.5rem', borderBottom:'1px solid #E2E8F0', backgroundColor:'#fff', display:'flex', alignItems:'center', gap:'0.8rem' },
  chatNom: { fontWeight:'bold', color:'#0F0F1A', fontSize:'0.95rem' },
  chatRole: { fontSize:'0.75rem', color:'#94A3B8' },
  messages: { flex:1, overflowY:'auto', padding:'1.5rem', display:'flex', flexDirection:'column' },
  bulle: { maxWidth:'70%', padding:'0.7rem 1rem', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  inputZone: { padding:'1rem 1.5rem', borderTop:'1px solid #E2E8F0', backgroundColor:'#fff', display:'flex', gap:'0.8rem', alignItems:'center' },
  inputMsg: { flex:1, padding:'10px 16px', border:'1.5px solid #E2E8F0', borderRadius:'24px', fontSize:'0.95rem', outline:'none', backgroundColor:'#F8FAFC' },
  btnEnvoyer: { width:'42px', height:'42px', borderRadius:'50%', backgroundColor:'#7C3AED', color:'#fff', border:'none', cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
};