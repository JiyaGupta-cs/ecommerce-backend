const express = require('express');
const shopController = require('../controllers/shopController');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/user');
const cartController = require('../controllers/cartController');
const router=express.Router();

router.get('/products/:id',shopController.getProduct)
router.get('/products', shopController.getAllProducts);

// Personal => Needs Auth
router.post('/orders', verifyToken, orderController.createOrder); // Create a new order
router.get('/orders',verifyToken, orderController.getOrdersByBuyer); // Get orders by buyer

router.post('/cart', verifyToken, cartController.addToCart);
router.get('/cart', verifyToken, cartController.viewCart);

router.get('/products/category/:categoryName', shopController.getAllProductsByCategory);

router.get('/categories', shopController.fetchCategories);


module.exports = router;