const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProduct);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.delete("/:id", productController.deleteProducts);
router.put("/:id", productController.updateProduct);
//router.post("/upload/:product_code", upload.single('product_code'), productController.uploadImage);

module.exports = router;
