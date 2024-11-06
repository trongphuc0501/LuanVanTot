const Products = require("../models/productModel"); // Đảm bảo đường dẫn chính xác đến mô hình Products

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Products.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Có vấn đề trong việc lấy danh sách sản phẩm");
  }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const requiredFields = ["name", "price", "img", "description", "product_hot", "category_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Thiếu thông tin",
        missingFields
      });
    }

    const productData = {
      name: req.body.name,
      price: req.body.price,
      img: req.body.img,
      description: req.body.description,
      product_hot: req.body.product_hot,
      category_id: req.body.category_id,
    };

    // Tạo sản phẩm mới
    const product = await Products.create(productData);
    res.status(201).json({
      message: "Sản phẩm đã được tạo thành công",
      product
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: "Lỗi xác thực",
        details: error.errors.map(e => e.message)
      });
    } else {
      console.error("Error creating product:", error);
      res.status(500).send("Có vấn đề trong việc tạo sản phẩm");
    }
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.id_product);
    if (!product) {
      return res.status(404).send("Sản phẩm không tồn tại");
    }

    const { name, price, img, description, product_hot, category_id } = req.body;

    // Cập nhật các trường của sản phẩm
    product.name = name || product.name;
    product.price = price || product.price;
    product.img = img || product.img;
    product.description = description || product.description;
    product.product_hot = product_hot || product.product_hot;
    product.category_id = category_id || product.category_id;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Có vấn đề trong việc cập nhật sản phẩm");
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.id_product);
    if (!product) {
      return res.status(404).send("Sản phẩm không tồn tại");
    }
    await product.destroy();
    res.status(200).send("Sản phẩm đã được xóa thành công");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Có vấn đề trong việc xóa sản phẩm");
  }
};
