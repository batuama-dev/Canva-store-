const db = require('../config/database');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
  console.log('--- RUNNING LATEST CODE v3 ---'); // Diagnostic log
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
    
    if (!session.line_items || !session.line_items.data || session.line_items.data.length === 0) {
      return res.status(400).json({ error: 'Données de l\'article (line_items) introuvables dans la session Stripe.' });
    }
    const productLineItem = session.line_items.data[0];

    if (!productLineItem.price || !productLineItem.price.product) {
      return res.status(400).json({ error: 'Détails du produit Stripe introuvables.' });
    }
    
    const stripeProduct = await stripe.products.retrieve(productLineItem.price.product);
    
    if (!stripeProduct.metadata || !stripeProduct.metadata.product_id) {
      return res.status(400).json({ error: 'Métadonnées du produit ou "product_id" introuvables dans l\'objet Product de Stripe.' });
    }
    
    const productIdFromStripe = stripeProduct.metadata.product_id;
    const productResult = await db.query('SELECT id, name, price, file_url FROM products WHERE id = $1', [productIdFromStripe]);

    if (productResult.rowCount === 0) {
      return res.status(404).json({ error: `Produit avec l'ID "${productIdFromStripe}" non trouvé dans la base de données.` });
    }
    const product = productResult.rows[0];

    if (!product.file_url) {
      console.error(`Produit ${product.id} acheté sans lien de téléchargement (file_url).`);
      return res.status(500).json({ error: 'Le fichier de ce produit est manquant. Veuillez contacter le support.' });
    }

    const downloadToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const saleQuery = `
      INSERT INTO sales (product_id, customer_email, customer_name, amount, download_token, download_expires, stripe_session_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    await db.query(saleQuery, [
      product.id,
      customerEmail,
      customerName,
      product.price,
      downloadToken,
      expires,
      sessionId
    ]);

    // --- Envoi de l'e-mail de confirmation ---
    const emailMsg = {
      to: customerEmail,
      from: 'templyfast@gmail.com', // Adresse vérifiée sur SendGrid
      subject: 'Merci pour votre achat chez Templyfast !',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Bonjour ${customerName},</h2>
          <p>Nous vous remercions pour votre confiance et votre achat sur Templyfast.</p>
          <p>Vous pouvez télécharger votre produit en cliquant sur le lien ci-dessous :</p>
          <p style="text-align: center;">
            <a href="${product.file_url}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Télécharger mon template
            </a>
          </p>
          <p>Ce lien est valide pendant 7 jours.</p>
          <hr/>
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          <p>Cordialement,<br>L'équipe de Templyfast</p>
        </div>
      `,
    };

    try {
      await sgMail.send(emailMsg);
    } catch (emailError) {
      console.error('--- SENDGRID ERROR ---', emailError.response ? emailError.response.body : emailError);
      // Ne pas bloquer l'utilisateur si l'email échoue, mais logguer l'erreur.
    }
    // --- Fin de l'envoi d'e-mail ---

    // Répondre avec le lien de téléchargement direct
    res.json({
      success: true,
      download_url: product.file_url, // URL de téléchargement directe
      message: 'Paiement confirmé et achat enregistré avec succès!'
    });

  } catch (error) {
    handleError(res, error);
  }
};


exports.verifyDownload = async (req, res) => {
  const { token } = req.params;

  try {
    const query = `
      SELECT s.download_expires, p.file_url
      FROM sales s
      JOIN products p ON s.product_id = p.id
      WHERE s.download_token = $1
    `;
    const { rows, rowCount } = await db.query(query, [token]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Lien de téléchargement non valide.' });
    }

    const saleData = rows[0];
    const now = new Date();
    const expires = new Date(saleData.download_expires);

    if (now > expires) {
      return res.status(403).json({ error: 'Ce lien de téléchargement a expiré.' });
    }
    
    if (!saleData.file_url) {
        return res.status(404).json({ error: 'Aucun fichier associé à ce produit.' });
    }

    // Send the actual download link
    res.json({ success: true, download_url: saleData.file_url });

  } catch (error) {
    handleError(res, error);
  }
};