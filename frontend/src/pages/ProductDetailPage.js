import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const allImages = React.useMemo(() => {
    if (!product) return [];
    // The image_url from the backend is now a full Cloudinary URL, so no need to prepend baseUrl
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
  
  const mainImage = allImages[currentIndex];

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader border-t-4 border-b-4 border-indigo-500 rounded-full w-16 h-16 animate-spin"></div></div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600 font-semibold">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-20">Aucun produit à afficher.</div>;
  }

  return (
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
            
            <Link 
              to={`/checkout/${product.id}`} 
              className="w-full text-center bg-indigo-600 text-white font-bold text-lg py-4 px-8 rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out block"
            >
              Procéder à l'achat
            </Link>

            <div className="mt-8 text-sm text-gray-500">
                <p><span className="font-semibold">Catégorie:</span> {product.category || 'Non spécifiée'}</p>
                <p className="mt-2">Payement sécurisé via Stripe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;