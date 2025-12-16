# Refonte du Projet CanvaStore - Phase 2

# Terminal 1 - Backend

cd backend
npm start

# Terminal 2 - Frontend

cd frontend
npm start

# Terminal 3 - MySQL

# Démarrer XAMPP et importer database/schema.sql

## Objectif Utilisateur

L'objectif de cette phase est de transformer l'interface d'administration en une application sécurisée et entièrement distincte de l'interface client. L'administrateur doit s'authentifier pour accéder à un tableau de bord où il peut non seulement visualiser les ventes, mais aussi gérer l'intégralité du catalogue de produits (templates Canva).

## Plan d'Action - Phase 2

- [x] **Étape 1 : Sécurisation de l'accès Admin**

  - [x] Créer une page de connexion (`LoginPage.js`) pour l'administration.
  - [x] Mettre en place un système d'authentification simple côté backend (ex: avec un utilisateur/mot de passe codé en dur pour commencer).
  - [x] Créer une route backend `/api/auth/login` pour gérer la connexion.
  - [x] Mettre en place la logique de "route protégée" côté frontend pour que seul un admin connecté puisse accéder à `/admin/*`.
  - [x] Supprimer le lien "Admin" de l'en-tête public (`Header.js`).

- [x] **Étape 2 : Création de la gestion des Produits (CRUD)**

  - [x] Créer une nouvelle page "Gérer les produits" dans l'interface d'administration.
  - [x] Créer les composants UI pour lister, ajouter, et modifier des produits.
  - [x] Créer les nouvelles routes backend pour le CRUD des produits :
    - `POST /api/products` (Créer un produit)
    - `PUT /api/products/:id` (Mettre à jour un produit)
    - `DELETE /api/products/:id` (Supprimer un produit)
  - [x] Mettre à jour les contrôleurs backend (`productController.js`) avec la logique CRUD.

- [x] **Étape 3 : Ajustement du Modèle de Données et de l'Affichage**
  - [x] Mettre à jour la table `products` dans la base de données pour inclure un champ `quantity`.
  - [x] Modifier l'affichage du prix pour qu'il soit en dollars ($) au lieu d'euros (€) sur toute l'application.
  - [x] Ajouter une navigation dans la barre latérale de l'admin pour basculer entre le "Dashboard" et la "Gestion des produits".

## Plan d'Action - Phase 3 : Amélioration de la Page Produit

- [x] **Étape 1 : Création de la galerie d'images**
  - [x] Modifier la page `ProductDetailPage.js` pour y intégrer une galerie d'images.
  - [x] Cette galerie affichera les images d'aperçu (`gallery`) associées à chaque produit.
  - [x] Le backend devra être adapté si nécessaire pour fournir les URLs de ces images via l'API.
  - [x] Le bouton d'achat sera positionné de manière visible mais après que l'utilisateur ait eu la chance de voir les aperçus.
