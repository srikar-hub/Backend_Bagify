const express = require("express");
const router = express.Router();
const Address = require("../models/addressMode");
const loggedin = require("../middlewares/loggedin");

// Get all addresses for logged-in user
router.get("/", loggedin, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json({ addresses });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch addresses", error: err });
  }
});

// Create a new address for logged-in user
router.post("/create", loggedin, async (req, res) => {
  try {
    const { fullName, mobile, pincode, address, city, state } = req.body;
    const newAddress = await Address.create({
      user: req.user._id,
      fullName,
      mobile,
      pincode,
      address,
      city,
      state,
    });
    res.status(201).json({ message: "Address created", address: newAddress });
  } catch (err) {
    res.status(500).json({ message: "Failed to create address", error: err });
  }
});

module.exports = router;
