// statusModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Status = sequelize.define(
  "Status",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "order_status",
    timestamps: true, // Sequelize sẽ tự động thêm trường createdAt và updatedAt
    updatedAt: 'updated_at', // Đặt tên cho trường thời gian cập nhật
    createdAt: false, // Không cần trường created_at, nếu không muốn
  }
);

// Đặt phương thức updateStatus trong model Status
Status.updateStatus = async (order_id, column, status) => {
  try {
    // Cập nhật trạng thái trong cơ sở dữ liệu
    await Status.update(
      { [column]: status }, // Cập nhật trạng thái
      { where: { order_id: order_id } } // Điều kiện tìm kiếm theo order_id
    );
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    throw err; // Ném lỗi ra ngoài để controller có thể bắt lỗi
  }
};

module.exports = Status;
