const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");
const order = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
    carId: {
      type: mongoose.Schema.ObjectId,
      ref: "car",
    },
    status: String,
    createDate: { type: Date, default: Date.now() },
    orderStartDate: Date,
    orderEndDate: Date,
    location: String,
    totalPayment: String,
    prePayment: String,
    prePaymentDate: Date,
    balancePayment: String,
    balancePaymentDate: Date,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("order", order);
