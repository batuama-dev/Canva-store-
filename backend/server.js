const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const setupDatabase = require('./config/setup'); // Import the setup script
require('dotenv').config();

const app = express();

// --- Main Server Start Function ---
const startServer = async () => {
  // 1. First, ensure the database is set up correctly.
  await setupDatabase();

  // 2. Then, configure and start the Express application.
  
  // CORS configuration
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'https://templyfast.vercel.app', 'https://js.stripe.com'];

  const corsOptions = {
    origin: (origin, callback) => {
      console.log('Requête CORS - Origine:', origin);
      console.log('Origines autorisées:', allowedOrigins);
      // Autoriser les requêtes sans origine (comme Postman, cURL) ou celles qui sont dans la liste blanche
      if (!origin || allowedOrigins.includes(origin)) {
        console.log('CORS: Origine autorisée.');
        callback(null, true);
      } else {
        console.error('CORS: Origine non autorisée:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Routes
  app.use('/api/products', require('./routes/products'));
  app.use('/api/sales', require('./routes/sales'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/messages', require('./routes/messages'));
  app.use('/api/checkout', require('./routes/checkout'));
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// --- Execute the Server Start ---
startServer();