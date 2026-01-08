const db = require('../config/database');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');
const axios = require('axios'); // Ajout d'axios

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Helper pour gérer les erreurs
const handleError = (res, error) => {
  console.error('--- DATABASE ERROR ---', error);
  res.status(500).json({ error: error.message });
};

// Helper pour slugifier les noms de fichiers
const slugify = (text) => {
  if (!text) return 'file';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};


exports.confirmStripeSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data'],
    });

    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Session de paiement non valide ou non payée.' });
    }

    const customerEmail = session.customer_details.email;
    const customerName = session.customer_details.name || 'Client Stripe';
    
    const productLineItem = session.line_items.data[0];
    const stripeProduct = await stripe.products.retrieve(productLineItem.price.product);
    
    const productIdFromStripe = stripeProduct.metadata.product_id;
    const productResult = await db.query('SELECT id, name, price, file_url, product_links FROM products WHERE id = $1', [productIdFromStripe]);

    if (productResult.rowCount === 0) {
      return res.status(404).json({ error: `Produit avec l'ID "${productIdFromStripe}" non trouvé.` });
    }
    const product = productResult.rows[0];

    if (!product.file_url || !product.product_links) {
      return res.status(500).json({ error: 'La configuration de ce produit est incomplète.' });
    }

    const downloadToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const saleQuery = `
      INSERT INTO sales (product_id, customer_email, customer_name, amount, download_token, download_expires, stripe_session_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    // On capture le 'saleId' retourné par la requête
    const saleResult = await db.query(saleQuery, [
      product.id, customerEmail, customerName, product.price, downloadToken, expires, sessionId
    ]);
    const saleId = saleResult.rows[0].id;

    const linksList = product.product_links.split('\n').map(link => link.trim()).filter(link => link.length > 0).map(link => `<li><a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a></li>`).join('');
    const emailHtml = `...`; // Le contenu de l'email reste le même

    const emailMsg = {
      to: customerEmail,
      from: 'templyfast@gmail.com',
      subject: `Accès à votre achat Templyfast : ${product.name}`,
      html: emailHtml,
    };

    try {
      await sgMail.send(emailMsg);
    } catch (emailError) {
      console.error('--- SENDGRID ERROR ---', emailError.response ? emailError.response.body : emailError);
    }

    // Répondre avec l'ID de la vente, nécessaire pour le lien de téléchargement
    res.json({
      success: true,
      sale_id: saleId, // <-- On renvoie le sale_id
      product_name: product.name,
      message: 'Paiement confirmé et achat enregistré avec succès!'
    });

  } catch (error) {
    handleError(res, error);
  }
};


// Nouvelle fonction pour servir de proxy de téléchargement
exports.downloadProduct = async (req, res) => {
  const { saleId } = req.params;

  try {
    // 1. Récupérer l'URL du fichier et le nom du produit en se basant sur l'ID de la vente
    const query = `
      SELECT p.file_url, p.name 
      FROM products p
      JOIN sales s ON p.id = s.product_id
      WHERE s.id = $1
    `;
    const result = await db.query(query, [saleId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Vente ou produit non trouvé.' });
    }

    const { file_url, name } = result.rows[0];

    if (!file_url) {
      return res.status(404).json({ error: 'Aucun fichier associé à ce produit.' });
    }

    // 2. Télécharger le fichier depuis Cloudinary en tant que buffer
    const response = await axios({
      method: 'GET',
      url: file_url,
      responseType: 'stream', // Important pour gérer les gros fichiers
    });

    // 3. Préparer le nom du fichier pour le téléchargement
    const filename = `${slugify(name)}.pdf`;

    // 4. Configurer les en-têtes et renvoyer le flux au client
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    
    response.data.pipe(res); // Transférer le flux directement au client

  } catch (error) {
    console.error('--- DOWNLOAD ERROR ---', error);
    res.status(500).json({ error: 'Erreur lors du téléchargement du fichier.' });
  }
};