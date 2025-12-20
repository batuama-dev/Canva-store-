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

## 3. Problème d'Initialisation de la Base de Données

*   **Statut :** **TERMINÉ** ✅
*   **Analyse :** L'initialisation de la base de données via `psql` a fonctionné. Les tables sont créées. Le code a ensuite été corrigé pour résoudre des problèmes de "Mixed Content" et des vulnérabilités SQL, puis a été commité et poussé.
*   **Résultat :** Le backend se déploie avec le dernier commit, mais de nouveaux problèmes apparaissent.

---

## 4. Problème Actuel : Disparition des Images et Erreurs d'Affichage

**Dernière mise à jour :** 19 Décembre 2025

*   **Symptômes :**
    1.  Après un déploiement, la plupart des images des produits ne s'affichent pas (erreur `404 Not Found`).
    2.  Certaines images provoquent des erreurs de type `net::ERR_NAME_NOT_RESOLVED` à cause d'une URL malformée (`https://...http//...`).
    3.  L'image de la section "À propos" est également manquante.

*   **Analyse du Problème :**
    *   **Cause Principale (Erreurs 404) : Système de fichiers éphémère de Render.**
        *   Le service backend de Render utilise un stockage "éphémère". Cela signifie qu'à chaque redéploiement, tout le contenu du disque est effacé, y compris le dossier `backend/uploads` où les images sont sauvegardées. Les images uploadées sont donc perdues.

    *   **Cause Secondaire (URL malformées) :**
        *   Ce problème a été corrigé dans le dernier commit (`cce35c9`) en rendant la logique de construction d'URL plus robuste pour gérer les URLs déjà présentes en base de données et les problèmes de `http`/`https`.

*   **Solution Adoptée et Résultats :**

    ### Étape 1 : Gestion du Stockage d'Images (Cloudinary)

    *   **Statut :** **TERMINÉ** ✅
    *   **Action :** L'utilisation d'un Disque Persistent sur Render s'étant avérée une option payante, une solution alternative a été implémentée. Le projet a été intégré avec **Cloudinary** pour le stockage et la gestion des images. Toutes les images sont désormais uploadées vers Cloudinary et servies depuis cette plateforme, assurant leur persistance au-delà des déploiements.

    ### Étape 2 : Correction de l'image de la section "À propos"

    *   **Statut :** **TERMINÉ** ✅
    *   **Action :** Le chemin de l'image dans le composant `frontend/src/components/common/AboutSection.js` a été corrigé.

