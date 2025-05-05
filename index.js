const express = require("express");
const cors = require("cors");
const user = require("./routers/userRouter");
const dp = require("./config/mongoose-connection");
const productRoute = require("./routers/productRouter");

const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/product", productRoute);
app.use("/", user);
app.get("/send", function (req, res) {
  res.send("Working");
});
app.listen(4000, function () {
  console.log("Server is running");
});
