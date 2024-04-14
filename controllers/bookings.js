const Booking = require("../models/Booking");
const Campground = require("../models/Campground");

exports.getBookings = async (req, res, next) => {
  //   let query;
  //   if (req.user.role !== "admin") {
  //     query = Booking.find({ user: req.user.id });
  //   } else {
  //     query = Booking.find();
  //   }
  //   try {
  //     const bookings = await query;
  //     res.status(200).json({
  //       success: true,
  //       count: bookings.length,
  //       data: bookings,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({
  //       success: false,
  //       error: "Cannot find Appointment",
  //     });
  //   }
};

exports.getBooking = async (req, res, next) => {};

exports.addBooking = async (req, res, next) => {
  //   try {
  //     req.body.campground = req.params.campgroundId;
  //     const campground = await Campground.findById(req.params.campgroundId);
  //     if (!campground) {
  //       return res.status(404).json({
  //         success: false,
  //         message: `No campground with the id of ${req.params.campgroundId}`,
  //       });
  //     }
  //     req.body.user = req.user.id;
  //     const existedBookings = await Booking.find({ user: req.user.id });
  //     if (existedBookings.length >= 3 && req.user.role !== "admin") {
  //       return res.status(400).json({
  //         success: false,
  //         message: `The user with ID ${req.user.id} has already made 3 bookings.`,
  //       });
  //     }
  //     const booking = await Booking.create(req.body);
  //     res.status(200).json({
  //       success: true,
  //       data: booking,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({
  //       success: false,
  //       error: "Cannot create booking",
  //     });
  //   }
};
