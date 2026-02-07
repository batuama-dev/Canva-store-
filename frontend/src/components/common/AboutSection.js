import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center -mx-4">
          {/* Image Column */}
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            <img 
              src="/Apropos_temply.jpeg" 
              className="w-full h-auto max-h-96 rounded-2xl shadow-lg" 
              alt="About Us" 
            />
          </div>

          {/* Text Content Column */}
          <div className="w-full lg:w-1/2 px-4 mt-8 lg:mt-0">
            <div className="about-thumb">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Templyfast</h3>
              <p className="text-gray-600 mb-4 text-justify">
                Vous passez trop de temps à chercher l’inspiration avant de commencer un design ?
                Vous avez déjà perdu un client ou livré en retard faute de visuels prêts à temps ?
                Vous aimeriez créer des designs professionnels sans repartir de zéro à chaque projet ?
              </p>
              <p className="text-gray-600 mb-4 text-justify">
                Templyfast est né pour répondre à ces problèmes.
              </p>
              <p className="text-gray-600 mb-4 text-justify">
                Nous sommes une plateforme congolaise dédiée à la vente de templates Canva professionnels, pensés pour les réalités, les activités et le style du marché africain. Que vous soyez graphiste, entrepreneur, community manager ou débutant motivé, Templyfast vous permet de produire plus vite, mieux et de manière rentable.
              </p>
              <p className="text-gray-600 mb-4 text-justify">
                Pourquoi continuer à tout concevoir manuellement, alors que des modèles professionnels peuvent déjà vous faire gagner des heures de travail ?
                Pourquoi laisser passer des opportunités, simplement par manque d’inspiration ou de temps ?
              </p>
              <p className="text-gray-600 mb-4 text-justify">
                Avec Templyfast, vous accédez à des packs de templates prêts à l’emploi, faciles à personnaliser sur Canva. En quelques minutes, vous transformez une idée en un visuel percutant, sans stress et sans blocage créatif.
              </p>
              <p className="text-gray-600 mb-4 text-justify">
                Notre engagement est clair :
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>✔️ Vous faire gagner du temps</li>
                <li>✔️ Vous aider à augmenter votre productivité</li>
                <li><li>✔️ Vous permettre d’accéder à du design professionnel à moindre coût</li>
              </ul>
              <p className="text-gray-600 text-justify">
                Nous misons sur la qualité, l’innovation et surtout la simplicité : paiement local adapté à la RDC, livraison quasi instantanée par email, et designs alignés avec les tendances actuelles.
              </p>
              <p className="text-gray-600 text-justify">
                Templyfast, ce n’est pas seulement des templates.
                C’est une solution pour ceux qui refusent de perdre du temps, de l’argent et des opportunités à cause du design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;