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
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    number_table: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    count: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    tableName: "order_status",
    timestamps: false,
  }
);

// Lấy trạng thái đơn hàng theo vai trò
Status.getOrderStatusByAccountId = async (account_id) => {
  try {
    const result = await Status.findAll({
      where: { account_id: account_id },
      order: [["updated_at", "DESC"]], // Sắp xếp theo thời gian cập nhật mới nhất
    });
    return result;
  } catch (err) {
    console.error("Lỗi lấy trạng thái theo account_id:", err.message);
    throw err;
  }
};
// Cập nhật trạng thái đơn hàng
Status.updateStatus = async (order_id, department, status, account_id, note) => {
  try {
    const result = await Status.update(
      {
        department,
        status,
        account_id,
        note,
        updated_at: new Date(),
      },
      { where: { order_id: order_id } }
    );
    return result;
  } catch (err) {
    console.error("Lỗi trong model:", err.message);
    throw err;
  }
};

module.exports = Status;
