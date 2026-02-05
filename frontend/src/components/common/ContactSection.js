import React, { useState } from 'react';
import axios from '../../api/axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
// import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const packs = [
  'Pack Graphiste Pro',
  'Pack Réseaux sociaux',
  'Pack Entrepreneurs',
  'Pack Événements',
];

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    axios.post('/api/messages', formData)
      .then(response => {
        setStatus({ loading: false, error: null, success: 'Message envoyé avec succès ! Nous vous répondrons bientôt.' });
        setFormData({ name: '', email: '', message: '' }); // Reset form
      })
      .catch(error => {
        const errorMsg = error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.';
        setStatus({ loading: false, error: errorMsg, success: null });
      });
  };

  return (
    <section className="bg-white py-20" id="contact">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Contactez-nous</h2>
          <p className="text-gray-600 mt-2">Une question, un projet ? Nous sommes à votre écoute.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Info */}
          <div className="lg:col-span-5 bg-gray-50 p-8 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Nos Coordonnées</h3>
            <div className="mb-6">
              <strong className="text-blue-600 font-semibold">Objectif</strong>
              <p className="text-gray-600 mt-1">
                Fournir des templates Canva de haute qualité pour accélérer votre créativité et professionnaliser votre image de marque.
              </p>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-4" />
                <a href="mailto:templyfast@gmail.com" className="text-gray-700 hover:text-blue-600">templyfast@gmail.com</a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blue-600 mr-4" />
                <a href="tel:+243972880849" className="text-gray-700 hover:text-blue-600">+243 972880849</a>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-4" />
                <span className="text-gray-700">Kinshasa RDC</span>
              </div>
            </div>
            <div>
              <strong className="text-blue-600 font-semibold mb-3 block">Nos Packs</strong>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {packs.map(pack => <li key={pack}>{pack}</li>)}
              </ul>
            </div>
            <div className="mt-8">
              <strong className="text-blue-600 font-semibold mb-4 block">Suivez-nous</strong>
              <div className="flex space-x-4">
                <a href="https://web.facebook.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl hover:bg-blue-600 hover:text-white transition-all duration-300">FB</a>
                <a href="https://wa.me/243972880849" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl hover:bg-blue-600 hover:text-white transition-all duration-300">WA</a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl hover:bg-blue-600 hover:text-white transition-all duration-300">IG</a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-gray-50 p-8 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Envoyer un message</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors" placeholder="Votre nom complet" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors" placeholder="votre.email@example.com" required />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" rows="5" value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
              </div>
              <div>
                <button type="submit" disabled={status.loading} className="w-full bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center disabled:bg-blue-400">
                  {status.loading ? 'Envoi en cours...' : 'Envoyer le message'}
                  {!status.loading && <Send className="w-5 h-5 ml-3" />}
                </button>
              </div>
              {status.success && <p className="text-green-600 mt-4 text-center">{status.success}</p>}
              {status.error && <p className="text-red-600 mt-4 text-center">{status.error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
