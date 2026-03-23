const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifierToken } = require('../utils/auth');

// Calcul niveau Solar Coins selon profil
function calculerNiveau(agrement_aneree, niveau, diplome_type) {
  if (['Licence','Master','Ingénieur'].includes(diplome_type)) return 'platine';
  if (agrement_aneree && niveau === 'expert') return 'or';
  if (agrement_aneree) return 'argent';
  if (['CAP','BEP','BT'].includes(diplome_type)) return 'bronze';
  return null; // Autodidacte — refusé
}

// LISTE TECHNICIENS
router.get('/', verifierToken, async (req, res) => {
  try {
    const { zone, disponible } = req.query;
    let query = `
      SELECT t.*, u.nom, u.email, u.telephone
      FROM techniciens t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (zone) {
      params.push(`%${zone}%`);
      query += ` AND t.zone_intervention ILIKE $${params.length}`;
    }
    if (disponible === 'true') {
      query += ` AND t.disponible = true`;
    }

    query += ` ORDER BY t.note_moyenne DESC`;

    const result = await pool.query(query, params);
    res.json({ techniciens: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// MON PROFIL TECHNICIEN
router.get('/mon-profil', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.nom, u.email, u.telephone
       FROM techniciens t
       JOIN users u ON t.user_id = u.id
       WHERE t.user_id = $1`,
      [req.user.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ erreur: 'Profil technicien non trouvé' });
    }

    res.json({ technicien: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// CRÉER PROFIL TECHNICIEN
router.post('/', verifierToken, async (req, res) => {
  const {
    niveau, zone_intervention, rayon_km,
    tarif_horaire, agrement_aneree,
    annees_experience, bio,
    diplome_type, institution
  } = req.body;

  try {
    const exist = await pool.query(
      'SELECT id FROM techniciens WHERE user_id = $1',
      [req.user.id]
    );

    if (exist.rows[0]) {
      return res.status(409).json({ erreur: 'Vous avez déjà un profil technicien' });
    }

    // Calculer le niveau Solar Coins
    const niveauSolarCoins = calculerNiveau(
      agrement_aneree, niveau, diplome_type
    );

    if (!niveauSolarCoins) {
      return res.status(400).json({
        erreur: 'Solar Coins exige un diplôme minimum (CAP/BEP/BT) ou une certification ANEREE.',
        contact: 'Contactez l\'ANEREE : +226 25 37 47 47'
      });
    }

    const result = await pool.query(
      `INSERT INTO techniciens
        (user_id, niveau, zone_intervention, rayon_km,
         tarif_horaire, agrement_aneree, annees_experience,
         bio, diplome_type, institution, niveau_solar_coins)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [req.user.id, niveau || 'basic',
       zone_intervention || 'Bobo-Dioulasso',
       rayon_km || 10, tarif_horaire || null,
       agrement_aneree || false,
       annees_experience || 0,
       bio || null, diplome_type || null,
       institution || null, niveauSolarCoins]
    );

    res.status(201).json({
      message: `✅ Profil technicien créé — Niveau ${niveauSolarCoins.toUpperCase()}`,
      technicien: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// METTRE À JOUR DISPONIBILITÉ
router.put('/disponibilite', verifierToken, async (req, res) => {
  const { disponible } = req.body;
  try {
    await pool.query(
      'UPDATE techniciens SET disponible = $1 WHERE user_id = $2',
      [disponible, req.user.id]
    );
    res.json({
      message: disponible ? '✅ Vous êtes disponible' : '⏸️ Vous êtes indisponible'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// VALIDER UNE INSTALLATION
router.put('/valider-installation/:id', verifierToken, async (req, res) => {
  const { photo_validation, statut } = req.body;

  if (!['validee','refusee'].includes(statut)) {
    return res.status(400).json({ erreur: "Statut invalide — 'validee' ou 'refusee'" });
  }

  try {
    await pool.query(
      `UPDATE installations SET
         statut_validation = $1,
         validee_par = $2,
         date_validation = NOW(),
         photo_validation = $3,
         actif = $4
       WHERE id = $5`,
      [statut, req.user.id, photo_validation || null,
       statut === 'validee', req.params.id]
    );

    res.json({
      message: statut === 'validee'
        ? '✅ Installation validée — les Coins vont s\'accumuler !'
        : '❌ Installation refusée'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;