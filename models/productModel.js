const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  image: Buffer,
  price: Number,
  name: String,
  discount: {
    type: Number,
    default: 0,
  },
  bgcolor: String,
  panelcolor: String,
  textcolor: String,
  company: {
    type: String,
    enum: [
      "Samsonite",
      "American Tourister",
      "Tumi",
      "Wildcraft",
      "Skybags",
      "Wrongn",
      "VIP",
      "Puma",
      "Adidas",
      "Nike",
    ],
    required: true,
  },
  category: {
    type: String,
    enum: ["Male", "Female", "Children"],
    required: true,
  },
});

module.exports = mongoose.model("product", productSchema);
