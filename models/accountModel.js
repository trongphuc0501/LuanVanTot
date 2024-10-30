const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Tự động tăng dần
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false,
      },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "account",
    timestamps: false,
  }
);

module.exports = Account;