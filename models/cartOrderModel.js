const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CartOrder = sequelize.define(
  "CartOrder",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      number_table: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

module.exports = CartOrder;
