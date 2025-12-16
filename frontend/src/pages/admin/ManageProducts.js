import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    // Using the new admin endpoint
    axios.get('/api/products/admin/all')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Impossible de charger les produits.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        // Refresh the list after deleting
        fetchProducts();
      } catch (err) {
        setError('Erreur lors de la suppression du produit.');
      }
    }
  };

  if (loading) {
    return <p>Chargement de la liste des produits...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Gérer les produits</h1>
        <Link 
          to="/admin/products/new"
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Ajouter un produit
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold">Produit</th>
                <th className="p-4 font-semibold">Prix</th>
                <th className="p-4 font-semibold">Quantité</th>
                <th className="p-4 font-semibold">Actif</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map(product => (
                <tr key={product.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">${product.price}</td>
                  <td className="p-4">{product.quantity}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.active ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:underline">Modifier</Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-8">Aucun produit à afficher.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
