const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");
const autoIncrement = require("mongoose-auto-increment");
const order = new mongoose.Schema(
  {
    orderId: {
      type: Number,
      required: true,
      unique: true,
    },
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
    orderStartDate: String,
    orderEndDate: String,
    location: String,
    totalPayment: String,
    prePayment: String,
    prePaymentDate: String,
    balancePayment: String,
    balancePaymentDate: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
var db = mongoose.connection;
autoIncrement.initialize(db);
order.plugin(autoIncrement.plugin, {
  model: "order",
  field: "orderId",
  startAt: 1000,
  incrementBy: 1,
});

module.exports = mongoose.model("order", order);
