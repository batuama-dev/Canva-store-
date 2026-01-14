import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ActivityLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = (page = 1) => {
    setLoading(true);
    axios.get(`/api/admin/activity-logs?page=${page}&limit=5`)
      .then(res => {
        setLogs(res.data.logs);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        setError('Impossible de charger l\'historique des activités.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

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

  const renderLogDetails = (log) => {
    const formattedDate = format(new Date(log.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr });
    return `Le ${formattedDate} - ${log.details}`;
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Historique des activités</h2>
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-60' : ''}`}>
        <ul className="divide-y divide-gray-200">
          {logs.length > 0 ? logs.map(log => (
            <li key={log.id} className="p-4">
              <p className="text-sm text-gray-600">{renderLogDetails(log)}</p>
            </li>
          )) : (
            !loading && <li className="p-4 text-center text-gray-500">Aucune activité enregistrée.</li>
          )}
        </ul>
        {loading && logs.length === 0 && <p className="p-4 text-center text-gray-500">Chargement de l'historique...</p>}
      </div>

      {totalPages > 1 && (
        <div className="p-4 flex flex-col sm:flex-row justify-center items-center mt-4 gap-2">
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
    </div>
  );
};

export default ActivityLogList;
