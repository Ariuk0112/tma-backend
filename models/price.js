const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");
const autoIncrement = require("mongoose-auto-increment");
const price = new mongoose.Schema(
  {
    carMark: {
      type: mongoose.Schema.ObjectId,
      ref: "carMark",
    },
    manufactured: [String],
    rentalPricePerDayWithDriver: String,
    rentalPricePerDayWithDriverExtraTime: String,
    rentalPricePerDay: String,
    rentalPricePerDayExtraTime: String,
    rentalPricePerHourWithDriver: String,
    rentalPricePerHour: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
var db = mongoose.connection;
autoIncrement.initialize(db);
price.plugin(autoIncrement.plugin, {
  model: "price",
  field: "_id",
  startAt: 0,
  incrementBy: 1,
});

module.exports = mongoose.model("price", price);
