// models/user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Products = sequelize.define(
  "Products",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Thiết lập tự tăng
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_hot: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

module.exports = Products;
