const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifierToken } = require('../utils/auth');

// ENVOYER UN MESSAGE
router.post('/', verifierToken, async (req, res) => {
  const { destinataire_id, contenu } = req.body;

  if (!destinataire_id || !contenu) {
    return res.status(400).json({
      erreur: 'destinataire_id et contenu sont obligatoires'
    });
  }

  if (destinataire_id === req.user.id) {
    return res.status(400).json({
      erreur: 'Vous ne pouvez pas vous envoyer un message'
    });
  }

  try {
    // Vérifier que le destinataire existe
    const dest = await pool.query(
      'SELECT id, nom, role FROM users WHERE id = $1',
      [destinataire_id]
    );

    if (!dest.rows[0]) {
      return res.status(404).json({ erreur: 'Destinataire non trouvé' });
    }

    const result = await pool.query(
      `INSERT INTO messages (expediteur_id, destinataire_id, contenu)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, destinataire_id, contenu]
    );

    // Créer une notification pour le destinataire
    await pool.query(
      `INSERT INTO notifications
        (user_id, type, titre, message, lien)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        destinataire_id,
        'nouveau_message',
        '💬 Nouveau message',
        `${req.user.nom || 'Un utilisateur'} vous a envoyé un message.`,
        `/messages/${req.user.id}`
      ]
    );

    res.status(201).json({
      message: '✅ Message envoyé',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// MES CONVERSATIONS (liste des contacts)
router.get('/conversations', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (contact_id)
         contact_id,
         contact_nom,
         contact_role,
         dernier_message,
         derniere_date,
         non_lus
       FROM (
         SELECT
           CASE
             WHEN m.expediteur_id = $1 THEN m.destinataire_id
             ELSE m.expediteur_id
           END as contact_id,
           CASE
             WHEN m.expediteur_id = $1 THEN ud.nom
             ELSE ue.nom
           END as contact_nom,
           CASE
             WHEN m.expediteur_id = $1 THEN ud.role
             ELSE ue.role
           END as contact_role,
           m.contenu as dernier_message,
           m.created_at as derniere_date,
           COUNT(CASE WHEN m.destinataire_id = $1 AND m.lu = false THEN 1 END)
             OVER (PARTITION BY
               CASE WHEN m.expediteur_id = $1
                 THEN m.destinataire_id
                 ELSE m.expediteur_id END
             ) as non_lus
         FROM messages m
         JOIN users ue ON m.expediteur_id = ue.id
         JOIN users ud ON m.destinataire_id = ud.id
         WHERE m.expediteur_id = $1 OR m.destinataire_id = $1
         ORDER BY m.created_at DESC
       ) sub
       ORDER BY contact_id, derniere_date DESC`,
      [req.user.id]
    );

    res.json({ conversations: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// CONVERSATION AVEC UN CONTACT
router.get('/:contact_id', verifierToken, async (req, res) => {
  const { contact_id } = req.params;

  try {
    // Vérifier que le contact existe
    const contact = await pool.query(
      'SELECT id, nom, role FROM users WHERE id = $1',
      [contact_id]
    );

    if (!contact.rows[0]) {
      return res.status(404).json({ erreur: 'Contact non trouvé' });
    }

    // Récupérer les messages
    const result = await pool.query(
      `SELECT m.*,
         ue.nom as expediteur_nom,
         ue.role as expediteur_role
       FROM messages m
       JOIN users ue ON m.expediteur_id = ue.id
       WHERE (m.expediteur_id = $1 AND m.destinataire_id = $2)
          OR (m.expediteur_id = $2 AND m.destinataire_id = $1)
       ORDER BY m.created_at ASC`,
      [req.user.id, contact_id]
    );

    // Marquer les messages reçus comme lus
    await pool.query(
      `UPDATE messages SET lu = true
       WHERE destinataire_id = $1 AND expediteur_id = $2 AND lu = false`,
      [req.user.id, contact_id]
    );

    res.json({
      contact: contact.rows[0],
      messages: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// NOMBRE DE MESSAGES NON LUS
router.get('/non-lus/count', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count
       FROM messages
       WHERE destinataire_id = $1 AND lu = false`,
      [req.user.id]
    );
    res.json({ non_lus: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;