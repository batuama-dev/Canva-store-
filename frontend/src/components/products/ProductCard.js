import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/product/${product.id}`} className="block">
        <img 
          src={product.image_url || 'https://via.placeholder.com/400x300.png?text=Template+Preview'} 
          alt={product.name}
          className="w-full h-56 object-cover"
        />
      </Link>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-2 h-10 overflow-hidden">
          {product.description}
        </p>
        <div className="mt-5 flex justify-between items-center">
          <span className="text-2xl font-bold text-indigo-600">
            {product.price}$
          </span>
          <Link 
            to={`/product/${product.id}`}
            className="bg-indigo-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-600 transition-colors shadow-sm hover:shadow-md"
          >
            Voir un aperçu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;