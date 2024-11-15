const Status = require('../models/statusModel'); // Đảm bảo đúng model đang sử dụng
const WebSocket = require('../config/websocket');

const OrderController = {
  updateOrderStatus: async (req, res) => {
    const { order_id, department, status } = req.body;

    let column;
    if (department === '1') column = 'status_nhanvien';
    else if (department === '2') column = 'status_bep';
    else if (department === '3') column = 'status_nhanvien_chay';
    else return res.status(400).send('Bộ phận không hợp lệ');

    try {
      // Sử dụng phương thức updateStatus của model Status
      await Status.updateStatus(order_id, column, status);

      // Gửi thông báo qua WebSocket
      WebSocket.notifyClients({ order_id, department, status });
      res.send('Cập nhật trạng thái thành công');
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
      res.status(500).send('Lỗi cập nhật trạng thái');
    }
  },

  getOrderStatus: async (req, res) => {
    const { order_id } = req.params;

    try {
      // Sử dụng phương thức getOrderStatus của model Status
      const result = await Status.getOrderStatus(order_id);

      if (!result) {
        return res.status(404).send('Đơn hàng không tồn tại');
      }

      res.json(result);
    } catch (err) {
      console.error('Lỗi lấy trạng thái đơn hàng:', err);
      res.status(500).send('Lỗi lấy trạng thái đơn hàng');
    }
  }
};

module.exports = OrderController;
