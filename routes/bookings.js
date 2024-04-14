const express = require("express");
const router = express.Router();

const { createBooking } = require("../controllers/bookings");

const { protect, authorize } = require("../middleware/auth");

// router.route("/").post(protect, authorize("registered_user"), createBooking);

module.exports = router;
