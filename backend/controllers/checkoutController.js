const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const { products } = req.body;
  const productId = products[0]?.id; // Get the product ID from the first product

  // Ensure CLIENT_URL is set, otherwise default for local development
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  if (!productId) {
    return res.status(400).json({ error: "ID de produit manquant." });
  }

  try {
    const line_items = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.image_url],
          metadata: {
            product_id: product.id, // Include your internal product ID here
          },
        },
        unit_amount: Math.round(product.price * 100), // Stripe expects the amount in cents
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/checkout/${productId}`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Erreur lors de la création de la session de paiement Stripe:", error);
    res.status(500).json({ error: "Erreur lors de la création de la session de paiement." });
  }
};

module.exports = {
  createCheckoutSession,
};
