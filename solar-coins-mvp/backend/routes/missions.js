const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifierToken } = require('../utils/auth');

function calculerFraisDeplacement(distanceKm) {
  if (distanceKm <= 3)  return 500;
  if (distanceKm <= 7)  return 1500;
  if (distanceKm <= 15) return 3000;
  return 5000;
}

// CRÉER UNE MISSION
router.post('/', verifierToken, async (req, res) => {
  const { type, description, adresse, ville, date_souhaitee } = req.body;

  if (!type || !description) {
    return res.status(400).json({
      erreur: 'Type et description sont obligatoires'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO missions
        (client_id, type, description, adresse, ville, date_souhaitee)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [req.user.id, type, description,
       adresse || null,
       ville || 'Bobo-Dioulasso',
       date_souhaitee || null]
    );

    res.status(201).json({
      message: '✅ Demande envoyée ! Les techniciens disponibles vont être notifiés.',
      mission: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// MES MISSIONS (client)
router.get('/mes', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*,
         u.nom as technicien_nom,
         u.telephone as technicien_telephone
       FROM missions m
       LEFT JOIN techniciens t ON m.technicien_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE m.client_id = $1
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );
    res.json({ missions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// MISSIONS DISPONIBLES (technicien)
router.get('/disponibles', verifierToken, async (req, res) => {
  try {
    const tech = await pool.query(
      'SELECT * FROM techniciens WHERE user_id = $1',
      [req.user.id]
    );

    if (!tech.rows[0]) {
      return res.status(403).json({ erreur: 'Profil technicien requis' });
    }

    const result = await pool.query(
      `SELECT m.*, u.nom as client_nom, u.telephone as client_telephone
       FROM missions m
       JOIN users u ON m.client_id = u.id
       WHERE m.statut = 'ouverte'
       ORDER BY m.created_at DESC`
    );

    res.json({ missions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// ACCEPTER UNE MISSION
router.put('/:id/accepter', verifierToken, async (req, res) => {
  try {
    const tech = await pool.query(
      'SELECT * FROM techniciens WHERE user_id = $1',
      [req.user.id]
    );

    if (!tech.rows[0]) {
      return res.status(403).json({ erreur: 'Profil technicien requis' });
    }

    const mission = await pool.query(
      'SELECT * FROM missions WHERE id = $1',
      [req.params.id]
    );

    if (!mission.rows[0]) {
      return res.status(404).json({ erreur: 'Mission non trouvée' });
    }

    if (mission.rows[0].statut !== 'ouverte') {
      return res.status(400).json({ erreur: 'Mission plus disponible' });
    }

    await pool.query(
      `UPDATE missions SET technicien_id = $1, statut = 'assignee' WHERE id = $2`,
      [tech.rows[0].id, req.params.id]
    );

    res.json({ message: '✅ Mission acceptée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// CRÉER UN DEVIS
router.post('/:id/devis', verifierToken, async (req, res) => {
  const { description_travaux, total_fcfa, total_coins, frais_deplacement, delai_jours } = req.body;

  if (!total_fcfa) {
    return res.status(400).json({ erreur: 'Montant total FCFA obligatoire' });
  }

  try {
    const tech = await pool.query(
      'SELECT * FROM techniciens WHERE user_id = $1',
      [req.user.id]
    );

    if (!tech.rows[0]) {
      return res.status(403).json({ erreur: 'Profil technicien requis' });
    }

    const mission = await pool.query(
      'SELECT * FROM missions WHERE id = $1',
      [req.params.id]
    );

    if (!mission.rows[0]) {
      return res.status(404).json({ erreur: 'Mission non trouvée' });
    }

    const result = await pool.query(
      `INSERT INTO devis
        (mission_id, client_id, technicien_id,
         description_travaux, total_fcfa,
         total_coins, frais_deplacement, delai_jours)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [req.params.id, mission.rows[0].client_id,
       tech.rows[0].id, description_travaux || null,
       total_fcfa, total_coins || 0,
       frais_deplacement || calculerFraisDeplacement(5),
       delai_jours || 1]
    );

    res.status(201).json({
      message: '✅ Devis envoyé au client',
      devis: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// ACCEPTER UN DEVIS (client)
router.put('/devis/:id/accepter', verifierToken, async (req, res) => {
  try {
    const devisResult = await pool.query(
      'SELECT * FROM devis WHERE id = $1',
      [req.params.id]
    );

    if (!devisResult.rows[0]) {
      return res.status(404).json({ erreur: 'Devis non trouvé' });
    }

    const devis = devisResult.rows[0];

    if (devis.client_id !== req.user.id) {
      return res.status(403).json({ erreur: 'Accès refusé' });
    }

    await pool.query(
      "UPDATE devis SET statut = 'accepte' WHERE id = $1",
      [req.params.id]
    );

    await pool.query(
      `UPDATE missions SET
         statut = 'en_cours',
         montant_fcfa = $1,
         montant_coins = $2,
         frais_deplacement = $3
       WHERE id = $4`,
      [devis.total_fcfa, devis.total_coins,
       devis.frais_deplacement, devis.mission_id]
    );

    res.json({ message: '✅ Devis accepté — le technicien va intervenir' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// VALIDER FIN DE TRAVAUX (client)
router.put('/:id/valider-travaux', verifierToken, async (req, res) => {
  try {
    const mission = await pool.query(
      'SELECT * FROM missions WHERE id = $1 AND client_id = $2',
      [req.params.id, req.user.id]
    );

    if (!mission.rows[0]) {
      return res.status(404).json({ erreur: 'Mission non trouvée' });
    }

    if (mission.rows[0].statut !== 'en_cours') {
      return res.status(400).json({ erreur: 'Mission non en cours' });
    }

    await pool.query(
      "UPDATE missions SET statut = 'validee_client' WHERE id = $1",
      [req.params.id]
    );

    if (mission.rows[0].technicien_id) {
      await pool.query(
        'UPDATE techniciens SET nb_missions = nb_missions + 1 WHERE id = $1',
        [mission.rows[0].technicien_id]
      );
    }

    res.json({
      message: '✅ Travaux validés ! Paiement du technicien sous 48h.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;