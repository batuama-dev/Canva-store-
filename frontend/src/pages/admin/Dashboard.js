import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../../api/axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  
  // Loading and Error States
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [error, setError] = useState(null);

  // Sales Pagination State
  const [salesCurrentPage, setSalesCurrentPage] = useState(1);
  const [salesTotalPages, setSalesTotalPages] = useState(1);

  // Ref for horizontal scrolling
  const statsContainerRef = useRef(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const statsRes = await axios.get('/api/admin/stats');
      setStats(Array.isArray(statsRes.data) ? statsRes.data : []);
    } catch (err) {
      console.error('Error fetching stats data:', err.response || err);
      setError('Impossible de charger les statistiques.');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchSales = useCallback(async (page) => {
    try {
      setLoadingSales(true);
      const salesRes = await axios.get(`/api/admin/recent-sales?page=${page}&limit=5`);
      setRecentSales(Array.isArray(salesRes.data.sales) ? salesRes.data.sales : []);
      setSalesCurrentPage(salesRes.data.currentPage);
      setSalesTotalPages(salesRes.data.totalPages);
    } catch (err) {
      console.error('Error fetching recent sales:', err.response || err);
      setError('Impossible de charger les ventes récentes.');
    } finally {
      setLoadingSales(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchSales(salesCurrentPage);
  }, [fetchSales, salesCurrentPage]);

  const handlePrevSalesPage = () => {
    if (salesCurrentPage > 1) {
        setSalesCurrentPage(p => p - 1);
    }
  };

  const handleNextSalesPage = () => {
      if (salesCurrentPage < salesTotalPages) {
          setSalesCurrentPage(p => p + 1);
      }
  };

  const handleStatsScroll = (direction) => {
    const container = statsContainerRef.current;
    if (container) {
        const scrollAmount = container.offsetWidth * 0.8; // Scroll by 80% of the container's visible width
        container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  const totalRevenue = Array.isArray(stats) ? stats.reduce((acc, item) => acc + parseFloat(item.total_revenue || 0), 0) : 0;
  const totalSales = Array.isArray(stats) ? stats.reduce((acc, item) => acc + parseInt(item.sales_count || 0, 10), 0) : 0;

  if (loadingStats) {
    return <div>Chargement du tableau de bord...</div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
  }

  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Tableau de bord</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h4 className="text-sm font-semibold text-gray-500">Chiffre d'affaires total</h4>
          <p className="text-3xl font-bold text-indigo-600">{totalRevenue > 0 ? totalRevenue.toFixed(2) : '0'}$</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h4 className="text-sm font-semibold text-gray-500">Ventes totales</h4>
          <p className="text-3xl font-bold text-indigo-600">{totalSales}</p>
        </div>
      </div>

      {/* Sales by Product */}
      <div className="mb-8 relative">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-700">Détails par produit</h2>
            {stats.length > 3 && ( // Only show arrows if there's something to scroll
                <div className="flex space-x-2">
                    <button onClick={() => handleStatsScroll(-1)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"><ChevronLeft size={20} /></button>
                    <button onClick={() => handleStatsScroll(1)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"><ChevronRight size={20} /></button>
                </div>
            )}
        </div>
        {stats.length > 0 ? (
          <div ref={statsContainerRef} className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4">
            {stats.map(item => (
              <div key={item.product_name} className="flex-shrink-0 w-80 bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-lg text-gray-800 truncate">{item.product_name}</h3>
                <p className="text-gray-600 mt-2">Ventes: <span className="font-semibold">{item.sales_count}</span></p>
                <p className="text-green-600 font-bold mt-1">Revenu: {item.total_revenue > 0 ? parseFloat(item.total_revenue).toFixed(2) : '0'}$</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune statistique de produit à afficher.</p>
        )}
      </div>

      {/* Recent Sales Table */}
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-opacity duration-300 ${loadingSales ? 'opacity-60' : 'opacity-100'}`}>
        <h2 className="text-2xl font-bold text-gray-700 p-6 border-b">Ventes récentes</h2>
        {recentSales.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold">Client</th>
                    <th className="p-4 font-semibold">Produit</th>
                    <th className="p-4 font-semibold">Montant</th>
                    <th className="p-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map(sale => (
                    <tr key={sale.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{sale.customer_name}</div>
                        <div className="text-sm text-gray-500">{sale.customer_email}</div>
                      </td>
                      <td className="p-4">{sale.product_name}</td>
                      <td className="p-4 font-semibold">{sale.amount}$</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(sale.sale_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination for Recent Sales */}
            {salesTotalPages > 1 && (
              <div className="p-4 flex justify-center items-center border-t">
                <button
                  onClick={handlePrevSalesPage}
                  disabled={salesCurrentPage === 1 || loadingSales}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Précédent
                </button>

                <span className="px-4 py-1 bg-white border-t border-b border-gray-300 text-sm text-gray-700">
                  Page {salesCurrentPage} sur {salesTotalPages}
                </span>

                <button
                  onClick={handleNextSalesPage}
                  disabled={salesCurrentPage === salesTotalPages || loadingSales}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-r-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Suivant
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            )}
          </>
        ) : (
            !loadingSales && <p className="p-6 text-gray-500">Aucune vente récente à afficher.</p>
        )}
         {loadingSales && recentSales.length === 0 && <div className="p-6 text-center text-gray-500">Chargement des ventes...</div>}
      </div>
    </>
  );
};

export default Dashboard;