# Refonte du Projet CanvaStore

## Objectif Utilisateur

L'objectif est de transformer l'application actuelle en une plateforme de vente de templates Canva qui soit moderne, responsive et professionnelle. L'expérience utilisateur doit être simple et directe, sans nécessité pour le client de créer un compte pour effectuer un achat, à l'image de sites comme ThemeForest ou Amazon.

Il est crucial de séparer l'interface client de l'interface d'administration, qui doit permettre de visualiser les ventes et les statistiques de manière claire.

## Plan d'Action

Voici les étapes planifiées pour cette refonte. Nous mettrons à jour le statut de chaque étape au fur et à mesure de notre progression.

- [x] **Étape 1 : Séparation des Interfaces (Client vs. Admin)**
    - [x] Créer des mises en page distinctes (`ClientLayout` et `AdminLayout`).
    - [x] Configurer le routage pour utiliser la bonne mise en page en fonction de l'URL (`/admin/*` pour l'admin, le reste pour le client).
    - [x] Créer une barre de navigation latérale pour l'interface d'administration.

- [x] **Étape 2 : Amélioration du Design et de l'Expérience Client**
    - [x] Redesigner la page d'accueil pour un look plus moderne.
    - [x] Améliorer le style des cartes de produits (`ProductCard`).
    - [x] Créer le composant `Footer` qui était manquant. (Déjà fait, mais on l'inclut pour la documentation).

- [x] **Étape 3 : Implémentation du Tunnel d'Achat sans Compte**
    - [x] Créer une page de paiement dédiée (`CheckoutPage.js`).
    - [x] Remplacer la modale d'achat par une redirection vers la `CheckoutPage`.
    - [x] Créer un formulaire sur la page de paiement demandant l'e-mail du client.
    - [x] Ajouter une section factice pour l'intégration future du paiement.
    - [x] Créer une page de confirmation de commande post-paiement.

- [x] **Étape 4 : Refonte de l'Interface d'Administration**
    - [x] Transformer la page `/admin` en un tableau de bord (`Dashboard.js`).
    - [x] Intégrer les appels API pour afficher les statistiques de ventes.
    - [x] Intégrer les appels API pour afficher la liste des ventes récentes.

- [x] **Étape 5: Nettoyage et finalisation**
    - [x] Supprimer les composants inutilisés (ex: `PurchaseModal.js`).
    - [x] Vérifier que l'ensemble du parcours est fluide et sans erreur.
