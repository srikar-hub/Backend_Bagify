const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/create", async function (req, res) {
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name: username,
      email: email,
      password: hash,
    });
    const token = jwt.sign({ email, userid: user._id }, "sssss");
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
          let token = jwt.sign({ email: email, userid: user._id }, "sssss");
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
module.exports = router;
