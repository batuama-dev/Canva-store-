import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center -mx-4">
          {/* Image Column */}
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            <img 
              src="/uploads/1765307611187-IMG-20240320-WA0072.jpg" 
              className="w-full h-auto max-h-96 rounded-2xl shadow-lg" 
              alt="About Us" 
            />
          </div>

          {/* Text Content Column */}
          <div className="w-full lg:w-1/2 px-4 mt-8 lg:mt-0">
            <div className="about-thumb">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Wisecom-Store</h3>
              <p className="text-gray-600 mb-4 text-justify">
                Nous sommes ravis de vous présenter Wisecom-Store, votre destination ultime pour des templates Canva de haute qualité.
                Notre mission est de vous offrir des designs élégants et professionnels pour tous vos besoins créatifs,
                que vous soyez un entrepreneur, un marketeur ou un particulier.
              </p>
              <p className="text-gray-600 mb-4 text-justify">
                Transformez vos idées en visuels percutants avec notre collection exclusive.
                Chaque template est conçu pour être facilement personnalisable, vous permettant de gagner du temps
                tout en produisant des créations uniques et mémorables.
              </p>
              <p className="text-gray-600 text-justify">
                <span className="font-semibold">Qualité et Innovation :</span> Nous nous engageons à fournir des produits qui allient esthétique et fonctionnalité,
                en restant toujours à l'affût des dernières tendances en matière de design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;