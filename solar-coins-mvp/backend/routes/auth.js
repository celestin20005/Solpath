const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../database');
const { genererToken, verifierToken } = require('../utils/auth');

// INSCRIPTION
router.post('/inscription', async (req, res) => {
  const { nom, email, telephone, password, role } = req.body;

  if (!nom || !email || !password) {
    return res.status(400).json({
      erreur: 'Nom, email et mot de passe sont obligatoires'
    });
  }

  const rolesValides = ['client', 'agent', 'fournisseur', 'admin'];
  const roleUtilisateur = rolesValides.includes(role) ? role : 'client';

  try {
    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (nom, email, password_hash, telephone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nom, email, telephone, role, created_at`,
      [nom, email, password_hash, telephone || null, roleUtilisateur]
    );

    const user = result.rows[0];
    const token = genererToken(user);

    res.status(201).json({
      message: '✅ Compte créé — Bienvenue sur SOLPATH !',
      token,
      user
    });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erreur: 'Cet email est déjà utilisé' });
    }
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// CONNEXION
router.post('/connexion', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ erreur: 'Email et mot de passe requis' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ erreur: 'Email ou mot de passe incorrect' });
    }

    const valide = await bcrypt.compare(password, user.password_hash);
    if (!valide) {
      return res.status(401).json({ erreur: 'Email ou mot de passe incorrect' });
    }

    const { password_hash, ...userSansPassword } = user;
    const token = genererToken(userSansPassword);

    res.json({
      message: '✅ Connexion réussie',
      token,
      user: userSansPassword
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// PROFIL
router.get('/profil', verifierToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nom, email, telephone, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;