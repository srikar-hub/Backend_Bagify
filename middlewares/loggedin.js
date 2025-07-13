const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    return res.status(401).json({ message: "Login In First" });
  }
  try {
    let decode = jwt.verify(req.cookies.token, "sssss");
    let user = await userModel
      .findOne({
        email: decode.email,
      })
      .select("-password");

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Something went Wrong" });
  }
};
