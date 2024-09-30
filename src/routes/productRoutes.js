const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/', productController.createProduct); // Create a new product
router.get('/', productController.getAllMyProducts); // Get all products
router.put('/:id', productController.updateProduct); // Update a product
router.delete('/:id', productController.deleteProduct); // Delete a product
router.get('/:id', productController.getMyProduct);



module.exports = router;
