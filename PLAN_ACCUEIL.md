# Plan de Refonte de la Page d'Accueil

Basé sur `Modele.html`, voici les étapes pour recréer la page d'accueil (`Home.js`) avec React et Tailwind CSS.

- [x] **Étape 1 : Section "Hero"**
    - Créer un composant pour la section principale.
    - Intégrer un titre percutant, un sous-titre et un bouton d'appel à l'action (ex: "Voir les templates").
    - Utiliser une image de fond ou une illustration attrayante.

- [ ] **Étape 2 : Section "Produits Mis en Avant" (Featured Products)**
    - Créer une section pour afficher une sélection de produits.
    - S'inspirer de la "Product Section" du modèle.
    - Récupérer les produits marqués comme `is_featured` depuis le backend.
    - Afficher 3-4 produits en utilisant le composant `ProductCard.js` existant.

- [x] **Étape 3 : Section "À Propos" (Adaptée)**
    - Créer une brève section présentant la boutique.
    - S'inspirer de la "About Section" pour le style (image + texte).
    - Mettre l'accent sur la qualité des templates Canva et l'avantage pour le client.

- [ ] **Étape 4 : Section "Catégories"**
    - Créer une section qui affiche les différentes catégories de produits (Instagram, Facebook, Business, etc.).
    - Cela peut être une grille de cartes cliquables qui redirigent vers la page des produits filtrés par catégorie.
    - Cette section n'existe pas dans le modèle mais est cruciale pour l'e-commerce.

- [ ] **Étape 5 : Intégration et Nettoyage**
    - Assembler toutes les sections dans la page `Home.js`.
    - Assurer la cohérence du style (polices, couleurs, espacements) avec le reste de l'application.
    - Vérifier la responsivité sur mobile et tablette.
    - Mettre à jour le `Footer.js` et `Header.js` si nécessaire pour correspondre au nouveau design.
