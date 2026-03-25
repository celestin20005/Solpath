const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifierToken } = require('../utils/auth');

// PASSER UNE COMMANDE
router.post('/', verifierToken, async (req, res) => {
  const {
    produit_id,
    quantite = 1,
    coins_utilises = 0,
    mode_livraison = 'retrait',
    adresse_livraison
  } = req.body;

  if (!produit_id) {
    return res.status(400).json({ erreur: 'produit_id obligatoire' });
  }

  try {
    // Récupérer le produit
    const prodResult = await pool.query(
      'SELECT * FROM produits WHERE id = $1 AND disponible = true',
      [produit_id]
    );

    if (!prodResult.rows[0]) {
      return res.status(404).json({ erreur: 'Produit non trouvé' });
    }

    const produit = prodResult.rows[0];

    // Récupérer le wallet du client
    const walletResult = await pool.query(
      'SELECT * FROM coins_wallet WHERE user_id = $1',
      [req.user.id]
    );

    const wallet = walletResult.rows[0];
    const solde = wallet?.solde_coins || 0;

    // Vérifier que les Coins utilisés ne dépassent pas le solde
    if (coins_utilises > solde) {
      return res.status(400).json({
        erreur: `Solde insuffisant — vous avez ${solde} Coins`
      });
    }

    // Vérifier que les Coins ne dépassent pas le prix du produit
    const coinsMax = produit.prix_coins * quantite;
    const coinsReels = Math.min(coins_utilises, coinsMax);

    // Calculer le prix final en FCFA
    const reductionFcfa = coinsReels * 5;
    const prixTotal = produit.prix_fcfa * quantite;
    const fcfaAPayer = Math.max(0, prixTotal - reductionFcfa);

    // Date de livraison prévue — 7 jours
    const dateLivraison = new Date();
    dateLivraison.setDate(dateLivraison.getDate() + 7);

    // Créer la commande
    const commandeResult = await pool.query(
      `INSERT INTO commandes
        (client_id, produit_id, fournisseur_id, quantite,
         prix_fcfa, prix_coins, coins_utilises, fcfa_a_payer,
         mode_livraison, adresse_livraison, date_livraison_prevue)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        req.user.id, produit_id, produit.fournisseur_id,
        quantite, prixTotal, coinsMax, coinsReels, fcfaAPayer,
        mode_livraison, adresse_livraison || null,
        dateLivraison.toISOString().split('T')[0]
      ]
    );

    // Déduire les Coins du wallet
    if (coinsReels > 0) {
      await pool.query(
        `UPDATE coins_wallet
         SET solde_coins = solde_coins - $1
         WHERE user_id = $2`,
        [coinsReels, req.user.id]
      );
    }

    // Créer une notification pour le client
    await pool.query(
      `INSERT INTO notifications
        (user_id, type, titre, message, lien)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user.id,
        'commande_confirmee',
        '✅ Commande confirmée !',
        `Votre commande de ${produit.nom_produit} est confirmée. ${
          mode_livraison === 'livraison'
            ? `Livraison prévue le ${dateLivraison.toLocaleDateString('fr-FR')}.`
            : 'Vous pouvez venir récupérer votre commande chez le fournisseur.'
        }`,
        `/mes-commandes/${commandeResult.rows[0].id}`
      ]
    );

    // Créer une notification pour le fournisseur
    await pool.query(
      `INSERT INTO notifications
        (user_id, type, titre, message, lien)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        produit.fournisseur_id,
        'nouvelle_commande',
        '🛒 Nouvelle commande reçue !',
        `Un client a commandé : ${produit.nom_produit} (x${quantite}). Montant : ${fcfaAPayer.toLocaleString()} FCFA.`,
        `/mes-commandes`
      ]
    );

    res.status(201).json({
      message: '✅ Commande passée avec succès !',
      commande: commandeResult.rows[0],
      resume: {
        produit: produit.nom_produit,
        quantite,
        prix_original: prixTotal,
        coins_utilises: coinsReels,
        reduction_fcfa: reductionFcfa,
        fcfa_a_payer: fcfaAPayer,
        mode_livraison,
        date_livraison_prevue: dateLivraison.toLocaleDateString('fr-FR')
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// MES COMMANDES (client)
router.get('/mes', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*,
         p.nom_produit, p.description,
         u.nom as fournisseur_nom,
         u.telephone as fournisseur_telephone
       FROM commandes c
       JOIN produits p ON c.produit_id = p.id
       JOIN users u ON c.fournisseur_id = u.id
       WHERE c.client_id = $1
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json({ commandes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// COMMANDES REÇUES (fournisseur)
router.get('/recues', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*,
         p.nom_produit,
         u.nom as client_nom,
         u.telephone as client_telephone
       FROM commandes c
       JOIN produits p ON c.produit_id = p.id
       JOIN users u ON c.client_id = u.id
       WHERE c.fournisseur_id = $1
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json({ commandes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// METTRE À JOUR STATUT (fournisseur/admin)
router.put('/:id/statut', verifierToken, async (req, res) => {
  const { statut } = req.body;
  const statutsValides = ['confirmee','en_cours','livree','annulee'];

  if (!statutsValides.includes(statut)) {
    return res.status(400).json({ erreur: 'Statut invalide' });
  }

  try {
    const commande = await pool.query(
      'SELECT * FROM commandes WHERE id = $1',
      [req.params.id]
    );

    if (!commande.rows[0]) {
      return res.status(404).json({ erreur: 'Commande non trouvée' });
    }

    if (req.user.role !== 'admin' &&
        commande.rows[0].fournisseur_id !== req.user.id) {
      return res.status(403).json({ erreur: 'Accès refusé' });
    }

    await pool.query(
      'UPDATE commandes SET statut = $1 WHERE id = $2',
      [statut, req.params.id]
    );

    // Notifier le client
    const messages = {
      confirmee: '✅ Votre commande a été confirmée par le fournisseur.',
      en_cours: '🚚 Votre commande est en cours de préparation.',
      livree: '🎉 Votre commande a été livrée !',
      annulee: '❌ Votre commande a été annulée. Vos Coins ont été remboursés.'
    };

    await pool.query(
      `INSERT INTO notifications
        (user_id, type, titre, message, lien)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        commande.rows[0].client_id,
        `commande_${statut}`,
        `Commande #${req.params.id} — ${statut}`,
        messages[statut],
        `/mes-commandes/${req.params.id}`
      ]
    );

    // Si annulée — rembourser les Coins
    if (statut === 'annulee' && commande.rows[0].coins_utilises > 0) {
      await pool.query(
        `UPDATE coins_wallet
         SET solde_coins = solde_coins + $1
         WHERE user_id = $2`,
        [commande.rows[0].coins_utilises, commande.rows[0].client_id]
      );
    }

    res.json({ message: `✅ Statut mis à jour : ${statut}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// MES NOTIFICATIONS
router.get('/notifications', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [req.user.id]
    );
    res.json({ notifications: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// MARQUER NOTIFICATIONS LUES
router.put('/notifications/lues', verifierToken, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET lu = true WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ message: '✅ Notifications marquées comme lues' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;