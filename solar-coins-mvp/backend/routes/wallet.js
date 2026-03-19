const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifierToken } = require('../utils/auth');

// MON SOLDE
router.get('/mon-solde', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM coins_wallet WHERE user_id = $1',
      [req.user.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ erreur: 'Wallet non trouvé' });
    }

    const wallet = result.rows[0];
    res.json({
      solde_coins: wallet.solde_coins,
      valeur_fcfa: wallet.solde_coins * 5,
      total_kwh_cumul: wallet.total_kwh_cumul,
      derniere_maj: wallet.derniere_maj
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// HISTORIQUE
router.get('/historique', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.mois, p.kwh_produits, p.coins_gagnes,
              p.coins_gagnes * 5 as valeur_fcfa,
              p.valide, p.created_at,
              i.gamme, i.quartier, i.ville
       FROM productions p
       JOIN installations i ON p.installation_id = i.id
       WHERE i.user_id = $1
       ORDER BY p.mois DESC`,
      [req.user.id]
    );
    res.json({ historique: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// STATISTIQUES
router.get('/stats', verifierToken, async (req, res) => {
  try {
    const wallet = await pool.query(
      'SELECT * FROM coins_wallet WHERE user_id = $1',
      [req.user.id]
    );

    const stats = await pool.query(
      `SELECT COUNT(*) as nb_mois_saisis,
              SUM(kwh_produits) as total_kwh,
              SUM(coins_gagnes) as total_coins,
              MAX(kwh_produits) as meilleur_mois
       FROM productions p
       JOIN installations i ON p.installation_id = i.id
       WHERE i.user_id = $1 AND p.valide = true`,
      [req.user.id]
    );

    const w = wallet.rows[0] || {};
    const s = stats.rows[0] || {};

    res.json({
      solde_actuel_coins: w.solde_coins || 0,
      solde_actuel_fcfa: (w.solde_coins || 0) * 5,
      total_kwh_produits: parseFloat(s.total_kwh) || 0,
      total_coins_gagnes_historique: parseInt(s.total_coins) || 0,
      nb_mois_saisis: parseInt(s.nb_mois_saisis) || 0,
      meilleur_mois_kwh: parseFloat(s.meilleur_mois) || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;