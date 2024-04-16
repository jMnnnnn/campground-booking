const Bookmark = require("../models/Bookmark");
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

exports.getBookmarkCampgrounds = async (req, res, next) => {
  let query;
  if (req.user.role != "admin") {
    query = Bookmark.find({ user: req.user.id });
  } else {
    query = Bookmark.find();
  }

  try {
    const bookmarks = await query;
    return res
      .status(200)
      .json({
        success: true,
        count: bookmarks.length,
        data: bookmarks,
      })
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({
        success: false,
        message: "Error occurred while trying to get bookmark campgrounds"
      })
  }
}

exports.addBookmarkCampground = async (req, res, next) => {
  try {
    if (req.body.campground_name) {
      const campground_name = req.body.campground_name.toString();
      console.log(campground_name);
      const campground_by_name = await Campground.findOne({ name: campground_name }).select('_id');
      console.log(campground_by_name)
      req.body = {
        ...req.body,
        "campground": campground_by_name._id,
      };
      console.log(req.body)
      req.params.campgroundId = campground_by_name._id;
    } else {
      req.params.campgroundId = req.body.campground;
    }
    const campground = await Campground.findById(req.params.campgroundId);
    if (!campground) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No campground with the id of ${req.params.campgroundId}`,
        });
    }

    req.body.user = req.user.id;
    const existedBookmark = await Bookmark.find(req.body);
    console.log(existedBookmark.length > 0);
    if (existedBookmark.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Campground: ${req.body.campground} already existed in your bookmark`,
        });
    }
    const bookmark = await Bookmark.create(req.body);
    return res
    .status(200)
    .json({
      success: true,
      data: bookmark,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({
        success: false,
        error: "Error occurred while trying to add a campground to your bookmark",
      });
  }
}

exports.deleteBookmarkCampground = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No bookmark with the id of ${req.params.id}`,
        });
    }

    if (
      bookmark.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      const user = await User.findById(req.user.id).select("username");
      return res
        .status(401)
        .json({
          success: false,
          message: `${user.username} is not authorized to remove this bookmark`,
        });
    }

    await bookmark.deleteOne();
    return res
      .status(200)
      .json({
        success: true,
        data: {},
        message: 'The bookmark was successfully removed'
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
}