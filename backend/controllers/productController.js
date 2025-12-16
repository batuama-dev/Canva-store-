// backend/controllers/productController.js
const db = require('../config/database');

// For public view
exports.getAllProducts = (req, res) => {
  db.query('SELECT * FROM products WHERE active = 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// For admin view
exports.getAllProductsAdmin = (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getProductById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, productResult) => {
    if (err) return res.status(500).json({ error: err.message });
    if (productResult.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const product = productResult[0];

    db.query('SELECT * FROM product_images WHERE product_id = ?', [id], (err, imagesResult) => {
      if (err) return res.status(500).json({ error: err.message });
      
      product.images = imagesResult;
      res.json(product);
    });
  });
};

exports.createProduct = (req, res) => {
  console.log('--- Entering createProduct ---');
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);

  const { name, description, price, quantity } = req.body;
  if (!req.file) {
    console.log('Error: No file uploaded.');
    return res.status(400).json({ error: 'Image du produit requise' });
  }
  const image_url = '/uploads/' + req.file.filename;
  const query = 'INSERT INTO products (name, description, price, quantity, image_url) VALUES (?, ?, ?, ?, ?)';
  
  console.log('Executing Query:', query);
  
  db.query(query, [name, description, price, quantity, image_url], (err, result) => {
    if (err) {
      console.error('--- DATABASE ERROR ---');
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    console.log('--- Product Created Successfully ---');
    console.log('Result:', result);
    res.status(201).json({ id: result.insertId, ...req.body, image_url });
  });
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  
  let query;
  let queryParams;

  if (req.file) {
    const image_url = '/uploads/' + req.file.filename;
    query = 'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, image_url = ? WHERE id = ?';
    queryParams = [name, description, price, quantity, image_url, id];
  } else {
    query = 'UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?';
    queryParams = [name, description, price, quantity, id];
  }

  db.query(query, queryParams, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ id, ...req.body });
  });
};

// Soft delete
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query('UPDATE products SET active = 0 WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(204).send(); // No content
  });
};

exports.uploadProductImages = (req, res) => {
  const { id } = req.params;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'Aucun fichier téléversé' });
  }

  const images = files.map(file => [id, '/uploads/' + file.filename]);
  const query = 'INSERT INTO product_images (product_id, image_url) VALUES ?';

  db.query(query, [images], (err, result) => {
    if (err) {
      console.error('DATABASE ERROR:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Images téléversées avec succès', count: result.affectedRows });
  });
};