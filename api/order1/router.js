const router = require("express").Router();
const { auth } = require("../auth/controller");

const { create_order } = require("./controller");

router.get("/");
router.post("/", auth, create_order);
router.put("/:id", auth);
router.get("/:id");
router.delete("/:id");
module.exports = router;
