import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // This endpoint doesn't exist yet, we will create it.
      const response = await axios.post('/api/auth/login', { username, password });
      
      // Assuming the backend returns a token or some session info.
      // For simplicity, we'll just handle success/failure.
      // In a real app, you'd save a token to localStorage/sessionStorage.
      
      if (response.data.success) {
        // A simple flag to indicate login. A real app would use JWT/context.
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
      }
    } catch (err) {
      setError('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Admin Connexion
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="text-sm font-bold text-gray-600 block"
            >
              Nom d'utilisateur
            </label>
            <input 
              id="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="text-sm font-bold text-gray-600 block"
            >
              Mot de passe
            </label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <button 
            type="submit" 
            className="w-full py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
