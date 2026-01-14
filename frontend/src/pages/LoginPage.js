import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import axios from '../api/axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      
      if (response.data.success) {
        toast.success('Connexion réussie ! Redirection...');
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        // Wait a bit for the toast to be visible before navigating
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        // This case might not be hit if backend sends non-2xx status on failure
        toast.error('Nom d\'utilisateur ou mot de passe incorrect.');
        setIsLoading(false);
      }
    } catch (err) {
      toast.error('Nom d\'utilisateur ou mot de passe incorrect.');
      setIsLoading(false);
    }
    // No finally block needed as loading is set to false in success/error cases
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
            Templyfast
            </h1>
            <p className="mt-2 text-sm text-gray-500">Espace Administrateur</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Nom d'utilisateur
            </label>
            <input 
              id="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Mot de passe
            </label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              autoComplete="current-password"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <ThreeDots 
                height="24" 
                width="24" 
                radius="9"
                color="white" 
                ariaLabel="three-dots-loading"
                visible={true}
              />
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
