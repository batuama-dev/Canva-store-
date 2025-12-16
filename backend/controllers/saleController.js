// backend/controllers/saleController.js
const db = require('../config/database');
const crypto = require('crypto');

exports.createSale = (req, res) => {
  const { product_id, customer_email, customer_name } = req.body;
  
  // 1. Récupérer le produit
  db.query('SELECT * FROM products WHERE id = ?', [product_id], (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const product = products[0];
    const downloadToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
    
    // 2. Créer la vente
    db.query(
      `INSERT INTO sales (product_id, customer_email, customer_name, amount, download_token, download_expires) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [product_id, customer_email, customer_name, product.price, downloadToken, expires],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({
          success: true,
          download_url: `http://localhost:3000/download/${downloadToken}`,
          message: 'Achat réussi!'
        });
      }
    );
  });
};

exports.verifyDownload = (req, res) => {
  const { token } = req.params;

  db.query('SELECT * FROM sales WHERE download_token = ?', [token], (err, sales) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const sale = sales[0];

    if (!sale) {
      return res.status(404).json({ error: 'Lien de téléchargement non valide.' });
    }

    const now = new Date();
    const expires = new Date(sale.download_expires);

    if (now > expires) {
      return res.status(403).json({ error: 'Ce lien de téléchargement a expiré.' });
    }

    // Here you would typically get the file path from the product
    // and send the file. For now, we just confirm the link is valid.
    res.json({ success: true, message: 'Le lien est valide.' });
  });
};