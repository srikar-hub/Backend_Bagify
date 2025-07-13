const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
    },
  ],
  orders: [
    {
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
      address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      },
      orderDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  phoneNumber: String,
});

module.exports = mongoose.model("user", userSchema);
