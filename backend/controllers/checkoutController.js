const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const { products, success_url, cancel_url } = req.body;

  try {
    const line_items = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.image_url],
        },
        unit_amount: Math.round(product.price * 100), // Stripe expects the amount in cents
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
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
