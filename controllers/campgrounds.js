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

    return res
      .status(200)
      .json({
        success: true,
        // count: campgrounds.length,
        count: total,
        // total,
        data: campgrounds,
      });
  } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ 
          success: false, 
          message: "Error occurred while trying to get the campgrounds" 
        });
  }
};

exports.getCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Campground not found",
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        data: campground,
      });
  } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({
          success: false,
          message: "Error occured while trying to get the campground",
        });
  }
};

exports.createCampground = async (req, res, next) => {
  try {
    const { name, address, road, subdistrict, district, province, postalcode, telephone_number } = req.body;
    const campground = await Campground.create({
      name,
      address,
      road,
      subdistrict,
      district,
      province,
      postalcode,
      telephone_number
    });
    console.log(campground)
    return res
      .status(201)
      .json({
        success: true,
        message: "Campground created successfully",
      });
  } catch (err) {
      console.log(err.toString());
      if (err.toString().indexOf('duplicate') != -1) {
        const dup_key = err.toString().indexOf(`name: "${req.body.name}"`) != -1 ? 'name' : 'telephone number';
        return res
          .status(400)
          .json({
            success: false,
            reason: `The ${dup_key} entered has already been used`, 
          });
      }
      const firstError = Object.keys(err.errors)[0];
      if (firstError) {
        return res
          .status(400)
          .json({
            success: false,
            reason: err.errors[firstError].message, 
          });
      }
      return res
        .status(400)
        .json({
          success: false,
          message: 'Error occurred while trying to create a campground',
        })
  }
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
      return res
        .status(404)
        .json({
          success: false,
          message: 'Campground not found',
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        data: campground,
      });
  } catch (err) {
      console.log(err);
      if (err.toString().indexOf('duplicate') != -1) {
        const dup_key = err.toString().indexOf(`name: "${req.body.name}"`) != -1 ? 'name' : 'telephone number';
        return res
          .status(400)
          .json({
            success: false,
            reason: `The ${dup_key} entered has already been used`, 
          });
      }
      const firstError = Object.keys(err.errors)[0];
      if (firstError) {
        return res
          .status(400)
          .json({
            success: false,
            reason: err.errors[firstError].message, 
          });
      }
      return res
        .status(400)
        .json({
          success: false,
          message: "Error occurred while trying to update the campground",
        });
  }
};

exports.deleteCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Campground not found",
        });
    }
    await campground.deleteOne();
    return res
      .status(200)
      .json({
        success: true,
        data: {},
        message: "Campground successfully deleted",
      });
  } catch (err) {
    console.log(err)
    return res
      .status(400)
      .json({
        success: false,
        message: "Error occurred while trying to delete the campground",
     });
  }
};
