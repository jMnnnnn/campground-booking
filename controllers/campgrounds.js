const Campground = require("../models/Campground");

// @desc    Get all campgrounds
// @route   GET /api/v1/campgrounds
// @access  Public
exports.getAllCampgrounds = (req, res, next) => {
  Campground.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving campgrounds.",
      });
    } else res.send(data);
  });
};
