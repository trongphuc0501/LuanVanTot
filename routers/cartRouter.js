const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add to Cart
router.post('/add-to-cart', cartController.addToCart);
router.get('/all', cartController.getAllCart)

// Get Cart Items by User ID
router.get('/cart/:id', cartController.getCartItemsByUserId);

// Remove from Cart
router.delete('/:cartItemId', cartController.removeFromCart);

router.delete('/delete', cartController.removeAllFromCart);

// Update Cart Item
// Trong file routes hoặc router.js
router.put('/update-cart-item/:cartItemId', cartController.updateCartItem);


module.exports = router;
