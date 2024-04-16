const { Booking, validateNights } = require("../models/Booking");
const Campground = require("../models/Campground");
const User = require("../models/User");

exports.getBookings = async (req, res, next) => {
  let query;
  if (req.user.role !== "admin") {
    query = Booking.find({ booking_user: req.user.id })
      .populate({
        path: "booked_campground",
        select: "name telephone_number",
      })
      .populate({
        path: "booking_user",
        select: "name telephon_number email username",
      });
  } else {
    query = Booking.find()
      .populate({
        path: "booked_campground",
        select: "name telephone_number",
      })
      .populate({
        path: "booking_user",
        select: "name telephon_number email username",
      });
  }
  try {
    const bookings = await query;
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: "Error occurred while trying to get the bookings",
    });
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "booked_campground",
        select: "name telephone_number",
      })
      .populate({
        path: "booking_user",
        select: "name telephon_number email username",
      });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    if (
      booking.booking_user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      const user = await User.findById(req.user.id).select("username");
      return res.status(401).json({
        success: false,
        message: `${user.username} is not authorized to view this booking`,
      });
    }
    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: "Error occurred while trying to get the booking",
    });
  }
};

exports.addBooking = async (req, res, next) => {
  try {
    if (req.body.booked_campground_name) {
      const campground_name = req.body.booked_campground_name.toString();
      console.log(campground_name);
      const campground_by_name = await Campground.findOne({
        name: campground_name,
      }).select("_id");
      console.log(campground_by_name);
      req.body = {
        ...req.body,
        booked_campground: campground_by_name._id,
      };
      console.log(req.body);
      req.params.campgroundId = campground_by_name._id;
    } else {
      req.params.campgroundId = req.body.booked_campground;
    }
    const campground = await Campground.findById(req.params.campgroundId);
    if (!campground) {
      return res.status(404).json({
        success: false,
        message: `No campground with the id of ${req.params.campgroundId}`,
      });
    }

    req.body.booking_user = req.user.id;
    const existedBookings = await Booking.find({ booking_user: req.user.id });
    if (existedBookings.length >= 3 && req.user.role !== "admin") {
      const user = await User.findById(req.body.booking_user).select(
        "username"
      );
      return res.status(400).json({
        success: false,
        message: `${user.username} has already made 3 bookings.`,
      });
    }

    const booking = await Booking.create(req.body);
    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err.toString());
    if (
      err.toString().indexOf("Booking is only allowed for up to 3 nights") != -1
    ) {
      return res.status(400).json({
        success: false,
        reason: "Booking is only allowed for up to 3 nights",
      });
    }
    if (err == dateError) {
      return res.status(400).json({
        success: false,
        reason: "Invalid start and end booking date",
      });
    }
    return res.status(400).json({
      success: false,
      error: "Error occurred while trying to create a booking",
    });
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id)
      .populate({
        path: "booked_campground",
        select: "name telephone_number",
      })
      .populate({
        path: "booking_user",
        select: "name telephon_number email username",
      });
    console.log(booking);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    if (
      booking.booking_user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      const user = await User.findById(req.user.id).select("username");
      return res.status(401).json({
        success: false,
        message: `${user.username} is not authorized to update this booking`,
      });
    }

    console.log(`time: ${new Date(req.body.booking_end_date).getTime()}`);
    if (
      (req.body.booking_start_date &&
        req.body.booking_end_date &&
        !validateNights(
          new Date(req.body.booking_start_date).getTime(),
          new Date(req.body.booking_end_date).getTime()
        )) ||
      (req.body.booking_start_date &&
        !req.body.booking_end_date &&
        !validateNights(
          new Date(req.body.booking_start_date).getTime(),
          booking.booking_end_date.getTime()
        )) ||
      (!req.body.booking_start_date &&
        req.body.booking_end_date &&
        !validateNights(
          booking.booking_start_date.getTime(),
          new Date(req.body.booking_end_date).getTime()
        ))
    ) {
      return res.status(400).json({
        success: false,
        reason: "Booking is only allowed for up to 3 nights",
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // runValidators: true,
    })
      .populate({
        path: "booked_campground",
        select: "name telephone_number",
      })
      .populate({
        path: "booking_user",
        select: "name telephon_number email username",
      });
    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err);
    if (err.toString().indexOf("ValidationError: booking_end_date") != -1) {
      const error_message = err.toString().split(": ")[2];
      return res.status(400).json({
        success: false,
        reason: error_message,
      });
    }
    if (err == "dateError") {
      return res.status(400).json({
        success: false,
        reason: "Invalid start and end booking date",
      });
    }
    return res.status(400).json({
      success: false,
      error: "Error occurred while trying to update the booking",
    });
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    if (
      booking.booking_user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      const user = await User.findById(req.user.id).select("username");
      return res.status(401).json({
        success: false,
        message: `${user.username} is not authorized to delete this booking`,
      });
    }

    await booking.deleteOne();
    return res.status(200).json({
      success: true,
      data: {},
      message: "The booking was successfully deleted",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: "Error occurred while trying to delete the booking",
    });
  }
};
