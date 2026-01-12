// frontend/src/components/admin/ActivityLogList.js
import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

  if (loading) {
    return <p>Chargement de l\'historique...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Historique des activités</h2>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {logs.length > 0 ? logs.map(log => (
            <li key={log.id} className="p-4">
              <p className="text-sm text-gray-600">{renderLogDetails(log)}</p>
            </li>
          )) : (
            <li className="p-4 text-center text-gray-500">Aucune activité enregistrée.</li>
          )}
        </ul>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-l-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span className="bg-gray-200 text-gray-700 font-bold py-2 px-4">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-r-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLogList;
