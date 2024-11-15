const express = require('express');
const statusController = require('../controllers/statusController'); // Đảm bảo import đúng controller
const router = express.Router();

router.put("/updateStatus", statusController.updateOrderStatus);  // Sử dụng phương thức updateOrderStatus
router.get('/orderStatus/:order_id', statusController.getOrderStatus);  // Sử dụng phương thức getOrderStatus

module.exports = router;
