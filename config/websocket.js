const WebSocket = require('ws');

// Tạo WebSocket server trên cổng 4000
const wss = new WebSocket.Server({ port: 4000 });

// Một đối tượng để lưu trữ các kết nối WebSocket theo role
const clients = {
  '1': [], // Order staff (Nhân viên order)
  '2': [], // Kitchen staff (Bếp)
  '3': [], // Wait staff (Nhân viên chạy bàn)
};

// Cơ chế kiểm tra kết nối (ping/pong)
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.isAlive === false) return client.terminate(); // Đóng kết nối nếu không phản hồi
    client.isAlive = false;
    client.ping(); // Gửi ping để kiểm tra kết nối
  });
}, 30000); // Ping mỗi 30 giây

// Xử lý khi có client kết nối
wss.on('connection', (ws, req) => {
  // Lấy role từ header yêu cầu
  const role = req.headers['role'];

  // Kiểm tra nếu role không hợp lệ
  if (!role || !clients[role]) {
    ws.close(1008, 'Invalid role'); // Đóng kết nối nếu role không hợp lệ
    return;
  }

  // Thêm client vào danh sách theo role
  clients[role].push(ws);
  ws.isAlive = true; // Đánh dấu kết nối ban đầu là còn sống

  // Lắng nghe sự kiện `pong` để kiểm tra kết nối
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // Lắng nghe tin nhắn từ client
  ws.on('message', (message) => {
    let data;

    // Xử lý lỗi khi nhận tin nhắn không phải JSON hợp lệ
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.error('Invalid JSON received:', message);
      ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
      return;
    }

    // Phát tin nhắn đến các vai trò tương ứng
    ['1', '2', '3'].forEach((targetRole) => {
      clients[targetRole].forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    });
  });

  // Xử lý khi client ngắt kết nối
  ws.on('close', () => {
    // Loại bỏ client khỏi danh sách
    clients[role] = clients[role].filter((client) => client !== ws);
  });
});

// Hàm phát tin nhắn tới các vai trò cụ thể hoặc tất cả
const notifyClients = (data, role = null) => {
  if (role && clients[role]) {
    // Gửi tới các clients thuộc role chỉ định
    clients[role].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  } else {
    // Gửi tới tất cả clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
};

// Xuất module để sử dụng trong các phần khác của ứng dụng
module.exports = {
  wss,
  notifyClients,
};
