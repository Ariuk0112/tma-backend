const router = require("express").Router();
const { authAdmin } = require("../admin/auth/controller");
const { auth } = require("../auth/controller");

const { create_order } = require("./controller");
router.get("/");
router.post("/:id", authAdmin, create_order);
router.get("/:id");
router.put("/:id", authAdmin);

module.exports = router;
