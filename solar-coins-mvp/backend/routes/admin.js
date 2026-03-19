const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifierToken, exigerRole } = require('../utils/auth');

// DASHBOARD
router.get('/dashboard', verifierToken, exigerRole('admin'), async (req, res) => {
  try {
    const [users, installations, coins, productions, produits] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM installations WHERE actif = true"),
      pool.query("SELECT SUM(solde_coins) FROM coins_wallet"),
      pool.query("SELECT COUNT(*) FROM productions WHERE valide = false"),
      pool.query("SELECT COUNT(*) FROM produits WHERE disponible = true")
    ]);

    const totalCoins = parseInt(coins.rows[0].sum) || 0;

    res.json({
      stats: {
        total_users: parseInt(users.rows[0].count),
        total_installations: parseInt(installations.rows[0].count),
        total_coins_emis: totalCoins,
        valeur_coins_fcfa: totalCoins * 5,
        productions_en_attente: parseInt(productions.rows[0].count),
        total_produits: parseInt(produits.rows[0].count)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// LISTE UTILISATEURS
router.get('/users', verifierToken, exigerRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.nom, u.email, u.telephone, u.role, u.created_at,
              w.solde_coins
       FROM users u
       LEFT JOIN coins_wallet w ON u.id = w.user_id
       ORDER BY u.created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// PRODUCTIONS EN ATTENTE
router.get('/productions/en-attente', verifierToken, exigerRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, i.gamme, i.puissance_wc, i.quartier, i.ville,
              u.nom as client_nom, u.email as client_email
       FROM productions p
       JOIN installations i ON p.installation_id = i.id
       JOIN users u ON i.user_id = u.id
       WHERE p.valide = false
       ORDER BY p.created_at DESC`
    );
    res.json({ productions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;