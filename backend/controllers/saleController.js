// backend/controllers/saleController.js
const db = require('../config/database');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Import Stripe

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

exports.confirmStripeSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data'], // Expand line items to get product details
    });

    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Session de paiement non valide ou non payée.' });
    }

    const customerEmail = session.customer_details.email;
    const customerName = session.customer_details.name || 'Client Stripe'; // Fallback name
    const productLineItem = session.line_items.data[0]; 
    if (!productLineItem || !productLineItem.price || !productLineItem.price.product || !productLineItem.price.product.metadata || !productLineItem.price.product.metadata.product_id) {
      return res.status(400).json({ error: 'Détails du produit (ID) introuvables dans la session Stripe.' });
    }
    
    const productIdFromStripe = productLineItem.price.product.metadata.product_id;
    const productResult = await db.query('SELECT * FROM products WHERE id = $1', [productIdFromStripe]);

    if (productResult.rowCount === 0) {
      return res.status(404).json({ error: `Produit avec l'ID "${productIdFromStripe}" non trouvé dans la base de données.` });
    }
    const product = productResult.rows[0];

    const downloadToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

    // Create the sale record
    const saleQuery = `
      INSERT INTO sales (product_id, customer_email, customer_name, amount, download_token, download_expires, stripe_session_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING download_token;
    `;
    const saleResult = await db.query(saleQuery, [
      product.id,
      customerEmail,
      customerName,
      product.price, // Use product price from our DB for consistency
      downloadToken,
      expires,
      sessionId
    ]);

    const newDownloadToken = saleResult.rows[0].download_token;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    res.json({
      success: true,
      download_url: `${frontendUrl}/download/${newDownloadToken}`,
      message: 'Paiement confirmé et achat enregistré avec succès!'
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