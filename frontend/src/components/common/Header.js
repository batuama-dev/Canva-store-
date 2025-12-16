// frontend/src/components/common/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const getNavLinkClass = (path) => {
    return `font-medium ${location.pathname === path ? 'text-blue-600 underline underline-offset-4' : 'text-gray-700 hover:text-blue-600'}`;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600 font-['Orbitron'] whitespace-nowrap">
          Wisecom-Store
        </Link>
        <nav className="flex gap-6">
          <Link to="/" className={getNavLinkClass('/')}>Accueil</Link>
          <Link to="/products" className={getNavLinkClass('/products')}>Produits</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;