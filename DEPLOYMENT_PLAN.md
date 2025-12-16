# Plan de Déploiement - Test de l'envoi d'e-mails

**Date :** 15 Décembre 2025

## 1. Contexte du Projet

- **Application :** Site e-commerce `canva-store`.
- **Frontend :** React, gère l'interface client et le panneau d'administration.
- **Backend :** Node.js avec Express, gère la logique métier, les produits, et les ventes.
- **Base de données :** MySQL.

## 2. Objectif Actuel

L'objectif est de déployer l'application sur des services d'hébergement gratuits afin de tester la fonctionnalité d'envoi d'e-mails, car les tests en local échouent.

## 3. Problème Rencontré

Nous avons finalisé l'implémentation d'un formulaire de contact et d'une interface d'administration pour gérer et répondre aux messages. La réponse est envoyée par e-mail via `Nodemailer`.

- **Erreur :** Lors de l'envoi d'un e-mail depuis l'environnement de développement local, le serveur backend retourne une erreur `500 Internal Server Error`.
- **Cause identifiée :** Le log du backend montre une erreur `queryA ETIMEOUT smtp.gmail.com`. Il s'agit d'un problème de résolution DNS ou d'un blocage réseau sur la machine locale de l'utilisateur, qui empêche le serveur Node.js de contacter les serveurs SMTP de Google. Ce n'est pas une erreur de code ou d'authentification.

## 4. Plan d'Action pour Demain

La prochaine étape est de me guider pour déployer l'application et valider que la fonctionnalité d'envoi d'e-mails marche dans un environnement de production.

- **Étape 1 : Déployer le Backend Node.js**
  - Me guider dans le choix d'un hébergeur gratuit adapté pour Node.js (par exemple, Render).
  - M'aider à préparer le backend pour le déploiement (vérification du `package.json`, ajout d'un script `start`).
  - M'expliquer comment configurer les variables d'environnement sur l'hébergeur (`DATABASE_URL`, `EMAIL_USER`, `EMAIL_PASS`, etc.).

- **Étape 2 : Déployer le Frontend React**
  - Me guider dans le choix d'un hébergeur gratuit pour les sites statiques (par exemple, Netlify ou Vercel).
  - M'expliquer comment configurer la variable d'environnement pour l'URL de l'API backend (`REACT_APP_API_URL` ou similaire).

- **Étape 3 : Tester la fonctionnalité**
  - Une fois les deux parties déployées, utiliser le formulaire de contact sur le site en ligne.
  - Se connecter au panneau d'administration en ligne.
  - Envoyer une réponse au message de test et vérifier si l'e-mail est reçu avec succès.
