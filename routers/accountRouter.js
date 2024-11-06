const express = require("express");
const router = express.Router();
const AccountController = require("../controllers/accountController");

router.get("/", AccountController.getAllUsers);
router.post("/", AccountController.createAccount);
router.delete("/:id_user", AccountController.deleteUser);
router.put("/:id_user", AccountController.updateUser);
router.post("/login", AccountController.Dangnhap);

module.exports = router;
