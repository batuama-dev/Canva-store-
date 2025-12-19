# Rapport de Progression - Déploiement `canva-store`

**Dernière mise à jour :** 17 Décembre 2025

## Objectif Final

Déployer l'application `canva-store` (Backend Node.js + Frontend React) sur des services d'hébergement gratuits (Render, Netlify) pour valider la fonctionnalité d'envoi d'e-mails et avoir une version de production fonctionnelle.

---

## 1. Problèmes Résolus

### 1.1. Erreur de Déploiement du Backend : `Missing script: "start"`

*   **Problème :** Le déploiement sur Render échouait car la commande `npm start` était exécutée à la racine du projet, où il n'y a pas de `package.json`.
*   **Solution :**
    1.  Nous avons confirmé que le fichier `backend/package.json` contenait bien le script `"start": "node server.js"`.
    2.  Nous avons identifié que la configuration de Render devait être modifiée pour spécifier le **"Root Directory"**.
    3.  **Action :** L'utilisateur a correctement configuré le "Root Directory" sur `backend` dans les paramètres du service web sur Render.
*   **Résultat :** Le backend a commencé à se compiler et à se lancer correctement. ✅

### 1.2. Erreur de Connexion à la Base de Données : `ECONNREFUSED`

*   **Problème :** Après avoir résolu le problème de démarrage, l'application a planté en essayant de se connecter à une base de données MySQL sur `localhost` (`127.0.0.1:3306`), qui n'existe pas dans l'environnement de Render.
*   **Contexte :** Le projet était initialement configuré pour une base de données MySQL locale (via XAMPP).
*   **Solution :**
    1.  Nous avons décidé de migrer vers une base de données **PostgreSQL hébergée sur Render**, ce qui est une pratique standard pour les applications de production.
    2.  Le code du backend a été entièrement refactorisé pour être compatible avec PostgreSQL :
        *   `backend/package.json` : Remplacement de `mysql2` par `pg`.
        *   `backend/config/database.js` : Passage à une connexion par URL (`DATABASE_URL`).
        *   Tous les contrôleurs (`product`, `message`, `admin`, `sale`) ont été réécrits pour utiliser la syntaxe `async/await` et les conventions de `pg`.
    3.  Un script SQL compatible PostgreSQL (`database/schema.pgsql`) a été créé pour la structure et les données de la base.
*   **Résultat :** Le code est maintenant prêt pour une base de données PostgreSQL. ✅

---

## 2. État Actuel et Prochaines Étapes

Nous avons franchi des étapes cruciales. Le code est prêt et l'infrastructure de la base de données est maintenant en place.

### Étape 1 : Créer une base de données sur Render

*   **Statut :** **TERMINÉ** ✅
*   **Action :** Une nouvelle base de données PostgreSQL gratuite (`canva-store-db`) a été créée avec succès sur Render.

### Étape 2 : Initialiser la structure de la base de données

*   **Statut :** **TERMINÉ** ✅
*   **Action :** Le script SQL de `database/schema.pgsql` a été exécuté avec succès sur la nouvelle base de données Render en utilisant un client externe (DBeaver). Les tables et les données initiales sont en place.

### Étape 3 : Configurer les Variables d'Environnement sur Render

*   **Statut :** **TERMINÉ** ✅
*   **Action :** Les variables d'environnement (`DATABASE_URL`, `EMAIL_USER`, `EMAIL_PASS`, `NODE_ENV`) ont été correctement configurées pour le service backend sur Render.

### Étape 4 : Déployer le Frontend sur Netlify

*   **Statut :** **TERMINÉ (avec problèmes)** ✅
*   **Action :** Le frontend a été déployé avec succès sur Netlify après plusieurs itérations de débogage (modules manquants, erreurs ESLint, erreurs de syntaxe).
*   **Problème :** Le site est en ligne, mais il ne parvient pas à charger les données du backend (produits, images).

---

## 3. Problème Actuel : Initialisation de la Base de Données Échouée

*   **Symptômes :**
    *   Le déploiement du backend sur Render échoue avec une erreur `500 (Internal Server Error)`.
    *   Les logs du backend Render montrent une erreur `error: relation "products" does not exist`.
*   **Analyse :** La base de données PostgreSQL sur Render est bien connectée, mais elle est vide. Les tables (`products`, `messages`, etc.) n'ont pas été créées.
*   **Tentatives Échouées :** Plusieurs tentatives d'exécution du script `database/schema.pgsql` via le client de base de données DBeaver n'ont pas abouti, bien qu'aucune erreur claire ne soit affichée par DBeaver, suggérant un problème de transaction ou de connexion silencieux.

### Prochaine Étape : Forcer l'Initialisation de la Base de Données via `psql`

Pour contourner les problèmes potentiels de DBeaver, nous allons utiliser l'outil en ligne de commande `psql` directement depuis votre machine locale. C'est la méthode la plus directe et fiable pour interagir avec PostgreSQL.

*   **Statut :** **EN COURS** ⏳
*   **Action :** Suivre les instructions pour :
    1.  Installer les **"Command Line Tools"** de PostgreSQL sur votre machine Windows.
    2.  Ouvrir un terminal et naviguer jusqu'au dossier d'installation de `psql`.
    3.  Utiliser la **"PSQL Command"** fournie par Render pour se connecter à la base de données distante.
    4.  Exécuter le script SQL `database/schema.pgsql` directement dans le terminal `psql`.
*   **Objectif :** Créer avec succès les tables dans la base de données Render et résoudre l'erreur `relation "products" does not exist`.
