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

*   **Statut :** **EN COURS** ⏳
*   **Action :** Suivre les instructions pour mettre à jour les variables d'environnement du **service backend** sur Render :
    *   `DATABASE_URL` : L'URL de connexion interne de la nouvelle base de données PostgreSQL.
    *   `EMAIL_USER` et `EMAIL_PASS` : Les identifiants pour l'envoi d'e-mails.
    *   `NODE_ENV` : Mettre la valeur `production`.

### Étape 4 : Déployer les Changements

*   **Statut :** En attente (dépend de l'Étape 3)
*   **Action :** "Commit" et "Push" de toutes les modifications du code (passage à PostgreSQL) vers GitHub. Cela déclenchera un nouveau déploiement sur Render, qui devrait cette fois-ci réussir.
