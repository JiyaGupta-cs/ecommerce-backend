const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.get('/', orderController.getAllOrdersBySeller); // Get all orders

module.exports = router;
