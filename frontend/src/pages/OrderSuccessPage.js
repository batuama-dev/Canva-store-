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
  const [downloadInfo, setDownloadInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to transform Cloudinary URL to force download with a specific filename
  const getForceDownloadUrl = (url, filename) => {
    if (!url || !url.includes('res.cloudinary.com')) {
      console.warn('URL non valide ou non-Cloudinary:', url);
      return url;
    }

    // 1. Extraire le public_id de l'URL originale. C'est la partie après la version (ex: /v1234567890/).
    const match = url.match(/\/v\d+\/(.*)$/);
    const publicId = match ? match[1] : null;

    if (!publicId) {
      console.warn('Impossible d\'extraire le public_id de l\'URL Cloudinary. Retour de l\'URL originale:', url);
      return url; // Simplification: on retourne l'URL originale si le format est inattendu
    }
    
    // 2. Nettoyer le nom de fichier désiré et s'assurer qu'il se termine par .pdf
    const safeFilename = filename.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
    const finalFilename = safeFilename.endsWith('.pdf') ? safeFilename : `${safeFilename}.pdf`;

    // 3. Extraire l'URL de base (ex: https://res.cloudinary.com/cloud/raw/upload)
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    const baseUrl = urlParts.slice(0, uploadIndex + 1).join('/');

    // 4. Construire la nouvelle URL avec la transformation de téléchargement
    // Format: .../raw/upload/fl_attachment:filename/public_id
    const newUrl = `${baseUrl}/fl_attachment:${finalFilename}/${publicId}`;

    console.log('--- [Debug Frontend] URL Originale:', url);
    console.log('--- [Debug Frontend] URL de téléchargement transformée:', newUrl);

    return newUrl;
  };

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError('ID de session de paiement manquant.');
        setLoading(false);
        return;
      }

      try {
        // Appeler le backend pour confirmer la session Stripe et obtenir l'URL de téléchargement
        const response = await axios.post('/api/sales/confirm-stripe-session', { sessionId });

        // --- LOGS STRATÉGIQUES ---
        console.log('--- [Debug Frontend] Réponse reçue du backend (/confirm-stripe-session) ---');
        console.log(response.data);
        // --- FIN DES LOGS ---

        if (response.data && response.data.download_url) {
          const productName = response.data.product_name || 'pack-templyfast';
          const forceDownloadUrl = getForceDownloadUrl(response.data.download_url, productName);
          
          setDownloadInfo({
            url: forceDownloadUrl,
            name: productName
          });
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
              Votre paiement a été traité avec succès. Un e-mail de confirmation contenant tous les liens d'accès vous a été envoyé.
            </p>
            {downloadInfo ? (
              <a
                href={downloadInfo.url}
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Télécharger le Fichier
              </a>
            ) : (
              <p className="text-red-500">
                Lien de téléchargement non disponible. Veuillez vérifier vos e-mails ou contacter le support.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessPage;

