const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const Product = require("../models/productModel");
const loggedin = require("../middlewares/loggedin");
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      company,
      category,
    } = req.body;

    const newProduct = await Product.create({
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      company,
      category,
      image: req.file.buffer,
    });

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all products
router.get("/all", loggedin, async (req, res) => {
  try {
    const products = await Product.find().lean();

    // Convert Mongoose buffers to base64 strings
    const productsWithBase64 = products.map((product) => {
      if (product.image?.data) {
        const base64String = product.image.data.toString("base64");
        return {
          ...product,
          image: {
            ...product.image,
            data: base64String,
          },
        };
      }
      return product;
    });

    res.status(200).json({
      success: true,
      products: productsWithBase64,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
