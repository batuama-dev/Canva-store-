import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from '../api/axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'; // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css';

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
  const navigate = useNavigate(); // Initialize useNavigate

  // Helper function to create a URL-friendly slug
  const slugify = (text) => {
    if (!text) return 'file';
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleDownloadAndRedirect = async () => {
    if (downloadInfo && downloadInfo.url) {
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = downloadInfo.url;
      link.setAttribute('download', downloadInfo.name); // Suggest filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Display SweetAlert2 notification
      await Swal.fire({
        title: 'Téléchargement lancé !',
        text: 'Votre fichier PDF est en cours de téléchargement. Vous allez être redirigé vers la page des produits.',
        icon: 'success',
        timer: 3000, // Close after 3 seconds
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Redirect to products page
      navigate('/products');
    }
  };

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError('ID de session de paiement manquant.');
        setLoading(false);
        return;
      }

      try {
        // 1. Confirmer le paiement et récupérer l'ID de la vente
        const response = await axios.post('/api/sales/confirm-stripe-session', { sessionId });

        console.log('--- [Debug Frontend] Réponse reçue du backend (/confirm-stripe-session) ---');
        console.log(response.data);

        // 2. Vérifier si on a bien le sale_id
        if (response.data && response.data.sale_id) {
          const { sale_id, product_name } = response.data;
          
          // 3. Construire le lien qui pointe vers notre backend (proxy)
          const downloadUrl = `/api/sales/download/${sale_id}`;
          const downloadName = `${slugify(product_name || 'pack')}.pdf`;

          console.log('--- [Debug Frontend] URL de téléchargement (proxy):', downloadUrl);
          console.log('--- [Debug Frontend] Nom du fichier pour l\'attribut download:', downloadName);

          setDownloadInfo({
            url: downloadUrl,
            name: downloadName, 
          });

        } else {
          // Si la réponse n'a pas le format attendu
          setError('Le lien de téléchargement n\'a pas pu être généré. Veuillez contacter le support.');
          console.error('Réponse inattendue de l\'API:', response.data);
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
          <p className="text-gray-600 mb-6">Veuillez patienter pendant que nous générons votre lien de téléchargement sécurisé.</p>
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
              <button
                onClick={handleDownloadAndRedirect}
                className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Télécharger le Fichier
              </button>
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


