import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useStripe, useElements } from '@stripe/react-stripe-js'; // Import Stripe hooks

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe(); // Initialize stripe
  const elements = useElements(); // Initialize elements (though not strictly needed for redirectToCheckout)
  const [product, setProduct] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Produit non trouvé.');
        setLoading(false);
      });
  }, [id]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    if (!customerName || !customerEmail) {
      setError('Veuillez remplir votre nom et votre email.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Call your backend to create a Stripe Checkout Session
      const response = await axios.post('/api/checkout/create-checkout-session', {
        products: [{
          id: product.id,
          name: product.name,
          image_url: product.image_url,
          price: product.price,
          quantity: 1, // Assuming one product per checkout for now
        }],
        // The success_url and cancel_url are now handled by the backend
      });

      const { id: sessionId } = response.data;

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        setError(result.error.message);
        setIsProcessingPayment(false);
      }
    } catch (err) {
      console.error("Erreur lors de la création de la session Stripe:", err);
      setError('Une erreur est survenue lors de la création de la session de paiement. Veuillez réessayer.');
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Finaliser ma commande</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Info */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
          <img 
            src={product.image_url || 'https://via.placeholder.com/400x300.png?text=Template+Preview'}
            alt={product.name}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="text-right">
            <span className="text-3xl font-bold text-indigo-600">{product.price}$</span>
          </div>
        </div>

        {/* Customer & Payment Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handlePurchase}>
            <h3 className="text-2xl font-semibold mb-6">Vos informations</h3>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nom complet</label>
              <input 
                type="text" 
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Adresse e-mail</label>
              <input 
                type="email" 
                id="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="vous@exemple.com"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Le lien de téléchargement sera envoyé à cette adresse.</p>
            </div>
            
            <p className="text-sm text-gray-500 text-center mt-4">Paiement sécurisé par Stripe</p>
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors mt-2 text-lg disabled:opacity-50"
              disabled={!stripe || isProcessingPayment}
            >
              {isProcessingPayment ? 'Traitement du paiement...' : `Payer ${product.price}$`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

