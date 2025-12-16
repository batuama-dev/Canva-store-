import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Share2, Award } from 'lucide-react'; // Placeholder icons

const packs = [
  {
    title: 'Pack Graphiste Pro',
    price: '50$',
    description: 'Une collection complète pour les créatifs : flyers, affiches, promotions, food, et plus.',
    details: '20 templates',
    icon: <Award size={80} className="text-blue-100" />,
  },
  {
    title: 'Pack Réseaux sociaux',
    price: '20$',
    description: 'Boostez votre présence en ligne avec des templates optimisés pour l\'engagement.',
    details: '8 templates',
    icon: <Share2 size={80} className="text-blue-100" />,
  },
  {
    title: 'Pack Entrepreneurs',
    price: '15$',
    description: 'Idéal pour démarrer votre activité avec des designs professionnels et percutants.',
    details: '8 templates',
    icon: <Briefcase size={80} className="text-blue-100" />,
  },
  {
    title: 'Pack Événements',
    price: '10$',
    description: 'Promouvez vos occasions spéciales avec des visuels captivants et mémorables.',
    details: '8 templates',
    icon: <Calendar size={80} className="text-blue-100" />,
  },
];

const PacksSection = () => {
  return (
    <section className="py-20 bg-gray-50" id="packs">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Nos Packs de Templates</h2>
          <p className="text-gray-600 mt-2">
            Des collections conçues pour répondre à chaque besoin avec professionnalisme et créativité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {packs.map((pack, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
              <div className="absolute -right-8 -bottom-8 opacity-50">
                {pack.icon}
              </div>
              
              <div className="flex justify-between items-start border-b-2 border-gray-100 pb-4 mb-4">
                <h3 className="text-2xl font-bold text-gray-800">{pack.title}</h3>
                <div className="text-2xl font-bold text-blue-600 bg-blue-100 py-1 px-4 rounded-full">
                  {pack.price}
                </div>
              </div>

              <p className="text-gray-600 mb-4 min-h-[4rem]">{pack.description}</p>
              
              <div className="font-semibold text-gray-700 mb-6">{pack.details}</div>

              <Link to="/products" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Voir nos packs
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PacksSection;
