const Campground = require("../models/Campground");

exports.getCampgrounds = async (req, res, next) => {
  //   res.status(200).json({ success: true });
  let query;

  const reqQuery = { ...req.query };

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Campground.find(JSON.parse(queryStr));

  try {
    const total = await Campground.countDocuments();

    const campgrounds = await query;

    res.status(200).json({
      success: true,
      count: campgrounds.length,
      total,
      data: campgrounds,
    });
  } catch (err) {
    // console.log(err.stack);
    res.status(400).json({ success: false, message: "Cannot Get Campgrounds" });
  }
};

exports.getCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res.status(404).json({
        success: false,
        message: "Campground not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: campground,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Cannot Get Campground",
    });
  }
};

exports.createCampground = async (req, res, next) => {
  const campground = await Campground.create(req.body);
  res.status(201).json({
    success: true,
    message: "Campground created successfully",
  });
};

exports.updateCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!campground) {
      return res.status(404).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: campground,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Cannot Update Campground",
    });
  }
};

exports.deleteCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res.status(404).json({
        success: false,
        message: "Campground not found",
      });
    }
    await campground.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Cannot Delete Campground",
    });
  }
};
