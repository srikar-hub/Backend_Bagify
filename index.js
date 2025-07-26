require("dotenv").config();
const express = require("express");
const cors = require("cors");
const user = require("./routers/userRouter");
const dp = require("./config/mongoose-connection");

const productRoute = require("./routers/productRouter");
const cartRoute = require("./routers/cartRouter");
const addressRoute = require("./routers/addressRouter");

const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://frontend-bagify.onrender.com"],
    credentials: true,
  })
);
app.use("/product", productRoute);
app.use("/", user);
app.use("/cart", cartRoute);
app.use("/address", addressRoute);
app.get("/send", function (req, res) {
  res.send("Working");
});
app.listen(4000, function () {
  console.log("Server is running");
});
