const sequelize = require("../config/database");

const Account = require("./accountModel");
// const Role = require("./role");
const Products = require("./productModel");

module.exports = {
  sequelize,
  Account,
//   Role,
  Products,
};