const express = require('express');
const router = express.Router();
const orderController = require('../controllers/cartOrderController');

// Add to Cart
router.post('/add-to-cart', orderController.addToOrder);
router.get('/all', orderController.getAllOrder)

// Get Cart Items by User ID
router.get('/cart/:id', orderController.getOrderItemsByUserId);
router.get('/table/:tableNumber', orderController.getOrderItemsByTableNumber);

// Remove from Cart
router.delete('/id_table/:cartItemId', orderController.removeFromOrder);

router.delete('/delete', orderController.removeAllFromOrder);

// Update Cart Item
// Trong file routes hoặc router.js
router.put('/update-cart-item/:cartItemId', orderController.updateOrderItem);


module.exports = router;