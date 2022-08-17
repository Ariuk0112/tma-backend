const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");
const path = require("path");
const fs = require("fs");
const isEmpty = require("is-empty");
const Price = require("../../models/price");
const carMark = require("../../models/carMark");
module.exports = {
  show_car_price: asyncHandler(async (req, res, next) => {
    const price = await Price.find();
    res.status(200).json({
      success: true,
      data: price,
    });
  }),
  create_car_price: asyncHandler(async (req, res, next) => {
    const type = await Price.create(req.body);
    let arr = req.body.manufactured.split(",");
    let data = {
      manufactured: [],
    };
    for (i = 0; i < arr.length; i++) {
      data.manufactured.push(arr[i]);
    }
    const item = await Price.findByIdAndUpdate(type._id, data, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: item,
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
