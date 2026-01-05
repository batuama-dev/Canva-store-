// backend/controllers/productController.js
const db = require('../config/database');

// Helper pour gérer les erreurs
const handleError = (res, error) => {
  console.error('--- DATABASE ERROR ---', error);
  res.status(500).json({ error: error.message });
};




// For public view
exports.getAllProducts = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE active = true');
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

// For admin view
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products');
    res.json(rows);
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

    const imagesResult = await db.query('SELECT * FROM product_images WHERE product_id = $1', [id]);
    
    product.images = imagesResult.rows;
    
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, quantity, category, product_links } = req.body;
  
  // With upload.fields, files are in req.files
  const imageFile = req.files && req.files.image ? req.files.image[0] : null;
  const pdfFile = req.files && req.files.pdfFile ? req.files.pdfFile[0] : null;

  if (!imageFile) {
    return res.status(400).json({ error: 'Image principale du produit requise.' });
  }

  const image_url = imageFile.path; // URL from Cloudinary for the image
  const file_url = pdfFile ? pdfFile.path : null; // URL from Cloudinary for the PDF

  const query = `
    INSERT INTO products (name, description, price, quantity, category, image_url, file_url, product_links) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING id
  `;
  
  try {
    const { rows } = await db.query(query, [name, description, price, quantity, category, image_url, file_url, product_links]);
    res.status(201).json({ id: rows[0].id, ...req.body, image_url, file_url, product_links });
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category, product_links } = req.body;
  
  try {
    const imageFile = req.files && req.files.image ? req.files.image[0] : null;
    const pdfFile = req.files && req.files.pdfFile ? req.files.pdfFile[0] : null;

    let updateFields = [
      { name: 'name', value: name },
      { name: 'description', value: description },
      { name: 'price', value: price },
      { name: 'quantity', value: quantity },
      { name: 'category', value: category },
      { name: 'product_links', value: product_links }
    ];

    if (imageFile) {
      updateFields.push({ name: 'image_url', value: imageFile.path });
    }
    if (pdfFile) {
      updateFields.push({ name: 'file_url', value: pdfFile.path });
    }

    const setClause = updateFields.map((field, index) => `${field.name} = $${index + 1}`).join(', ');
    const queryParams = updateFields.map(field => field.value);
    queryParams.push(id); // Add the id for the WHERE clause

    const query = `UPDATE products SET ${setClause} WHERE id = $${queryParams.length}`;
    
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
            const imageUrl = file.path; // URL from Cloudinary
            const query = 'INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)';
            const result = await db.query(query, [productId, imageUrl]);
            insertedCount += result.rowCount;
        }
        res.status(201).json({ message: 'Images téléversées avec succès', count: insertedCount });
    } catch (error) {
        handleError(res, error);
    }
};
