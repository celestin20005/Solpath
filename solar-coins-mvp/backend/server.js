require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/installations', require('./routes/installations'));
app.use('/api/productions',   require('./routes/productions'));
app.use('/api/wallet',        require('./routes/wallet'));
app.use('/api/produits',      require('./routes/produits'));
app.use('/api/admin',         require('./routes/admin'));

// Route test
app.get('/', (req, res) => {
  res.json({
    message: '☀️ SOLPATH by NEXCID — API en ligne',
    version: '1.0.0-MVP',
    database: 'PostgreSQL via Supabase',
    status: 'OK'
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('☀️  ====================================');
  console.log('☀️   SOLPATH by NEXCID — EN LIGNE');
  console.log(`☀️   http://localhost:${PORT}`);
  console.log('☀️  ====================================');
  console.log('');
});