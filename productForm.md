📝 Message pour l’IA de codage — Refonte Professionnelle de la Page Administrateur “Ajouter un Pack”

Je développe une plateforme de vente de packs de templates Canva.
Actuellement, j’ai une page d’ajout de produit beaucoup trop basique.
Je veux que tu reconstruises entièrement cette page afin qu’elle corresponde exactement aux besoins d’un vendeur professionnel de templates Canva.

🎯 Objectif

Créer une page Admin → Ajouter / Modifier un Pack qui permet de renseigner toutes les informations nécessaires pour vendre un pack de templates Canva.

L’interface doit être belle, moderne, lisible, responsive, avec Tailwind CSS.
Le code doit être clair, bien organisé, entièrement en React.

📦 Champs à intégrer dans le formulaire (obligatoires)

1. Informations générales

name : Nom du pack

category : Catégorie (Instagram, Facebook, TikTok, Business, Église, etc.)

short_description : Petite description

description : Description longue

2. Prix

price : prix normal

discount_price : prix promo (optionnel)

is_featured : boolean → afficher sur la page d’accueil

3. Images du pack

main_preview : URL de l’image principale

gallery[] : plusieurs URL pour les aperçus (permettre d’en ajouter ou supprimer dynamiquement)

4. Liens Canva

Le pack peut contenir 1 à N templates.
Donc prévoir une gestion dynamique :

canva_links[] : liste de liens comme
https://www.canva.com/design/xxxx/edit

→ permettre d’ajouter et supprimer des entrées.

5. Fichier ZIP (optionnel)

download_file_url : URL d’un fichier .zip contenant :

instructions PDF

images

bonus éventuels

🎨 Exigences de design

La page doit être :

construite en React + Tailwind

centrée dans une carte élégante (max-width: 900px)

chaque section clairement séparée

champs bien espacés

labels lisibles

boutons modernes (coins arrondis, hover, shadow)

message de succès + erreur

loader simple quand on sauvegarde

🧭 Comportement attendu

Si id existe → mode édition (charger les données et pré-remplir)

Sinon → mode ajout

À la validation :

envoyer les données au backend sous forme d'objet JSON complet

empêcher l’envoi si des champs sont invalides

Redirection automatique vers la page /admin/products après succès

📂 Structure JSON que tu dois envoyer au backend
{
"name": "",
"category": "",
"short_description": "",
"description": "",
"price": 0,
"discount_price": 0,
"is_featured": false,

"main_preview": "",
"gallery": [],

"canva_links": [],
"download_file_url": "",

"slug": ""
}

🎁 À produire

Merci de produire :

Le composant React complet (ProductForm.jsx)

La logique pour gérer :

Ajout de lien Canva dynamique

Ajout d’images de galerie dynamique

Boolean "is_featured"

Un design soigné (utiliser Tailwind)

Le code final prêt à être collé dans mon projet

IMPORTANT : Optimise le code, garde-le propre et maintenable.
Tu peux réorganiser ma logique actuelle, améliorer les hooks, ou simplifier la structure si nécessaire.
