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
    status: {
      type: String,
      default: "0",
    },
    createDate: { type: Date, default: Date.now() },
    orderStartDate: String,
    orderEndDate: String,
    location: String,
    totalPayment: String,
    prePayment: String,
    prePaymentDate: Date,
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
order.pre("save", function (next) {
  this.prePaymentDate = Date.now();
  next();
});
module.exports = mongoose.model("order", order);
