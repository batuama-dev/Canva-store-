// frontend/src/api/axios.js
import axios from 'axios';

// --- DEBOGAGE DE L'URL DE L'API ---
console.log('--- Début du débuggage de la configuration Axios ---');
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('process.env.REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

const isProduction = process.env.NODE_ENV === 'production';
const baseURL = isProduction
  ? process.env.REACT_APP_API_URL
  : 'http://localhost:5000';

console.log('isProduction:', isProduction);
console.log('URL de base choisie:', baseURL);
console.log('--- Fin du débuggage ---');
// --- FIN DU DEBOGAGE ---

const instance = axios.create({
  baseURL: baseURL
});

export default instance;
