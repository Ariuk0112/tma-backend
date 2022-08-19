const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");
const Car1 = require("../../models/car");
const path = require("path");
const fs = require("fs");
const isEmpty = require("is-empty");
const isempty = require("isempty");
const DateDiff = require("diff-dates");
const Prices = require("../../models/price");
const Orders = require("../../models/order");
module.exports = {
  create_order: asyncHandler(async (req, res, next) => {
    const car = await Car1.findById(req.params.id);
    if (!car) {
      return res.status(201).json({
        success: false,
        message: "Зөв ID оруулна уу !",
      });
    }
    let info = req.body;
    let { startDate, EndDate, carDriver, userId } = req.body;
    startDate = new Date(startDate);
    EndDate = new Date(EndDate);
    if (
      startDate < car.avalaibleStartDate ||
      startDate >= car.avalaibleEndDate ||
      EndDate < car.avalaibleStartDate ||
      EndDate > car.avalaibleEndDate
    ) {
      return res.status(201).json({
        success: false,
        message: "Зөв он сар оруулна уу !",
      });
    }
    info.orderStartDate = startDate;
    info.orderEndDate = EndDate;
    info.userId = userId;
    let diff = DateDiff(EndDate, startDate, "days");
    info.balancePaymentDate = EndDate;
    const price = await Car1.aggregate([
      {
        $match: {
          _id: car._id,
        },
      },
      {
        $lookup: {
          from: "prices",
          let: {
            car_manufactured_date: "$manufactured",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$car_manufactured_date", "$manufactured"],
                },
              },
            },
          ],
          as: "result",
        },
      },

      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ["$result", 0],
              },
              "$$ROOT",
              {
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
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
    ]);
    info.price = price[0];
    info.carId = car._id;
    if ((price.carDriver = 1)) {
      if (carDriver == 0) {
        info.totalPayment =
          parseInt(price[0].rentalPricePerDay) * parseInt(diff);
        info.prePayment = (info.totalPayment * 30) / 100;
        info.balancePayment = info.totalPayment - info.prePayment;
        console.log("driver false 1");
      }
      info.totalPayment = parseInt(price[0].rentalPricePerDayWithDriver) * diff;
      info.prePayment = (info.totalPayment * 30) / 100;
      info.balancePayment = info.totalPayment - info.prePayment;
    } else {
      info.totalPayment = parseInt(price[0].rentalPricePerDay) * parseInt(diff);
      info.prePayment = (info.totalPayment * 30) / 100;
      info.balancePayment = info.totalPayment - info.prePayment;
      console.log("driver false");
    }

    info.status = 0;
    const order = await Orders.create(info);
    res.status(200).json({
      success: true,
      data: order,
    });
  }),

  show_orders: asyncHandler(async (req, res, next) => {
    let { isDriver } = req.body;
    let query;
    const driver = req.query.isDriver || 0;

    query = Car1.aggregate([
      {
        $lookup: {
          from: "cars",
          localField: "carId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ["$result", 0],
              },
              "$$ROOT",
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $match: {
          carDriver: isDriver,
        },
      },
    ]);

    let total = await query;
    total = total.length;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort;

    ["sort", "page", "limit", "isDriver"].forEach((el) => delete req.query[el]);

    const pageCount = Math.ceil(total / limit);
    const start = (page - 1) * limit + 1;
    let end = start + limit - 1;
    if (end > total) end = total;

    const pagination = { total, pageCount, start, end };

    if (page < pageCount) pagination.nextPage = page + 1;
    if (page > 1) pagination.prevPage = page - 1;

    const cars = await query
      .clone()
      .sort(sort)
      .skip(start - 1)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
      pagination,
    });
  }),
};
