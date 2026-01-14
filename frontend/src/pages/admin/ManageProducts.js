import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import ActivityLogList from '../../components/admin/ActivityLogList';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activityLogKey, setActivityLogKey] = useState(0); // Key to force re-render

  const fetchProducts = (page = 1) => {
    setLoading(true);
    axios.get(`/api/products/admin/all?page=${page}&limit=10`)
      .then(res => {
        setProducts(res.data.products);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        setError('Impossible de charger les produits.');
        setLoading(false);
      });
  };

  // When a user creates/edits a product and comes back, we want to be on page 1
  // and see the latest activity. A simple way is to listen for focus changes.
  useEffect(() => {
    const handleFocus = () => {
      fetchProducts(1); // Refetch products on page 1
      setActivityLogKey(prevKey => prevKey + 1); // Refresh activity log
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);


  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        // Refetch products for the current page
        fetchProducts(currentPage);
        // Force re-render of ActivityLogList
        setActivityLogKey(prevKey => prevKey + 1);
      } catch (err) => {
        setError('Erreur lors de la suppression du produit.');
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Gérer les produits</h1>
        <Link
          to="/admin/products/new"
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors self-start md:self-auto"
        >
          + Ajouter un produit
        </Link>
      </div>

      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-60' : 'opacity-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left responsive-table">
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
                  <td data-label="Produit" className="p-4 font-medium">{product.name}</td>
                  <td data-label="Prix" className="p-4">${product.price}</td>
                  <td data-label="Quantité" className="p-4">{product.quantity}</td>
                  <td data-label="Actif" className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.active ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td data-label="Actions" className="p-4">
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:underline">Modifier</Link>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Supprimer</button>
                    </div>
                  </td>
                </tr>
              )) : (
                !loading && <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-8">Aucun produit à afficher.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="p-4 flex flex-col sm:flex-row justify-center items-center mt-8 gap-2">
            <div className="flex">
                <button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                <ChevronLeft size={16} className="mr-1" />
                Précédent
                </button>
                <span className="px-4 py-1 bg-white border-t border-b border-gray-300 text-sm text-gray-700 hidden sm:block">
                    Page {currentPage} sur {totalPages}
                </span>
                <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 bg-white border border-gray-300 rounded-r-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                Suivant
                <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
            <span className="text-sm text-gray-700 sm:hidden">
                Page {currentPage} sur {totalPages}
            </span>
        </div>
      )}

      <ActivityLogList key={activityLogKey} />
    </div>
  );
};

export default ManageProducts;
