import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import axios from '../../api/axios';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay, isFuture, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DatePicker from 'react-datepicker';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [error, setError] = useState(null);

  const [salesCurrentPage, setSalesCurrentPage] = useState(1);
  const [salesTotalPages, setSalesTotalPages] = useState(1);

  // --- New Filter State ---
  const [viewMode, setViewMode] = useState('month'); // 'day', 'week', 'month'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const statsContainerRef = useRef(null);

  // --- New Date Calculation Logic ---
  useEffect(() => {
    let start, end;
    
    switch (viewMode) {
      case 'day':
        start = startOfDay(selectedDate);
        end = endOfDay(selectedDate);
        break;
      case 'week':
        start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
        end = endOfWeek(selectedDate, { weekStartsOn: 1 });
        break;
      case 'month':
      default:
        start = startOfMonth(selectedDate);
        end = endOfMonth(selectedDate);
        break;
    }

    // If the calculated end date is in the future, cap it at the current moment
    if (isFuture(end)) {
      end = new Date();
    }

    setDateRange({ startDate: start, endDate: end });
    setSalesCurrentPage(1); // Reset page on new date selection
  }, [viewMode, selectedDate]);

  const fetchStats = useCallback(async (startDate, endDate) => {
    if (!startDate || !endDate) return;
    try {
      setLoadingStats(true);
      const params = new URLSearchParams();
      params.append('startDate', startDate.toISOString());
      params.append('endDate', endDate.toISOString());
      
      const statsRes = await axios.get(`/api/admin/stats?${params.toString()}`);
      setStats(Array.isArray(statsRes.data) ? statsRes.data : []);
    } catch (err) {
      console.error('Error fetching stats data:', err.response || err);
      setError('Impossible de charger les statistiques.');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchSales = useCallback(async (page, startDate, endDate) => {
    if (!startDate || !endDate) return;
    try {
      setLoadingSales(true);
      const params = new URLSearchParams({ page, limit: 5 });
      params.append('startDate', startDate.toISOString());
      params.append('endDate', endDate.toISOString());
      
      const salesRes = await axios.get(`/api/admin/recent-sales?${params.toString()}`);
      setRecentSales(Array.isArray(salesRes.data.sales) ? salesRes.data.sales : []);
      setSalesCurrentPage(salesRes.data.currentPage);
      setSalesTotalPages(salesRes.data.totalPages);
    } catch (err) {
      console.error('Error fetching recent sales:', err.response || err);
      setError('Impossible de charger les ventes.');
    } finally {
      setLoadingSales(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(dateRange.startDate, dateRange.endDate);
    fetchSales(salesCurrentPage, dateRange.startDate, dateRange.endDate);
  }, [dateRange, salesCurrentPage, fetchStats, fetchSales]);

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
        const scrollAmount = container.offsetWidth * 0.8;
        container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Custom Input for DatePicker
  const CustomDatePickerInput = forwardRef(({ value, onClick }, ref) => (
    <button onClick={onClick} ref={ref} className="flex items-center text-indigo-600 font-semibold bg-indigo-100 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors">
      <CalendarIcon size={20} className="mr-2" />
      {value}
    </button>
  ));
  
  const getDatePickerFormat = () => {
      switch(viewMode) {
          case 'day': return 'd MMMM yyyy';
          case 'week': return "'Semaine du' d MMMM yyyy";
          case 'month': return 'MMMM yyyy';
          default: return 'd MMMM yyyy';
      }
  }

  const totalRevenue = Array.isArray(stats) ? stats.reduce((acc, item) => acc + parseFloat(item.total_revenue || 0), 0) : 0;
  const totalSales = Array.isArray(stats) ? stats.reduce((acc, item) => acc + parseInt(item.sales_count || 0, 10), 0) : 0;
  
  const initialLoad = loadingStats && stats.length === 0 && recentSales.length === 0;

  if (initialLoad) {
    return <div className="p-8 text-center">Chargement du tableau de bord...</div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Tableau de bord</h1>
        
        {/* --- New Filter UI --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-white p-2 rounded-lg shadow-sm self-start md:self-center">
            <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setViewMode('day')} className={`px-3 sm:px-4 py-2 rounded-l-md text-sm font-semibold transition-colors ${viewMode === 'day' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Jour</button>
                <button onClick={() => setViewMode('week')} className={`px-3 sm:px-4 py-2 text-sm font-semibold border-l border-r border-gray-200 transition-colors ${viewMode === 'week' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Semaine</button>
                <button onClick={() => setViewMode('month')} className={`px-3 sm:px-4 py-2 rounded-r-md text-sm font-semibold transition-colors ${viewMode === 'month' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Mois</button>
            </div>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat={getDatePickerFormat()}
                locale={fr}
                showMonthYearPicker={viewMode === 'month'}
                showWeekNumbers={viewMode === 'week'}
                customInput={<CustomDatePickerInput />}
            />
        </div>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 transition-opacity duration-300 ${loadingStats ? 'opacity-60' : 'opacity-100'}`}>
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
      <div className={`mb-8 relative transition-opacity duration-300 ${loadingStats ? 'opacity-60' : 'opacity-100'}`}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-700">Détails par produit</h2>
            {stats.filter(s => s.sales_count > 0).length > 3 && (
                <div className="hidden md:flex space-x-2">
                    <button onClick={() => handleStatsScroll(-1)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"><ChevronLeft size={20} /></button>
                    <button onClick={() => handleStatsScroll(1)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"><ChevronRight size={20} /></button>
                </div>
            )}
        </div>
        {!loadingStats && stats.filter(s => s.sales_count > 0).length > 0 ? (
          <div ref={statsContainerRef} className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4">
            {stats.filter(s => s.sales_count > 0).map(item => (
              <div key={item.product_name} className="flex-shrink-0 w-full sm:w-80 bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-lg text-gray-800 truncate">{item.product_name}</h3>
                <p className="text-gray-600 mt-2">Ventes: <span className="font-semibold">{item.sales_count}</span></p>
                <p className="text-green-600 font-bold mt-1">Revenu: {item.total_revenue > 0 ? parseFloat(item.total_revenue).toFixed(2) : '0'}$</p>
              </div>
            ))}
          </div>
        ) : (
          !loadingStats && <p className="text-gray-500 p-6 bg-white rounded-xl shadow-md">Aucune statistique de produit à afficher pour cette période.</p>
        )}
      </div>

      {/* Packs vendus Table */}
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-opacity duration-300 ${loadingSales ? 'opacity-60' : 'opacity-100'}`}>
        <h2 className="text-2xl font-bold text-gray-700 p-6 border-b">Packs vendus</h2>
        {recentSales.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left responsive-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold">Client</th>
                    <th className="p-4 font-semibold">Produit</th>
                    <th className="p-4 font-semibold">Montant</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map(sale => (
                    <tr key={sale.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td data-label="Client" className="p-4">
                        <div className="font-medium">{sale.customer_name}</div>
                        <div className="text-sm text-gray-500">{sale.customer_email}</div>
                      </td>
                      <td data-label="Produit" className="p-4">{sale.product_name}</td>
                      <td data-label="Montant" className="p-4 font-semibold">{sale.amount}$</td>
                      <td data-label="Date" className="p-4 text-sm text-gray-500">{format(new Date(sale.sale_date), 'P', { locale: fr })}</td>
                      <td data-label="Heure" className="p-4 text-sm text-gray-500">{format(new Date(sale.sale_date), 'p', { locale: fr })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {salesTotalPages > 1 && (
              <div className="p-4 flex flex-col sm:flex-row justify-center items-center border-t gap-2">
                  <div className="flex">
                    <button
                      onClick={handlePrevSalesPage}
                      disabled={salesCurrentPage === 1 || loadingSales}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Précédent
                    </button>

                    <span className="px-4 py-1 bg-white border-t border-b border-gray-300 text-sm text-gray-700 hidden sm:block">
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
                   <span className="text-sm text-gray-700 sm:hidden">
                      Page {salesCurrentPage} sur {salesTotalPages}
                    </span>
              </div>
            )}
          </>
        ) : (
            !loadingSales && <p className="p-6 text-gray-500">Aucun pack vendu pour cette période.</p>
        )}
         {loadingSales && recentSales.length === 0 && <div className="p-6 text-center text-gray-500">Chargement des ventes...</div>}
      </div>
    </>
  );
};

export default Dashboard;