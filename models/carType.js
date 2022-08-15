const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");
const carType = new mongoose.Schema(
  {
    carType: {
      type: String,
      unique: true,
    },
    carFactory: {
      type: mongoose.Schema.ObjectId,
      ref: "carFactory",
    },
    type: String,
    price: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
module.exports = mongoose.model("carType", carType);
