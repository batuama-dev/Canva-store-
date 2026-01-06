import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state on new fetch
        console.log('Fetching admin data...');

        const [statsRes, salesRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/recent-sales')
        ]);

        console.log('Stats response:', statsRes.data);
        console.log('Recent sales response:', salesRes.data);

        // Ensure data is an array before setting state
        setStats(Array.isArray(statsRes.data) ? statsRes.data : []);
        setRecentSales(Array.isArray(salesRes.data) ? salesRes.data : []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err.response || err);
        setError('Impossible de charger les données du tableau de bord. Vérifiez la console pour plus de détails.');
      } finally {
        setLoading(false);
        console.log('Finished fetching admin data.');
      }
    };
    fetchData();
  }, []);

  // Ensure stats is an array before reducing. Use parseFloat to prevent string concatenation.
  const totalRevenue = Array.isArray(stats) ? stats.reduce((acc, item) => acc + parseFloat(item.total_revenue || 0), 0) : 0;
  const totalSales = Array.isArray(stats) ? stats.reduce((acc, item) => acc + parseInt(item.sales_count || 0, 10), 0) : 0;

  if (loading) {
    return <div>Chargement du tableau de bord...</div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
  }

  // Final check to prevent render errors if data is still not as expected
  if (!Array.isArray(stats) || !Array.isArray(recentSales)) {
    return <div className="text-orange-500 bg-orange-100 p-4 rounded-lg">Les données reçues ne sont pas dans le format attendu.</div>;
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Détails par produit</h2>
        {stats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map(item => (
              <div key={item.product_name} className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-lg text-gray-800">{item.product_name}</h3>
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
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-700 p-6 border-b">Ventes récentes</h2>
        {recentSales.length > 0 ? (
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
        ) : (
          <p className="p-6 text-gray-500">Aucune vente récente à afficher.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;