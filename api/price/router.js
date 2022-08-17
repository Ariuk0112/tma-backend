const router = require("express").Router();
const { authAdmin } = require("../admin/auth/controller");
const { auth } = require("../auth/controller");

const {
  show_car_price,
  create_car_price,
  delete_car_price,
  update_car_price,
} = require("./controller");
router.get("/", show_car_price);
router.post("/", authAdmin, create_car_price);
router.get("/:id", authAdmin, delete_car_price);
router.put("/:id", authAdmin, update_car_price);
router.delete("/:id", authAdmin, delete_car_price);

module.exports = router;
