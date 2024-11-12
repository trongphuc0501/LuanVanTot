const Cart = require('../models/cartModel');

// Create a new cart item
const addToCart = async (req, res) => {
  try {
    const { img, date, name, price, count, account_id, product_id } = req.body;

    console.log('Request body:', req.body);

    // Check if the cart item already exists
    let cartItem = await Cart.findOne({
      where: { account_id, product_id }
    });

    if (cartItem) {
      // If item exists, update the count
      cartItem.count += count;
      await cartItem.save();
    } else {
      // If item doesn't exist, create a new one
      cartItem = await Cart.create({
        img,
        date,
        name,
        price,
        count,
        account_id,
        product_id
      });
    }

    // Fetch updated cart items
    const updatedCart = await Cart.findAll({
      where: { account_id }
    });

    console.log('Updated cart:', updatedCart);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Error adding to cart' });
  }
};

const getAllCart = async (req, res) => {
  try {
    const cart = await Cart.findAll();
    res.json(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get cart items by user ID
const getCartItemsByUserId = async (req, res) => {
  try {
    const { id } = req.params; // Thay account_id thành id
    const cartItems = await Cart.findAll({
      where: { account_id : id } // Thay account_id thành id
    });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Error fetching cart items' });
  }
};

// Remove a cart item by ID
const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const cartItem = await Cart.findByPk(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Error removing from cart' });
  }
};
const removeAllFromCart = async (req, res) => {
  try {
    // Xóa toàn bộ các bản ghi trong bảng Cart (payment)
    const result = await Cart.destroy({
      where: {}, // Điều kiện rỗng để xóa toàn bộ bản ghi
      truncate: true // Thêm truncate để xóa và reset auto-increment (nếu có)
    });

    res.status(200).json({ message: 'Đã xóa toàn bộ các sản phẩm khỏi giỏ hàng thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa toàn bộ sản phẩm khỏi giỏ hàng:', error);
    res.status(500).json({ error: 'Lỗi khi xóa toàn bộ sản phẩm khỏi giỏ hàng' });
  }
};



// Update a cart item by ID
const updateCartItem = async (req, res) => {
    try {
      const { cartItemId } = req.params;
      console.log('CartItemId nhận được:', cartItemId); // Kiểm tra giá trị cartItemId
  
      const { count } = req.body;
      let cartItem = await Cart.findByPk(cartItemId);
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
  
      cartItem.count = count;
      await cartItem.save();
      res.status(200).json(cartItem);
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ error: 'Error updating cart item' });
    }
  };
  
module.exports = {
  getAllCart,
  addToCart,
  getCartItemsByUserId,
  removeFromCart,
  updateCartItem,
  removeAllFromCart
};
