-- Schéma PostgreSQL pour canva_store

-- Supprime les tables existantes dans l'ordre inverse des dépendances de clés étrangères
DROP TABLE IF EXISTS sales CASCADE;             -- CASCADE supprime aussi les objets dépendants (contraintes)
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS products CASCADE;


--
-- Structure de la table `products`
--
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  file_url VARCHAR(500),
  category VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  quantity INT NOT NULL DEFAULT 0
);

--
-- Structure de la table `product_images`
--
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_product
    FOREIGN KEY(product_id) 
    REFERENCES products(id)
    ON DELETE CASCADE
);

--
-- Structure de la table `sales`
--
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  product_id INT,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  sale_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  amount DECIMAL(10, 2) NOT NULL,
  download_token VARCHAR(100) UNIQUE,
  download_expires TIMESTAMP WITHOUT TIME ZONE,
  downloads_count INT DEFAULT 0,
  CONSTRAINT fk_product
    FOREIGN KEY(product_id) 
    REFERENCES products(id)
);

--
-- Structure de la table `messages`
-- (Basée sur l'utilisation dans messageController.js)
--
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'read', 'replied'
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

--
-- Déchargement des données de la table `products`
--
INSERT INTO products (id, name, description, price, image_url, category, active, created_at, quantity) VALUES
(1, 'Pack pro affiches d''anniversaire ', 'affiche anniversaries de qualité ', 25.00, '/uploads/1764011244827-63431.jpg', NULL, TRUE, '2025-11-24 19:07:24', 1),
(2, 'Affiche de couverture instagram', 'Valoriser vos photos de couvertures ', 65.00, '/uploads/1764012326683-75290.jpg', NULL, TRUE, '2025-11-24 19:25:26', 1),
(3, 'Affiche de couverture facebook', 'Optez pour des publicitiés optimisés ', 65.00, '/uploads/1764013735498-WhatsApp Image 2024-09-20 Ã  13.25.48_2fe55dde.jpg', NULL, TRUE, '2025-11-24 19:31:56', 1),
(4, 'Affiche de couverture whatssap ', 'Salutation ', 200.00, '/uploads/1764013637329-77546.jpg', NULL, TRUE, '2025-11-24 19:47:17', 1),
(5, 'Affichage de mockup whatssap ', 'La la lal la ', 25.00, '/uploads/1765307611187-IMG-20240320-WA0072.jpg', NULL, TRUE, '2025-12-09 19:13:31', 1);

--
-- Déchargement des données de la table `product_images`
--
INSERT INTO product_images (id, product_id, image_url, alt_text, created_at) VALUES
(1, 5, '/uploads/1765307611430-IMG-20240320-WA0073.jpg', NULL, '2025-12-09 19:13:31'),
(2, 5, '/uploads/1765307611430-IMG-20240320-WA0078.jpg', NULL, '2025-12-09 19:13:31'),
(3, 5, '/uploads/1765307611431-IMG-20240320-WA0070.jpg', NULL, '2025-12-09 19:13:31');

-- Réinitialiser les séquences pour les clés primaires auto-incrémentées après l'insertion
-- Note: Les séquences sont créées par SERIAL. setval est utilisé si des IDs spécifiques sont insérés manuellement.
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_images_id_seq', (SELECT MAX(id) FROM product_images));
SELECT setval('sales_id_seq', (SELECT MAX(id) FROM sales)); -- Ajouté pour sales
SELECT setval('messages_id_seq', (SELECT MAX(id) FROM messages)); -- Ajouté pour messages

-- N'oubliez pas le COMMIT; en fin de script si vous êtes en mode transactionnel
COMMIT;