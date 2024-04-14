const User = require("../models/User");

// Get token from User model -> Create cookie -> Send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    // //add for frontend
    // _id: user._id,
    // name: user.name,
    // telephone_number: user.telephone_number,
    // email: user.email,
    // //end for frontend
    token,
  });
};

exports.register = async (req, res, next) => {
  //   res.status(200).json({ success: true });
  try {
    const { name, telephone_number, email, password, role } = req.body;

    const user = await User.create({
      name,
      telephone_number,
      email,
      password,
      role,
    });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err.stack);
    const firstError = Object.keys(err.errors)[0];
    return res.status(400).json({
      success: false,
      reason: err.errors[firstError].message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
};

exports.getCurrentUser = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};
