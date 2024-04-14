const Booking = require("../models/Booking");
const Campground = require("../models/Campground");

exports.getBookings = async (req, res, next) => {
  let query;
  if (req.user.role !== "admin") {
    query = Booking.find({ booking_user: req.user.id });
  } else {
    query = Booking.find();
  }
  try {
    const bookings = await query;
    return res
      .status(200)
      .json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({
        success: false,
        error: "Error occurred while trying to get the bookings",
    });
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No booking with the id of ${req.params.id}`,
      });
    }
    if (
      booking.booking_user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({
          success: false,
          message: `User with ID ${req.user.id} is not authorized to view this booking`,
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        data: booking,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({
        success: false,
        error: "Error occurred while trying to get the booking",
      });
  }
};

exports.addBooking = async (req, res, next) => {
  try {
    req.params.campgroundId = req.body.booked_campground;
    const campground = await Campground.findById(req.params.campgroundId);
    if (!campground) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No campground with the id of ${req.params.campgroundId}`,
        });
    }

    req.body.booking_user = req.user.id;
    const existedBookings = await Booking.find({ booking_user: req.user.id });
    if (existedBookings.length >= 3 && req.user.role !== "admin") {
      return res
        .status(400)
        .json({
          success: false,
          message: `The user with ID ${req.user.id} has already made 3 bookings.`,
      });
    }

    const booking = await Booking.create(req.body);
    return res
      .status(200)
      .json({
        success: true,
        data: booking,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({
        success: false,
        error: "Error occurred while trying to create a booking",
      });
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    console.log(booking);
    if (!booking) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No booking with the id of ${req.params.id}`,
        });
    }
    if (
      booking.booking_user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({
          success: false,
          message: `User with ID ${req.user.id} is not authorized to update this booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res
      .status(200)
      .json({
        success: true,
        data: booking,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({
        success: false,
        error: "Error occurred while trying to update the booking",
      });
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No booking with the id of ${req.params.id}`,
        });
    }
    if (
      booking.booking_user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({
          success: false,
          message: `User with ID ${req.user.id} is not authorized to delete this booking`,
        });
    }

    await booking.deleteOne();
    return res
      .status(200)
      .json({
        success: true,
        data: {},
        message: 'The booking was successfully deleted'
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({
        success: false,
        error: "Error occurred while trying to delete the booking",
      });
  }
};
