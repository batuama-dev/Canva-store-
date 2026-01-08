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

  // Helper function to create a URL-friendly slug
  const slugify = (text) => {
    if (!text) return 'file';
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  // --- Solution to force download with proper filename ---
  const getForceDownloadUrl = (url, productName) => {
    if (!url || !url.includes('res.cloudinary.com')) {
      console.warn('URL non valide ou non-Cloudinary:', url);
      return url;
    }

    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) {
      console.warn('Format d\'URL inattendu:', url);
      return url; // Return original if format is unexpected
    }

    // 1. Sanitize the product name to be URL-friendly
    const safeFilename = slugify(productName) || 'pack-templyfast';

    // 2. Append the .pdf extension
    const filenameWithExt = `${safeFilename}.pdf`;

    // 3. Construct the Cloudinary transformation string
    // This injects /fl_attachment:filename.pdf/ between /upload/ and the version/public_id
    const finalUrl = `${urlParts[0]}/upload/fl_attachment:${filenameWithExt}/${urlParts[1]}`;

    console.log('--- [Debug Frontend] URL Originale:', url);
    console.log('--- [Debug Frontend] Nom du produit:', productName);
    console.log('--- [Debug Frontend] Nom de fichier sécurisé:', filenameWithExt);
    console.log('--- [Debug Frontend] URL de téléchargement finale:', finalUrl);

    return finalUrl;
  };

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError('ID de session de paiement manquant.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('/api/sales/confirm-stripe-session', { sessionId });

        console.log('--- [Debug Frontend] Réponse reçue du backend (/confirm-stripe-session) ---');
        console.log(response.data);

        if (response.data && response.data.download_url) {
          const productName = response.data.product_name || 'pack-templyfast';
          const forceDownloadUrl = getForceDownloadUrl(response.data.download_url, productName);
          
          setDownloadInfo({
            url: forceDownloadUrl,
            // The download attribute on the <a> tag is a fallback
            name: `${slugify(productName)}.pdf`
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
                download={downloadInfo.name} // Suggests a filename to the browser
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

