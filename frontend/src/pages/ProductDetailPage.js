import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { Helmet } from 'react-helmet-async'; // Import Helmet
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStripe } from '@stripe/react-stripe-js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showCgvModal, setShowCgvModal] = useState(false);
  const [hasAcceptedCgv, setHasAcceptedCgv] = useState(false);
  const stripe = useStripe();

  const CGV_CONTENT = `
1. Objet

Les présentes Conditions Générales de Vente régissent la vente de templates Canva numériques proposés sur la plateforme Templyfast.

2. Nature des produits

Les produits vendus sont des fichiers numériques (PDF contenant des liens vers des templates Canva).
Aucun produit physique n’est livré.

3. Accès aux templates

Après paiement, le client :

telecharge un PDF contenant les liens d’accès aux templates Canva achetés et

reçoit par email des liens d’accès aux templates Canva achetés. 

En cas de non-réception, le client doit vérifier sa boîte de spam ou contacter le support pour obtenir


4. Licence d’utilisation

L’achat d’un template donne droit à :

une utilisation personnelle ou commerciale (selon le pack)

la modification libre du design

Il est strictement interdit de :

revendre

redistribuer

partager les templates ou leurs liens tels quels

proposer les templates comme produit principal à la vente

5. Propriété intellectuelle

Les templates restent la propriété intellectuelle de Templyfast.
L’achat ne transfère aucun droit de propriété.

6. Responsabilité

Templyfast ne saurait être tenu responsable :

d’un mauvais usage des templates

d’une incompatibilité avec des outils tiers

d’une utilisation non conforme aux présentes CGV

7. Remboursement

Conformément à la nature numérique des produits, aucun remboursement n’est possible après accès au contenu.

8. Acceptation

Toute commande implique l’acceptation pleine et entière des présentes Conditions Générales de Vente.`;


  useEffect(() => {
    window.scrollTo(0, 0);

    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Produit non trouvé ou erreur de chargement.');
        setLoading(false);
        console.error('Fetch error:', err);
      });
  }, [id]);

  useEffect(() => {
    if (!loading && !stripe) {
      setError('Stripe n\'a pas pu être chargé. Assurez-vous d\'avoir correctement configuré votre clé publique Stripe.');
    }
  }, [loading, stripe]);

  const allImages = React.useMemo(() => {
    if (!product) return [];
    return [
      ...(product.image_url ? [product.image_url] : []),
      ...(product.images ? product.images.map(img => img.image_url) : [])
    ];
  }, [product]);

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? allImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === allImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const handlePurchase = async () => {
    setError('');
    if (!stripe) {
      setError('Stripe n\'est pas prêt. Veuillez patienter un instant.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const response = await axios.post('/api/checkout/create-checkout-session', {
        products: [{
          id: product.id,
          name: product.name,
          image_url: product.image_url,
          price: product.price,
          quantity: 1,
        }],
      });

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError('URL de paiement non reçue. Veuillez réessayer.');
        setIsProcessingPayment(false);
      }
    } catch (err) {
      console.error("Erreur lors de la création de la session Stripe:", err);
      const errorMessage = err.response?.data?.error || 'Une erreur est survenue lors du lancement du paiement.';
      setError(errorMessage);
      setIsProcessingPayment(false);
    }
  };

  const mainImage = allImages[currentIndex];

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader border-t-4 border-b-4 border-indigo-500 rounded-full w-16 h-16 animate-spin"></div></div>;
  }

  if (!product) { // Handles both initial state and fetch failure after loading
    return <div className="text-center mt-20 text-red-600 font-semibold">{error || 'Aucun produit à afficher.'}</div>;
  }

  return (
    <>
      <Helmet>
        <title>Templyfast - {product.name} - Template Canva Professionnel</title>
        <meta name="description" content={`${product.description} | Template Canva prêt à l'emploi. Téléchargez instantanément pour personnaliser votre design sur Templyfast.`} />
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden aspect-w-1 aspect-h-1 relative group">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500"
              />
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={goToPrevious}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-50 focus:outline-none"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={goToNext}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-50 focus:outline-none"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex flex-wrap gap-4">
                {allImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`w-24 h-24 rounded-xl overflow-hidden cursor-pointer border-4 ${currentIndex === index ? 'border-indigo-500' : 'border-transparent'} hover:border-indigo-300 transition-all duration-300 shadow-md`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img src={image} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3">{product.name}</h1>
            <p className="text-gray-600 mb-6 text-lg">{product.description}</p>
            
            <div className="my-8">
                <span className="text-5xl font-bold text-indigo-600">${product.price}</span>
                {product.discount_price && (
                    <span className="ml-4 text-2xl text-gray-400 line-through">${product.discount_price}</span>
                )}
            </div>
            
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4 shadow-sm"><p>{error}</p></div>}

            <div className="mb-4">
                <button
                    onClick={() => setShowCgvModal(true)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none"
                >
                    Lire les conditions générales de vente
                </button>
            </div>

            <div className="mb-6 flex items-center">
                <input
                    type="checkbox"
                    id="acceptCgv"
                    checked={hasAcceptedCgv}
                    onChange={(e) => setHasAcceptedCgv(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptCgv" className="ml-2 block text-sm text-gray-900">
                    J'ai lu et j'accepte les termes et conditions d'utilisation.
                </label>
            </div>

            <button 
              onClick={handlePurchase}
              disabled={!stripe || isProcessingPayment || !hasAcceptedCgv}
              className="w-full text-center bg-indigo-600 text-white font-bold text-lg py-4 px-8 rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out block disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? 'Traitement...' : 'Procéder à l\'achat'}
            </button>

            {/* CGV Modal */}
            {showCgvModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Conditions Générales de Vente – Templyfast</h2>
                        <pre className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                            {CGV_CONTENT}
                        </pre>
                        <button
                            onClick={() => setShowCgvModal(false)}
                            className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-8 text-sm text-gray-500">
                <p><span className="font-semibold">Catégorie:</span> {product.category || 'Non spécifiée'}</p>
                <p className="mt-2">Payement sécurisé via Stripe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetailPage;