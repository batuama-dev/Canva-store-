import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
    if (!customerName || !customerEmail) {
      setError('Veuillez remplir votre nom et votre email.');
      return;
    }

    try {
      const saleResponse = await axios.post('/api/sales', {
        product_id: product.id,
        customer_name: customerName,
        customer_email: customerEmail,
      });

      const { download_url } = saleResponse.data;
      // Redirect to a success page, passing the download URL
      navigate(`/order-success?download_url=${encodeURIComponent(download_url)}`);

    } catch (err) {
      setError('Une erreur est survenue lors de l\'achat. Veuillez réessayer.');
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
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nom complet</label>
              <input 
                type="text" 
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="John Doe"
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
              />
              <p className="text-sm text-gray-500 mt-1">Le lien de téléchargement sera envoyé à cette adresse.</p>
            </div>

            <div className="border-t pt-6">
               <h3 className="text-2xl font-semibold mb-4">Paiement</h3>
               <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <p className="text-gray-600">La section de paiement sera intégrée ici.</p>
                    <p className="text-sm text-gray-500">(Ex: Stripe, PayPal)</p>
               </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors mt-6 text-lg"
            >
              Payer {product.price}$
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
