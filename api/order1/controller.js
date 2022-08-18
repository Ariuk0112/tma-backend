const Order = require("../../models/order");
const Car = require("../../models/car");
const Price = require("../../models/price");
const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");
const path = require("path");
const fs = require("fs");
const DateDiff = require("diff-dates");
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
    let info = req.body;
    info.orderStartDate = startDate;
    info.orderEndDate = EndDate;
    startDate = new Date(startDate);
    EndDate = new Date(EndDate);
    let diff = DateDiff(EndDate, startDate, "days");
    let ss;
    const car = Car.findById(carId);
    console.log(car._id);
    info.balancePaymentDate = EndDate;
    const price = await Car.aggregate([
      {
        $match: {
          _id: car._id,
        },
      },
      {
        $lookup: {
          from: "prices",
          let: {
            car_manufactured: "$manufactured",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$car_manufactured", "$manufactured"],
                },
              },
            },
          ],
          as: "results",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ["$results", 0],
              },
              "$$ROOT",
            ],
          },
        },
      },
      {
        $project: {
          userId: 1,
          type: 1,
          plateNumber: 1,
          approved: 1,
          manufactured: 1,
          desc: 1,
          insurance: 1,
          totalRentalPriceDayWithDriver: 1,
          totalRentalPricePerDay: 1,
          totalRentalPricePerHourWithDriver: 1,
          totalRentalPricePerHour: 1,
          gasType: 1,
          steeringWheel: 1,
          SeatNum: 1,
          gearBox: 1,
          steeringWheelPosition: 1,
          drivetrain: 1,
          fuelConsumption: 1,
          location: 1,
          carStatus: 1,
          createDate: 1,
          avalaibleStartDate: 1,
          avalaibleEndDate: 1,
          driverName: 1,
          driverAge: 1,
          driverGender: 1,
          drivingExperience: 1,
          carDriver: 1,
          carFactory: 1,
          carType: 1,
          carMark: 1,
          image: 1,
          certificateId: 1,
          certificateImg: 1,
          rentalPricePerDayWithDriver: 1,
          rentalPricePerDayWithDriverExtraTime: 1,
          rentalPricePerDay: 1,
          rentalPricePerDayExtraTime: 1,
          rentalPricePerHourWithDriver: 1,
          rentalPricePerHour: 1,
          totalDays: {
            $dateDiff: {
              startDate: "$avalaibleStartDate",
              endDate: "$avalaibleEndDate",
              unit: "day",
            },
          },
          totalHour: {
            $dateDiff: {
              startDate: "$avalaibleStartDate",
              endDate: "$avalaibleEndDate",
              unit: "hour",
            },
          },
        },
      },
    ]).clone();
    if (price.carDriver == 1) {
      info.totalPayment = price.rentalPricePerDayWithDriver * diff;
      info.prePayment = info.totalPayment / 2;
      info.balancePayment = info.totalPayment - info.prePayment;
    } else {
      info.totalPayment = parseInt(price.rentalPricePerDay) * parseInt(diff);
      console.log(price.rentalPricePerDay);
      info.prePayment = info.totalPayment / 2;
      info.balancePayment = info.totalPayment - info.prePayment;
      console.log("driver false");
    }

    // const type = await Order.create(req.body);
    res.status(200).json({
      success: true,
      data: price,
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
