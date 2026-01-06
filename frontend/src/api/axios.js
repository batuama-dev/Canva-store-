// frontend/src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:5000',
  withCredentials: true // Important pour envoyer les cookies de session
});

export default instance;
