const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifierToken, exigerRole } = require('../utils/auth');

// CRÉER UNE INSTALLATION
router.post('/', verifierToken, exigerRole('client', 'admin'), async (req, res) => {
  const { puissance_wc, gamme, quartier, ville, date_installation } = req.body;

  if (!puissance_wc || !gamme) {
    return res.status(400).json({ erreur: 'Puissance et gamme sont obligatoires' });
  }

  const gammesValides = ['basic', 'standard', 'premium'];
  if (!gammesValides.includes(gamme)) {
    return res.status(400).json({ erreur: 'Gamme invalide — basic, standard ou premium' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO installations (user_id, puissance_wc, gamme, quartier, ville, date_installation)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, puissance_wc, gamme, quartier || null,
       ville || 'Bobo-Dioulasso', date_installation || null]
    );

    res.status(201).json({
      message: '✅ Installation enregistrée',
      installation: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// MES INSTALLATIONS
router.get('/mes', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM installations
       WHERE user_id = $1 AND actif = true
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ installations: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// UNE INSTALLATION PAR ID
router.get('/:id', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM installations WHERE id = $1',
      [req.params.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ erreur: 'Installation non trouvée' });
    }

    const installation = result.rows[0];
    if (req.user.role !== 'admin' && installation.user_id !== req.user.id) {
      return res.status(403).json({ erreur: 'Accès refusé' });
    }

    res.json({ installation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;