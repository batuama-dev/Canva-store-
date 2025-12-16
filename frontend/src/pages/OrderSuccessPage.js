import React from 'react';
import { useLocation } from 'react-router-dom';

// A helper function to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OrderSuccessPage = () => {
  const query = useQuery();
  const downloadUrl = query.get('download_url');

  return (
    <div className="container mx-auto p-4 text-center">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-2xl mx-auto">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Merci pour votre achat !</h1>
        <p className="text-gray-600 mb-6">
          Votre paiement a été traité avec succès. Vous recevrez également un e-mail de confirmation contenant le lien de téléchargement.
        </p>
        {downloadUrl ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Télécharger mon template
          </a>
        ) : (
          <p className="text-red-500">
            Impossible de récupérer le lien de téléchargement. Veuillez vérifier vos e-mails.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessPage;
