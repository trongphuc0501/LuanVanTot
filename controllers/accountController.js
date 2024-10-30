const Account = require("../models/accountModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require("../routers/accountRouter");
const { secret } = require("../config");

exports.getAllUsers = async (req, res) => {
  try {
    const accounts = await Account.findAll();
    res.json(accounts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.Dangnhap = async (req, res) => {
  try {
    const user = await Account.findOne({ where: { name: req.body.name } });
    if (!user) {
      return res.status(404).send("Người dùng không tồn tại");
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ auth: false, token: null });
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '24h' });
    res.status(200).json({ auth: true, token });
  } catch (error) {
    res.status(500).send('Có vấn đề trong quá trình đăng nhập');
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone_number, address, password, role } = req.body;
    if (!name || !email || !phone_number || !address || !password || !role) {
      return res.status(400).json({ error: "Thiếu thông tin" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email không hợp lệ" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Account.create({ ...req.body, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await Account.findByPk(req.params.id_user);
    if (!user) {
      return res.status(404).send("User not found");
    }
    await user.destroy();
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await Account.findByPk(req.params.id_user);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const { name, password, role } = req.body;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.name = name || user.name;
    user.role = role || user.role;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
