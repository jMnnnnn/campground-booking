const express = require("express");
const router = express.Router();

const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds");

const { protect, authorize } = require("../middleware/auth");

// router.route("/").post(protect, createCampground);
router
  .route("/")
  .get(protect, getCampgrounds)
  .post(protect, authorize("admin"), createCampground);
router
  .route("/:id")
  .get(protect, getCampground)
  .put(protect, authorize("admin"), updateCampground)
  .delete(protect, authorize("admin"), deleteCampground);

module.exports = router;
