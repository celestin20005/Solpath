const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifierToken, exigerRole } = require('../utils/auth');

// CATALOGUE
router.get('/', verifierToken, async (req, res) => {
  try {
    const { gamme, categorie } = req.query;
    let query = `
      SELECT p.*, u.nom as fournisseur_nom
      FROM produits p
      JOIN users u ON p.fournisseur_id = u.id
      WHERE p.disponible = true
    `;
    const params = [];

    if (gamme) {
      params.push(gamme);
      query += ` AND (p.gamme_cible = $${params.length} OR p.gamme_cible = 'tous')`;
    }
    if (categorie) {
      params.push(categorie);
      query += ` AND p.categorie = $${params.length}`;
    }

    query += ' ORDER BY p.prix_coins ASC';

    const result = await pool.query(query, params);
    res.json({ produits: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// AJOUTER UN PRODUIT
router.post('/', verifierToken, exigerRole('fournisseur', 'admin'), async (req, res) => {
  const { nom_produit, description, categorie, prix_fcfa, prix_coins, gamme_cible } = req.body;

  if (!nom_produit || !prix_fcfa || !prix_coins) {
    return res.status(400).json({
      erreur: 'nom_produit, prix_fcfa et prix_coins sont obligatoires'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO produits (fournisseur_id, nom_produit, description, categorie, prix_fcfa, prix_coins, gamme_cible)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, nom_produit, description || null,
       categorie || 'autre', prix_fcfa, prix_coins, gamme_cible || 'tous']
    );

    res.status(201).json({
      message: '✅ Produit ajouté au catalogue',
      produit: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// MODIFIER UN PRODUIT
router.put('/:id', verifierToken, exigerRole('fournisseur', 'admin'), async (req, res) => {
  const { nom_produit, description, prix_fcfa, prix_coins, disponible, gamme_cible } = req.body;

  try {
    const prodResult = await pool.query(
      'SELECT * FROM produits WHERE id = $1',
      [req.params.id]
    );

    if (!prodResult.rows[0]) {
      return res.status(404).json({ erreur: 'Produit non trouvé' });
    }

    const p = prodResult.rows[0];
    if (req.user.role !== 'admin' && p.fournisseur_id !== req.user.id) {
      return res.status(403).json({ erreur: 'Accès refusé' });
    }

    const result = await pool.query(
      `UPDATE produits SET
        nom_produit = $1, description = $2, prix_fcfa = $3,
        prix_coins = $4, disponible = $5, gamme_cible = $6
       WHERE id = $7 RETURNING *`,
      [nom_produit || p.nom_produit, description || p.description,
       prix_fcfa || p.prix_fcfa, prix_coins || p.prix_coins,
       disponible !== undefined ? disponible : p.disponible,
       gamme_cible || p.gamme_cible, req.params.id]
    );

    res.json({ message: '✅ Produit mis à jour', produit: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;