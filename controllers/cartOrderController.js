const CartOrder = require('../models/cartOrderModel');
const OrderStatus = require('../models/statusModel');
const sequelize = require('../config/database');

// Create a new cart item
const addToOrder = async (req, res) => {
    try {
        const { count, date, number_table, price, product_name, account_id, product_id } = req.body;

        // Kiểm tra nếu có món ăn trong giỏ của bàn hiện tại
        let cartItem = await CartOrder.findOne({
            where: { number_table, account_id, product_id },
        });

        if (cartItem) {
            // Nếu món đã tồn tại, cập nhật số lượng và tính lại tổng giá
            cartItem.count += count; // Cộng dồn số lượng
            cartItem.price = cartItem.count * price; // Tính lại tổng giá dựa trên số lượng mới
            await cartItem.save();
        } else {
            // Nếu món chưa tồn tại, thêm mới món ăn với tổng giá
            await CartOrder.create({
                count,
                date,
                number_table,
                price: price * count, // Lưu tổng giá ngay khi tạo
                product_name,
                account_id,
                product_id,
            });
        }

        // Lấy giỏ hàng đã được cập nhật
        const updatedCart = await CartOrder.findAll({ where: { account_id } });
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
        console.error('Error fetching all orders:', error);
        res.status(500).json({ error: 'Error fetching all orders' });
    }
};

const getOrderItemsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItems = await CartOrder.findAll({ where: { account_id: id } });
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items by user ID:', error);
        res.status(500).json({ error: 'Error fetching cart items' });
    }
};

const getOrderItemsByTableNumber = async (req, res) => {
    try {
        const { tableNumber } = req.params;
        const cartItems = await CartOrder.findAll({ where: { number_table: tableNumber } });

        if (!cartItems.length) {
            return res.status(404).json({ message: 'No items found for this table' });
        }

        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items by table number:', error);
        res.status(500).json({ error: 'Error fetching cart items' });
    }
};

const removeFromOrder = async (req, res) => {
    try {
        const { cartItemId } = req.params;

        const item = await CartOrder.findByPk(cartItemId);

        if (!item) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        await item.destroy();
        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Error removing item from cart' });
    }
};

const removeAllFromOrder = async (req, res) => {
    try {
        await CartOrder.destroy({ where: {}, truncate: true });
        res.status(200).json({ message: 'All cart items removed successfully' });
    } catch (error) {
        console.error('Error removing all items from cart:', error);
        res.status(500).json({ error: 'Error removing all items from cart' });
    }
};

const updateOrderItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { count } = req.body;

        const cartItem = await CartOrder.findByPk(cartItemId);

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

// Chuyển dữ liệu từ bảng CartOrder sang OrderStatus
const transferOrderToOrderStatus = async (req, res) => {
    const { number_table, product_id, account_id } = req.body;

    try {
        await sequelize.transaction(async (t) => {
            const orders = await CartOrder.findAll({
                where: { number_table, product_id, account_id },
                transaction: t,
            });

            if (!orders.length) {
                throw new Error('Không tìm thấy đơn hàng nào để chuyển.');
            }

            const transferPromises = orders.map((order) =>
                OrderStatus.create(
                    {
                        order_id: order.id,
                        department: 'status_nhanvien',
                        account_id: order.account_id,
                        status: 'Đang xử lý',
                        updated_at: new Date(),
                        note: null,
                        number_table: order.number_table,
                        count: order.count,
                        product_name: order.product_name,
                    },
                    { transaction: t }
                )
            );

            await Promise.all(transferPromises);

            await CartOrder.destroy({
                where: { number_table, product_id, account_id },
                transaction: t,
            });
        });

        res.status(200).json({ message: 'Chuyển dữ liệu từ CartOrder sang OrderStatus thành công.' });
    } catch (error) {
        console.error('Error transferring data:', error.message);

        if (error.message === 'Không tìm thấy đơn hàng nào để chuyển.') {
            return res.status(404).json({ message: error.message });
        }

        res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý yêu cầu.', error: error.message });
    }
};

module.exports = {
    getAllOrder,
    addToOrder,
    getOrderItemsByUserId,
    removeFromOrder,
    updateOrderItem,
    removeAllFromOrder,
    getOrderItemsByTableNumber,
    transferOrderToOrderStatus,
};
