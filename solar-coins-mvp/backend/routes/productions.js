const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifierToken } = require('../utils/auth');
const { calculerCoins, estDansLesLimites } = require('../utils/calculCoins');

// SAISIR UNE PRODUCTION
router.post('/', verifierToken, async (req, res) => {
  const { installation_id, mois, kwh_produits } = req.body;

  if (!installation_id || !mois || !kwh_produits) {
    return res.status(400).json({
      erreur: 'installation_id, mois et kwh_produits sont obligatoires'
    });
  }

  if (!/^\d{4}-\d{2}$/.test(mois)) {
    return res.status(400).json({
      erreur: 'Format mois invalide — utiliser YYYY-MM (ex: 2025-03)'
    });
  }

  try {
    const instResult = await pool.query(
      'SELECT * FROM installations WHERE id = $1',
      [installation_id]
    );

    if (!instResult.rows[0]) {
      return res.status(404).json({ erreur: 'Installation non trouvée' });
    }

    const installation = instResult.rows[0];

    if (req.user.role === 'client' && installation.user_id !== req.user.id) {
      return res.status(403).json({ erreur: 'Cette installation ne vous appartient pas' });
    }

    const coins = calculerCoins(kwh_produits, installation.gamme);
    const valide = estDansLesLimites(kwh_produits, installation.gamme);

    const result = await pool.query(
      `INSERT INTO productions (installation_id, mois, kwh_produits, coins_gagnes, valide, saisi_par)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [installation_id, mois, kwh_produits, coins, valide, req.user.id]
    );

    // Créditer le wallet si auto-validé
    if (valide) {
      await pool.query(
        `UPDATE coins_wallet
         SET solde_coins = solde_coins + $1,
             total_kwh_cumul = total_kwh_cumul + $2
         WHERE user_id = $3`,
        [coins, kwh_produits, installation.user_id]
      );
    }

    res.status(201).json({
      message: valide
        ? `✅ ${coins} Solar Coins crédités !`
        : `⏳ Production en attente de validation admin`,
      production: result.rows[0],
      coins_gagnes: coins,
      valeur_fcfa: coins * 5,
      auto_valide: valide
    });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        erreur: `Production de ${mois} déjà enregistrée pour cette installation`
      });
    }
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// MES PRODUCTIONS
router.get('/mes', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, i.gamme, i.puissance_wc, i.quartier, i.ville
       FROM productions p
       JOIN installations i ON p.installation_id = i.id
       WHERE i.user_id = $1
       ORDER BY p.mois DESC`,
      [req.user.id]
    );
    res.json({ productions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// VALIDER UNE PRODUCTION (admin)
router.put('/:id/valider', verifierToken, async (req, res) => {
  try {
    const prodResult = await pool.query(
      'SELECT * FROM productions WHERE id = $1',
      [req.params.id]
    );

    if (!prodResult.rows[0]) {
      return res.status(404).json({ erreur: 'Production non trouvée' });
    }

    const production = prodResult.rows[0];

    if (production.valide) {
      return res.status(400).json({ erreur: 'Production déjà validée' });
    }

    await pool.query(
      'UPDATE productions SET valide = true WHERE id = $1',
      [req.params.id]
    );

    const instResult = await pool.query(
      'SELECT * FROM installations WHERE id = $1',
      [production.installation_id]
    );

    await pool.query(
      `UPDATE coins_wallet
       SET solde_coins = solde_coins + $1,
           total_kwh_cumul = total_kwh_cumul + $2
       WHERE user_id = $3`,
      [production.coins_gagnes, production.kwh_produits, instResult.rows[0].user_id]
    );

    res.json({
      message: `✅ ${production.coins_gagnes} Coins crédités au client`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;