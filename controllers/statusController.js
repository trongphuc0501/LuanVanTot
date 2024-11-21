const Status = require('../models/statusModel'); 
const WebSocket = require('../config/websocket'); 
const sequelize = require('../config/database'); 

const DEPARTMENTS = {
    EMPLOYEE: '1',
    KITCHEN: '2',
    RUNNER: '3',
};

const OrderController = {
    updateOrderStatus: async (req, res) => {
        const { order_id, department, status, account_id } = req.body;
        if (!order_id || !department || !status || !account_id) {
            return res.status(400).json({ message: 'Thiếu thông tin đơn hàng, bộ phận, trạng thái hoặc account_id' });
        }

        let column;
        if (department === DEPARTMENTS.EMPLOYEE) column = 'status_nhanvien';
        else if (department === DEPARTMENTS.KITCHEN) column = 'status_bep';
        else if (department === DEPARTMENTS.RUNNER) column = 'status_nhanvien_chay';
        else return res.status(400).json({ message: 'Bộ phận không hợp lệ' });

        try {
            // Cập nhật trạng thái trong cơ sở dữ liệu
            await Status.updateStatus(order_id, column, status, account_id);

            // Gửi thông báo qua WebSocket
            WebSocket.notifyClients({
                type: 'Có món ăn',
                order_id,
                department,
                status,
                account_id,
            });

            res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } catch (err) {
            console.error('Lỗi cập nhật trạng thái:', err.message);
            res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái', error: err.message });
        }
    },

    // Lấy trạng thái đơn hàng
    getAllStatus: async (req, res) => {
      try {
        const status = await Status.findAll();
        res.json(status);
      } catch (error) {
        res.status(500).send(error.message);
      }
    },
    getOrderStatusByAccountId: async (req, res) => {
      const { account_id } = req.body;
  
      // Kiểm tra nếu account_id không được truyền vào
      if (!account_id) {
          return res.status(400).json({ message: "Thiếu account_id trong yêu cầu" });
      }
  
      try {
          // Gọi phương thức từ model để lấy danh sách trạng thái theo account_id
          const result = await Status.getOrderStatusByAccountId(account_id);
  
          // Kiểm tra nếu không tìm thấy bản ghi nào
          if (!result || result.length === 0) {
              return res.status(404).json({ message: `Không có trạng thái nào cho account_id = ${account_id}` });
          }
  
          // Trả về kết quả nếu tìm thấy
          res.status(200).json(result);
      } catch (err) {
          console.error("Lỗi lấy trạng thái theo account_id:", err.message);
          res.status(500).json({ message: "Lỗi khi lấy trạng thái đơn hàng", error: err.message });
      }
  },
  
    // Thêm trạng thái mới từ bảng CartOrder hoặc Status
    addOrderStatusFromCartOrder: async (req, res) => {
        const { statusID, department, account_id } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!statusID) {
            return res.status(400).json({ message: 'Thiếu thông tin statusID.' });
        }

        try {
            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
            await sequelize.transaction(async (t) => {
                const statusOrder = await Status.findOne({ where: { id: statusID }, transaction: t });

                if (!statusOrder) {
                    throw new Error(`Không tìm thấy đơn hàng với ID: ${statusID}`);
                }

                const { product_name, number_table, count } = statusOrder;

                // Thêm trạng thái vào bảng order_status
                await Status.create(
                    {
                        order_id: statusOrder.id,
                        department,
                        account_id,
                        status: 'Đang xử lý',
                        updated_at: new Date(),
                        note: null,
                        product_name,
                        number_table,
                        price,
                        count,
                    },
                    { transaction: t }
                );

                // Xóa bản ghi trong bảng Status
                await statusOrder.destroy({ transaction: t });
            });

            res.status(200).json({ message: 'Đơn hàng đã được xử lý và thêm vào bảng order_status' });
        } catch (error) {
            console.error('Lỗi khi thêm dữ liệu vào bảng order_status:', error.message);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý yêu cầu', error: error.message });
        }
    },
    
};

module.exports = OrderController;
