// backend/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

// En production (sur Render), DATABASE_URL sera fourni.
// En local, vous pouvez l'ajouter à un fichier .env si vous avez une BDD PostgreSQL locale.
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  // En production, Render nécessite une connexion SSL.
  // En local, vous pourriez ne pas en avoir besoin.
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};