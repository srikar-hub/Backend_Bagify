const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const loggedin = require("../middlewares/loggedin");

// Get cart for logged-in user (with product details)

router.get("/", loggedin, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("cart.productId");
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to get cart", error: err });
  }
});

// Add or update product in cart
router.post("/add", loggedin, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await userModel.findById(req.user._id);
    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }
    await user.save();
    res.json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart", error: err });
  }
});

// Remove product from cart
router.post("/remove", loggedin, async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await userModel.findById(req.user._id);
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );
    await user.save();
    res.json({ message: "Item removed", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart", error: err });
  }
});

// Checkout: Move cart items to orders and clear cart
router.post("/checkout", loggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { addressId } = req.body;
    if (!user.cart.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!addressId) {
      return res
        .status(400)
        .json({ message: "Please select an address to place the order" });
    }
    const orderProducts = user.cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    user.orders.push({
      products: orderProducts,
      address: addressId,
      orderDate: new Date(),
    });
    user.cart = [];
    await user.save();
    res.json({ message: "Order placed successfully", orders: user.orders });
  } catch (err) {
    res.status(500).json({ message: "Checkout failed", error: err });
  }
});
// Get user's orders with product details
router.get("/myorders", loggedin, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("orders.products.productId")
      .populate("orders.address");
    res.json({ orders: user.orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

module.exports = router;
