// backend/controllers/productController.js
const db = require('../config/database');

// Helper pour gérer les erreurs
const handleError = (res, error) => {
  console.error('--- DATABASE ERROR ---', error);
  res.status(500).json({ error: error.message });
};

// Helper pour construire une URL absolue de manière robuste
const buildAbsoluteUrl = (req, relativeUrl) => {
  // Si l'URL est nulle ou déjà absolue, ne rien faire
  if (!relativeUrl || relativeUrl.startsWith('http')) {
    return relativeUrl;
  }
  // Utiliser 'x-forwarded-proto' pour détecter le protocole original derrière un proxy comme Render
  // et forcer https en production sur Render
  const protocol = req.headers['x-forwarded-proto'] === 'https' || req.get('host').includes('onrender.com') ? 'https' : req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}${relativeUrl}`;
};


// For public view
exports.getAllProducts = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE active = true');
    const productsWithFullUrls = rows.map(product => {
      return { 
        ...product, 
        image_url: buildAbsoluteUrl(req, product.image_url) 
      };
    });
    res.json(productsWithFullUrls);
  } catch (error) {
    handleError(res, error);
  }
};

// For admin view
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products');
    const productsWithFullUrls = rows.map(product => {
      return { 
        ...product, 
        image_url: buildAbsoluteUrl(req, product.image_url) 
      };
    });
    res.json(productsWithFullUrls);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const productResult = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (productResult.rowCount === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    const product = productResult.rows[0];

    // Convertir l'URL de l'image principale du produit
    product.image_url = buildAbsoluteUrl(req, product.image_url);

    const imagesResult = await db.query('SELECT * FROM product_images WHERE product_id = $1', [id]);
    
    // Convertir les URLs des images de la galerie
    product.images = imagesResult.rows.map(img => {
      return {
        ...img,
        image_url: buildAbsoluteUrl(req, img.image_url)
      };
    });
    
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, quantity } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: 'Image du produit requise' });
  }
  const image_url = '/uploads/' + req.file.filename;
  const query = 'INSERT INTO products (name, description, price, quantity, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id';
  
  try {
    const { rows } = await db.query(query, [name, description, price, quantity, image_url]);
    res.status(201).json({ id: rows[0].id, ...req.body, image_url });
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  
  try {
    let query;
    let queryParams;

    if (req.file) {
      const image_url = '/uploads/' + req.file.filename;
      query = 'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4, image_url = $5 WHERE id = $6';
      queryParams = [name, description, price, quantity, image_url, id];
    } else {
      query = 'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5';
      queryParams = [name, description, price, quantity, id];
    }

    const result = await db.query(query, queryParams);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ id, ...req.body });
  } catch (error) {
    handleError(res, error);
  }
};

// Soft delete
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('UPDATE products SET active = false WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    handleError(res, error);
  }
};

exports.uploadProductImages = async (req, res) => {
    const { id: productId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'Aucun fichier téléversé' });
    }
    
    try {
        let insertedCount = 0;
        for (const file of files) {
            const imageUrl = '/uploads/' + file.filename;
            const query = 'INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)';
            const result = await db.query(query, [productId, imageUrl]);
            insertedCount += result.rowCount;
        }
        res.status(201).json({ message: 'Images téléversées avec succès', count: insertedCount });
    } catch (error) {
        handleError(res, error);
    }
};
