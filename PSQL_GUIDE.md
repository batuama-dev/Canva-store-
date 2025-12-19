# Guide d'utilisation de psql pour canva-store

Ce guide vous expliquera comment vous connecter à votre base de données PostgreSQL sur Render via l'outil en ligne de commande `psql` et comment exécuter des scripts SQL.

## 1. Prérequis

Assurez-vous d'avoir installé les "Command Line Tools" de PostgreSQL. Si ce n'est pas déjà fait, vous pouvez les télécharger depuis le site officiel de PostgreSQL ou via l'installateur de PostgreSQL pour Windows.

## 2. Se connecter à la base de données Render via psql

Pour se connecter à votre base de données distante, il est recommandé d'utiliser l'URL de connexion complète.

1.  **Récupérez votre "External Database URL" :**
    *   Connectez-vous à votre tableau de bord Render.
    *   Naviguez vers votre service de base de données PostgreSQL (par exemple, `canva-store-db`).
    *   Recherchez la section "Connection Details" et copiez l'`External Database URL` complète. Elle ressemble à ceci :
        `postgresql://canva_store_db_user:YOUR_PASSWORD@dpg-d51dk7l6ubrc73didosg-a.virginia-postgres.render.com/canva_store_db`

2.  **Ouvrez votre Terminal (CMD ou PowerShell) :**

3.  **Naviguez vers le répertoire de `psql` :**
    L'exécutable `psql.exe` se trouve généralement dans le dossier `bin` de votre installation PostgreSQL.
    ```bash
    cd "C:\Program Files\PostgreSQL\18\bin"
    # ou le chemin de votre installation
    ```

4.  **Connectez-vous à la base de données :**
    Utilisez la commande `psql` suivie de l'URL complète que vous avez copiée. Assurez-vous d'entourer l'URL de guillemets doubles.
    ```bash
    .\psql "YOUR_EXTERNAL_DATABASE_URL_COMPLÈTE_ICI"
    # Exemple :
    # .\psql "postgresql://canva_store_db_user:CXLqKbnGnPRQTHVhDNXYqtBs2VIOLU2o@dpg-d51dk7l6ubrc73didosg-a.virginia-postgres.render.com/canva_store_db"
    ```
    Si la connexion est réussie, vous verrez un message `SSL connection (...)` et l'invite changera pour `canva_store_db=>`.

## 3. Exécuter un script SQL

Une fois connecté, vous pouvez exécuter un script SQL (comme `schema.pgsql`) en utilisant la commande `\i`.

```bash
canva_store_db=> \i 'C:/Users/user/OneDrive/Documents/canva-store/database/schema.pgsql'
# Assurez-vous que le chemin du fichier est correct et utilisez des slashs (/)
```

## 4. Commandes psql utiles

Voici quelques commandes internes de `psql` que vous trouverez utiles :

*   `\q` : Quitter la session `psql`.
*   `\dt` : Lister toutes les tables de la base de données actuelle.
*   `\d [nom_de_table]` : Décrire la structure d'une table spécifique (colonnes, types, index).
    *   Exemple : `\d products`
*   `\l` : Lister toutes les bases de données disponibles sur le serveur.
*   `\c [nom_de_base_de_données]` : Se connecter à une autre base de données sur le même serveur.
*   `\dn` : Lister les schémas.
*   `\df` : Lister les fonctions.
*   `\dv` : Lister les vues.
*   `SELECT * FROM [nom_de_table];` : Exécuter une requête SQL standard (n'oubliez pas le point-virgule).
    *   Exemple : `SELECT * FROM products;`

## 5. Exemple de workflow pour l'exécution d'un script

1.  Ouvrir le terminal et `cd` vers le répertoire `bin` de PostgreSQL.
2.  Connectez-vous avec l'URL externe complète.
    ```bash
    .\psql "YOUR_EXTERNAL_DATABASE_URL"
    ```
3.  Exécutez votre script SQL.
    ```bash
    canva_store_db=> \i 'C:/Users/user/OneDrive/Documents/canva-store/database/schema.pgsql'
    ```
4.  Vérifiez les tables.
    ```bash
    canva_store_db=> \dt
    ```
5.  Quittez `psql`.
    ```bash
    canva_store_db=> \q
    ```
