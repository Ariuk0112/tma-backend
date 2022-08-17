const mongoose = require("mongoose");
const car = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },

    type: String,
    plateNumber: {
      type: String,
      unique: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    manufactured: String,
    desc: String,
    insurance: String,
    price: String,
    gasType: String,
    steeringWheel: String,
    SeatNum: String,
    gearBox: String,
    steeringWheelPosition: String,
    drivetrain: String,
    fuelConsumption: String,
    location: String,
    carStatus: { type: Number, default: 0 },
    createDate: { type: Date, default: Date.now() },
    avalaibleStartDate: String,
    avalaibleEndDate: String,

    driverName: String,
    driverAge: String,
    driverGender: String,
    drivingExperience: String,
    carDriver: {
      type: String,
      default: "0",
    },
    carFactory: {
      type: mongoose.Schema.ObjectId,
      ref: "carFactory",
    },
    carType: {
      type: mongoose.Schema.ObjectId,
      ref: "carType",
    },
    carMark: {
      type: mongoose.Schema.ObjectId,
      ref: "carMark",
    },
    image: [
      {
        img: {
          type: String,
        },
        ordern: {
          type: String,
        },
      },
    ],
    certificateId: String,
    certificateImg: {
      type: String,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("car", car);
