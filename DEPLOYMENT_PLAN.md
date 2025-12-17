# Plan de Déploiement - Test de l'envoi d'e-mails

**Dernière mise à jour :** 16 Décembre 2025

## 1. Objectif

Déployer l'application `canva-store` (Backend Node.js + Frontend React) sur des services d'hébergement gratuits pour tester la fonctionnalité d'envoi d'e-mails, qui échoue en environnement local à cause d'un problème réseau (`ETIMEOUT`).

---

## 2. Statut Actuel : **En attente de l'action de l'utilisateur**

Le code du projet a été préparé pour le déploiement et versionné avec Git. La prochaine étape consiste pour vous à pousser le code vers GitHub, puis à configurer les services d'hébergement.

---

## 3. Progression et Tâches Réalisées (16/12/2025)

- **✅ Préparation du Backend pour le déploiement :**
  - Fichier `package.json` mis à jour avec un script `start`.
  - Connexion à la base de données (`config/database.js`) modifiée pour utiliser des variables d'environnement (`DB_HOST`, `DB_USER`, etc.).
  - Identification des variables d'environnement nécessaires pour Render.

- **✅ Préparation du Frontend pour le déploiement :**
  - Création d'un module centralisé (`src/api/axios.js`) pour gérer l'URL de l'API.
  - Tous les composants front-end ont été mis à jour pour utiliser ce module.
  - Le `proxy` de `package.json` a été supprimé.
  - La configuration est prête pour utiliser la variable `REACT_APP_API_URL` sur Netlify.

- **✅ Préparation du Dépôt Git :**
  - Initialisation d'un dépôt Git à la racine du projet.
  - Création d'un fichier `.gitignore` pour exclure les `node_modules` et les fichiers `.env`.
  - Résolution du problème de dépôt Git imbriqué (`frontend`).
  - Le code est "commit" et prêt à être poussé vers GitHub.

---

## 4. Prochaines Étapes : À FAIRE PAR VOUS

Suivez ces étapes dans l'ordre. Je suis prêt à vous guider pour chacune d'entre elles.

- **Étape 1 : Publier le code sur GitHub**
  - **Action :** Suivre les instructions que je vous ai données pour :
    1. Créer un nouveau dépôt **public** et vide sur GitHub.
    2. Copier l'URL du dépôt.
    3. Exécuter les commandes `git remote add origin <URL>`, `git branch -M main`, et `git push -u origin main` dans votre terminal.

- **Étape 2 : Déployer le Backend sur Render**
  - **Action :**
    1. Créez un compte sur **Render**.
    2. Créez un **"New Web Service"** et connectez votre dépôt GitHub.
    3. Configurez les paramètres :
        - **Build Command :** `npm install`
        - **Start Command :** `npm start`
    4. Ajoutez les **variables d'environnement** suivantes :
        - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`
        - `EMAIL_USER` (votre adresse Gmail)
        - `EMAIL_PASS` (votre **mot de passe d'application** Gmail)
    5. Lancez le déploiement.

- **Étape 3 : Déployer le Frontend sur Netlify**
  - **Action :**
    1. Créez un compte sur **Netlify**.
    2. Créez un **"New site from Git"** et connectez le même dépôt GitHub.
    3. Configurez les paramètres de build :
        - **Base directory :** `frontend`
        - **Build Command :** `npm run build`
        - **Publish directory :** `frontend/build`
    4. Ajoutez la variable d'environnement :
        - `REACT_APP_API_URL` : L'URL de votre backend Render (ex: `https://votre-app.onrender.com`)

- **Étape 4 : Test Final**
  - **Action :**
    1. Ouvrir l'URL de votre site Netlify.
    2. Envoyer un message via le formulaire de contact.
    3. Vous connecter à l'interface d'administration et répondre au message.
    4. Vérifier la réception de l'e-mail.
