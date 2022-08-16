const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");
const order = new mongoose.Schema(
  {
    orderId: {
      type: String,
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
var CounterSchema = Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
var counter = mongoose.model("counter", CounterSchema);

order.pre("save", function (next) {
  var doc = this;
  counter.findByIdAndUpdate(
    { _id: "entityId" },
    { $inc: { seq: 1 } },
    function (error, counter) {
      if (error) return next(error);
      doc.orderId = counter.seq;
      next();
    }
  );
});

module.exports = mongoose.model("order", order);
