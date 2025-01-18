const { Router } = require("express");
const controller = require("../controllers/data");

const router = Router();

router.get("/data", controller.getData);
router.post("/data", controller.saveData);
router.put("/data", controller.updateData);
router.delete("/data", controller.deleteData);

module.exports = router;
