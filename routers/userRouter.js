const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/create", async function (req, res) {
  const { username, email, password, phoneNumber, address } = req.body;
  try {
    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      name: username,
      email: email,
      password: hash,
      phoneNumber: phoneNumber,
      address: address,
    });
    const token = jwt.sign({ email, userid: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    res.status(201).json({ message: "User Created Successfully", info: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

router.post("/login", async function (req, res) {
  let { email, password } = req.body;
  let user = await userModel.findOne({
    email: email,
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  } else {
    try {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          let token = jwt.sign(
            { email: email, userid: user._id },
            process.env.JWT_SECRET
          );
          res.cookie("token", token);
          res.status(200).json({ message: "User Login Successfull" });
        } else {
          res
            .status(401)
            .json({ message: "Login Unsuccessfull:Invalid credientials" });
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
    }
  }
});

router.get("/logout", function (req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});
// Get current user info
router.get("/me", async function (req, res) {
  try {
    // If using sessions, req.session.userid or req.session.user
    // If using JWT in cookies, decode from req.cookies
    // For now, try to get user id from cookie or session
    let userId = req.session?.userid;
    if (!userId && req.cookies && req.cookies.token) {
      // decode JWT
      const jwt = require("jsonwebtoken");
      try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        userId = decoded.userid;
      } catch {
        return res.status(401).json({ message: "Invalid token" });
      }
    }
    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const user = await userModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
