-- SOLPATH by NEXCID — Schema PostgreSQL
-- Deja execute sur Supabase

-- Table 1 : Utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  telephone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'client'
    CHECK (role IN ('client','agent','fournisseur','admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2 : Installations
CREATE TABLE IF NOT EXISTS installations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  puissance_wc INTEGER NOT NULL CHECK (puissance_wc > 0),
  gamme VARCHAR(20) NOT NULL
    CHECK (gamme IN ('basic','standard','premium')),
  quartier VARCHAR(100),
  ville VARCHAR(100) DEFAULT 'Bobo-Dioulasso',
  date_installation DATE,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 3 : Productions
CREATE TABLE IF NOT EXISTS productions (
  id SERIAL PRIMARY KEY,
  installation_id INTEGER NOT NULL REFERENCES installations(id) ON DELETE CASCADE,
  mois VARCHAR(7) NOT NULL,
  kwh_produits DECIMAL(10,2) NOT NULL CHECK (kwh_produits > 0),
  coins_gagnes INTEGER NOT NULL,
  valide BOOLEAN DEFAULT FALSE,
  saisi_par INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(installation_id, mois)
);

-- Table 4 : Wallet
CREATE TABLE IF NOT EXISTS coins_wallet (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  solde_coins INTEGER DEFAULT 0 CHECK (solde_coins >= 0),
  total_kwh_cumul DECIMAL(10,2) DEFAULT 0,
  derniere_maj TIMESTAMP DEFAULT NOW()
);

-- Table 5 : Produits
CREATE TABLE IF NOT EXISTS produits (
  id SERIAL PRIMARY KEY,
  fournisseur_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nom_produit VARCHAR(200) NOT NULL,
  description TEXT,
  categorie VARCHAR(50) DEFAULT 'autre'
    CHECK (categorie IN ('panneau','batterie','onduleur','accessoire','kit','service','autre')),
  prix_fcfa INTEGER NOT NULL CHECK (prix_fcfa > 0),
  prix_coins INTEGER NOT NULL CHECK (prix_coins > 0),
  gamme_cible VARCHAR(20) DEFAULT 'tous',
  disponible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 6 : Messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  expediteur_id INTEGER NOT NULL REFERENCES users(id),
  destinataire_id INTEGER NOT NULL REFERENCES users(id),
  contenu TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 7 : Tickets support
CREATE TABLE IF NOT EXISTS tickets_support (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  categorie VARCHAR(50) NOT NULL,
  sujet VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  statut VARCHAR(20) DEFAULT 'ouvert'
    CHECK (statut IN ('ouvert','en_cours','resolu','ferme')),
  priorite VARCHAR(20) DEFAULT 'normale'
    CHECK (priorite IN ('basse','normale','haute','urgente')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 8 : Reponses tickets
CREATE TABLE IF NOT EXISTS ticket_reponses (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES tickets_support(id) ON DELETE CASCADE,
  auteur_id INTEGER NOT NULL REFERENCES users(id),
  contenu TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 9 : Notations
CREATE TABLE IF NOT EXISTS notations (
  id SERIAL PRIMARY KEY,
  auteur_id INTEGER NOT NULL REFERENCES users(id),
  cible_id INTEGER NOT NULL REFERENCES users(id),
  note INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(auteur_id, cible_id)
);

-- Table 10 : Demandes produits
CREATE TABLE IF NOT EXISTS demandes_produits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  description TEXT NOT NULL,
  budget_fcfa INTEGER,
  urgence VARCHAR(20) DEFAULT 'normal',
  statut VARCHAR(20) DEFAULT 'ouverte',
  created_at TIMESTAMP DEFAULT NOW()
);