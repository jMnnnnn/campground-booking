const express = require("express");
const router = express.Router();

const {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings");

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getBookings)
  .post(protect, authorize("registered_user", "admin"), addBooking);

router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, authorize("registered_user", "admin"), updateBooking)
  .delete(protect, authorize("registered_user", "admin"), deleteBooking);

module.exports = router;
