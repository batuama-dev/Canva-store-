// frontend/src/pages/Download.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

const Download = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Vérification de votre lien de téléchargement...');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      axios.get(`/api/sales/download/${token}`)
        .then(response => {
          if (response.data && response.data.download_link) {
            setMessage('Téléchargement initié. Vous allez être redirigé...');
            // Redirect to the actual download link to trigger the download
            window.location.href = response.data.download_link;
          } else {
            setError(true);
            setMessage('Le lien de téléchargement n\'a pas pu être récupéré.');
          }
        })
        .catch(err => {
          setError(true);
          const errorMessage = err.response?.data?.error || 'Lien de téléchargement invalide ou expiré.';
          setMessage(errorMessage);
        });
    } else {
      setError(true);
      setMessage('Aucun jeton de téléchargement fourni.');
    }
  }, [token]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">{error ? 'Erreur de téléchargement' : 'Téléchargement en cours'}</h1>
      <p className={`text-lg ${error ? 'text-red-500' : 'text-gray-700'}`}>
        {message}
      </p>
    </div>
  );
};

export default Download;
