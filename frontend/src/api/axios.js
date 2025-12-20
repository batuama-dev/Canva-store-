// frontend/src/api/axios.js
import axios from 'axios';

let apiBaseUrl;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  apiBaseUrl = 'http://localhost:5000';
} else {
  // Use the Netlify environment variable for deployed versions
  apiBaseUrl = process.env.REACT_APP_API_URL || 'https://canva-store.onrender.com';
}

const instance = axios.create({
  baseURL: apiBaseUrl
});

export default instance;
