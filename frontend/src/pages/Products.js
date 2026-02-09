import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Updated import
import { Helmet } from 'react-helmet-async'; // Import Helmet
import ProductCard from '../components/products/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Impossible de charger les produits.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <>
      <Helmet>
        <title>Templyfast - Notre Collection de Templates Canva Prêts à l'Emploi</title>
        <meta name="description" content="Explorez la vaste collection de Templyfast : des templates Canva pour réseaux sociaux, entreprises, marketing, et événements. Des designs professionnels, personnalisables et téléchargeables instantanément pour tous vos besoins." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Explorez notre collection</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Aucun produit n'est disponible pour le moment.</p>
      )}
    </div>
  );
};

export default Products;