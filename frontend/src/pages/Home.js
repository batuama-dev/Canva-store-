import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // Import Helmet
import AnimatedText from '../components/common/AnimatedText';
import SocialLinks from '../components/common/SocialLinks';
import AboutSection from '../components/common/AboutSection';
import PacksSection from '../components/common/PacksSection';
import ContactSection from '../components/common/ContactSection';

const Home = () => {
  const textStyle = { textShadow: '2px 2px 8px rgba(0,0,0,0.5)' };
  const textClasses = "text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white";

  const heroTexts = [
    <h1 className={textClasses} style={textStyle}>Designs Professionnels, Impact Immédiat.</h1>,
    <h1 className={textClasses} style={textStyle}>Transformez vos idées en visuels époustouflants.</h1>,
    <h1 className={textClasses} style={textStyle}>Avec nos templates Canva de haute qualité.</h1>,
    <h1 className={textClasses} style={textStyle}>Gagnez du temps. Boostez votre image de marque.</h1>,
    <h1 className={textClasses} style={textStyle}>Prêt à créer ?</h1>
  ];

  return (
    <>
      <Helmet>
        <title>Templyfast - Templates Canva Professionnels, Prêts à l'Emploi pour Entrepreneurs et Graphistes</title>
        <meta name="description" content="Découvrez Templyfast : des templates Canva numériques de haute qualité pour réseaux sociaux, entrepreneurs, et événements. Créez des visuels professionnels rapidement et à moindre coût. Livraison instantanée. Parfait pour PME, freelancers et créateurs de contenu." />
      </Helmet>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 animate-background-pan [background-size:400%_400%] min-h-screen">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 h-full min-h-screen">
          {/* Left column for social links */}
          <div className="hidden md:flex justify-center items-center">
            <SocialLinks />
          </div>

          {/* Right column with content */}
          <div className="flex flex-col justify-center text-left">
            <AnimatedText texts={heroTexts} sentenceDelay={3000} loopDelay={30000} />
            
            <div className="mt-8">
              <Link
                to="/products"
                className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full text-lg shadow-2xl 
                           hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out hover:shadow-blue-500/50"
              >
                Découvrir la collection
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Packs Section */}
      <PacksSection />

      {/* Contact Section */}
      <ContactSection />
    </>
  );
};

export default Home;