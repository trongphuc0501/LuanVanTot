const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    count: {
        type: DataTypes.INTEGER,
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
    tableName: "cart",
    timestamps: false,
  }
);

module.exports = Cart;
