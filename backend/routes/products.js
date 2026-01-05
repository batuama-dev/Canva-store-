// backend/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../config/cloudinary');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes
// In a real app, these would be protected by an auth middleware
router.get('/admin/all', productController.getAllProductsAdmin);
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), productController.createProduct);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/images', upload.array('images', 5), productController.uploadProductImages);

module.exports = router;
