const express = require("express");
const { auth } = require("../auth/controller");

const {
  update_user,
  show_cars,
  create_car,
  delete_cars,
  show_one_car,
} = require("./controller");
const router = express.Router({ mergeParams: true });
router.get("/", show_cars);
router.get("/:id", show_one_car);
router.post("/", auth, create_car);
router.put("/:id", auth);
router.delete("/:id", auth, delete_cars);

module.exports = router;
