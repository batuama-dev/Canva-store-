import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';

// A helper function to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OrderSuccessPage = () => {
  const query = useQuery();
  const sessionId = query.get('session_id');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError('ID de session de paiement manquant.');
        setLoading(false);
        return;
      }

      try {
        // Call backend to confirm the Stripe session and get download URL
        const response = await axios.post('/api/sales/confirm-stripe-session', { sessionId });
        if (response.data && response.data.download_url) {
          setDownloadUrl(response.data.download_url);
        } else {
          setError('Lien de téléchargement non disponible. Veuillez contacter le support.');
        }
      } catch (err) {
        console.error("Erreur lors de la confirmation de la session Stripe:", err);
        setError('Une erreur est survenue lors de la confirmation de votre paiement. Veuillez vérifier vos e-mails ou contacter le support.');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-white p-10 rounded-lg shadow-xl max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Confirmation de votre commande...</h1>
          <p className="text-gray-600 mb-6">Veuillez patienter pendant que nous confirmons votre paiement.</p>
          {/* You can add a spinner here */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-2xl mx-auto">
        {error ? (
          <>
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Erreur lors de la confirmation !</h1>
            <p className="text-red-600 mb-6">{error}</p>
          </>
        ) : (
          <>
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
                Lien de téléchargement en attente. Veuillez vérifier vos e-mails ou contacter le support.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessPage;

