const Order = require("../../models/order");
const Car = require("../../models/car");
const Price = require("../../models/price");
const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");
const path = require("path");
const fs = require("fs");
const isEmpty = require("is-empty");
module.exports = {
  show_car_price: asyncHandler(async (req, res, next) => {
    const price = await Price.find();
    res.status(200).json({
      success: true,
      data: price,
    });
  }),
  create_order: asyncHandler(async (req, res, next) => {
    let { carId, startDate, EndDate } = req.body;
    let ss;
    let info = {};
    const car = await Car.findById(carId);
    const price = await Price.findOne(
      {
        carMark: car.carMark,
        manufactured: car.manufactured,
      },
      {
        rentalPricePerDayWithDriver: 1,
        rentalPricePerDayWithDriverExtraTime: 1,
        rentalPricePerDay: 1,
        rentalPricePerDayExtraTime: 1,
        rentalPricePerHourWithDriver: 1,
        rentalPricePerHour: 1,
      }
    );
    info = { car, price };
    // const type = await Order.create(req.body);
    res.status(200).json({
      success: true,
      data: info,
    });
  }),

  update_car_price: asyncHandler(async (req, res, next) => {
    const item = await Price.findById(req.params.id);
    if (!item) {
      res.status(200).json({
        success: false,
        data: "",
      });
    }
    const type = await Price.findByIdAndUpdate(item._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: type,
    });
  }),
  delete_car_price: asyncHandler(async (req, res, next) => {
    const type = await Price.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: type,
    });
  }),
};
