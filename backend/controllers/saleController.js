// backend/controllers/saleController.js
const db = require('../config/database');
const crypto = require('crypto');

// Helper pour gérer les erreurs
const handleError = (res, error) => {
  console.error('--- DATABASE ERROR ---', error);
  res.status(500).json({ error: error.message });
};

exports.createSale = async (req, res) => {
  const { product_id, customer_email, customer_name } = req.body;
  
  try {
    // 1. Récupérer le produit
    const productResult = await db.query('SELECT * FROM products WHERE id = $1', [product_id]);
    
    if (productResult.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productResult.rows[0];
    const downloadToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

    // 2. Créer la vente
    const saleQuery = `
      INSERT INTO sales (product_id, customer_email, customer_name, amount, download_token, download_expires) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await db.query(saleQuery, [product_id, customer_email, customer_name, product.price, downloadToken, expires]);

    // TODO: Utiliser une variable d'environnement pour l'URL du frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    res.json({
      success: true,
      download_url: `${frontendUrl}/download/${downloadToken}`,
      message: 'Achat réussi!'
    });

  } catch (error) {
    handleError(res, error);
  }
};

exports.verifyDownload = async (req, res) => {
  const { token } = req.params;

  try {
    const { rows, rowCount } = await db.query('SELECT * FROM sales WHERE download_token = $1', [token]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Lien de téléchargement non valide.' });
    }

    const sale = rows[0];
    const now = new Date();
    const expires = new Date(sale.download_expires);

    if (now > expires) {
      return res.status(403).json({ error: 'Ce lien de téléchargement a expiré.' });
    }

    // Here you would typically get the file path from the product
    // and send the file. For now, we just confirm the link is valid.
    res.json({ success: true, message: 'Le lien est valide.' });

  } catch (error) {
    handleError(res, error);
  }
};