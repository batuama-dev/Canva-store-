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
      axios.get(`/api/download/${token}`)
        .then(response => {
          setMessage('Votre téléchargement devrait commencer automatiquement. Si ce n\'est pas le cas, veuillez cliquer ici.');
          // Logic to actually trigger download will go here.
          // For now, just a message.
        })
        .catch(err => {
          setError(true);
          setMessage('Lien de téléchargement invalide ou expiré.');
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
