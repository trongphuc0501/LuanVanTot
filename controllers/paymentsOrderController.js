const PaymentOrder = require('../models/paymentsOrderModel');
const OrderStatus = require('../models/statusModel'); 



const createPayment = async (req, res) => {
    const { order_id, payment_method, amount, note } = req.body;

    try {
        // Kiểm tra đơn hàng tồn tại và đã hoàn thành
        const order = await OrderStatus.findOne({ where: { order_id, status: 'Đã giao món' } });
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng hoặc đơn hàng chưa hoàn thành.' });
        }

        // Thêm thông tin thanh toán vào bảng payments
        const payment = await PaymentOrder.create({ // Sử dụng đúng tên model
            order_id,
            payment_method,
            amount,
            note,
        });

        res.status(201).json({ message: 'Thanh toán đã được ghi nhận.', payment });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi ghi nhận thanh toán.', error: error.message });
    }
};

const getPayments = async (req, res) => {
    try {
        const payments = await PaymentOrder.findAll(); // Sử dụng đúng tên model
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách thanh toán.', error: error.message });
    }
};

module.exports = {
    createPayment,
    getPayments
};
