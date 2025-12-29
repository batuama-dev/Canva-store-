import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-300 mb-2">
            &copy; {currentYear} Templyfast. Tous droits réservés.
          </p>
          <p className="text-gray-300 uppercase font-bold">
            Conçu et Développé par <span className="italic">ISRABAT CONCEPT</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;