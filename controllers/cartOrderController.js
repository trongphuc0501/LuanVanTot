const CartOrder = require('../models/cartOrderModel');

// Create a new cart item
const addToOrder = async (req, res) => {
    try {
      const { count, date, number_table, price, product_name, account_id, product_id } = req.body;
  
      console.log('Request body:', req.body);  // Kiểm tra dữ liệu gửi từ client
  
      // Kiểm tra nếu có món ăn trong giỏ của bàn hiện tại
      let cartItem = await CartOrder.findOne({
        where: { number_table, account_id, product_id }
      });
  
      if (cartItem) {
        // Nếu có, cập nhật số lượng cho món ăn ở bàn hiện tại
        cartItem.count += count;
        await cartItem.save();
      } else {
        // Nếu không có, kiểm tra xem món ăn có trong giỏ của bàn khác không
        const existingCartItem = await CartOrder.findOne({
          where: { account_id, product_id }
        });
  
        if (existingCartItem && existingCartItem.number_table !== number_table) {
          // Nếu món ăn đã tồn tại nhưng thuộc bàn khác, tạo bản ghi mới cho bàn hiện tại
          await CartOrder.create({
            count,
            date,
            number_table,
            price,
            product_name,
            account_id,
            product_id
          });
        } else if (!existingCartItem) {
          // Nếu món ăn chưa có ở bất kỳ bàn nào, tạo bản ghi mới
          await CartOrder.create({
            count,
            date,
            number_table,
            price,
            product_name,
            account_id,
            product_id
          });
        }
      }
  
      // Lấy giỏ hàng đã được cập nhật cho account_id
      const updatedCart = await CartOrder.findAll({
        where: { account_id }
      });
  
      console.log('Updated cart:', updatedCart);
  
      // Trả về giỏ hàng đã được cập nhật
      res.status(200).json(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Error adding to cart' });
    }
  };
  

const getAllOrder = async (req, res) => {
  try {
    const cart = await CartOrder.findAll();
    res.json(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get cart it by user ID
const getOrderItemsByUserId = async (req, res) => {
    try {
      const { id } = req.params;
      const cartItems = await CartOrder.findAll({  // Thay Cart thành CartOrder
        where: { account_id: id } 
      });
      res.status(200).json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: 'Error fetching cart items' });
    }
  };
  const getOrderItemsByTableNumber = async (req, res) => {
    try {
      const { tableNumber } = req.params;  // Giả sử bạn truyền số bàn qua URL
      const cartItems = await CartOrder.findAll({
        where: { number_table: tableNumber }  // Lọc giỏ hàng theo số bàn
      });
      
      if (cartItems.length === 0) {
        return res.status(404).json({ message: 'No items found for this table' });
      }
  
      res.status(200).json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: 'Error fetching cart items' });
    }
  };
  
// Remove a cart item by ID
const removeFromOrder = async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const { number_table } = req.body;  // Lấy số bàn từ body request
  
      // Tìm món ăn trong giỏ hàng của bàn tương ứng
      const item = await CartOrder.findOne({
        where: {
          id: cartItemId,         // Mã món ăn cần xóa
          number_table: number_table,  // Số bàn cần kiểm tra
        },
      });
  
      if (!item) {
        return res.status(404).json({ error: 'Cart item not found for this table' });
      }
  
      // Xóa món ăn khỏi giỏ hàng
      await item.destroy();
  
      res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ error: 'Error removing item from cart' });
    }
  };
  
const removeAllFromOrder = async (req, res) => {
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
const updateOrderItem = async (req, res) => {
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
  getAllOrder,
  addToOrder,
  getOrderItemsByUserId,
  removeFromOrder,
  updateOrderItem,
  removeAllFromOrder,
  getOrderItemsByTableNumber
};
