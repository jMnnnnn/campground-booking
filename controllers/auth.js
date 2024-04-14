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
  return res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
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
    const { name, telephone_number, email, username, password, role } = req.body;

    const user = await User.create({
      name,
      telephone_number,
      email,
      username,
      password,
      role,
    });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err.toString());
      if (err.toString().indexOf('duplicate') != -1) {
        const dup_key = err.toString().indexOf(`username: "${req.body.username}"`) != -1 ? 'username' : 
        err.toString().indexOf(`email: "${req.body.email}"`) != -1 ? 'email' : 'telephone number';
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
          message: 'Error occurred while trying to register',
        })
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({
          success: false, 
          message: "Please provide both username and password"
        });
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ 
          success: false, 
          msg: "Invalid credentials" 
        });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ 
          success: false, 
          msg: "Invalid credentials" 
        });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Error occurred while trying to login",
      });
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return res
    .status(200)
    .json({
      success: true, 
      data: {}, 
      message: 'Logout successfully',
    });
};

exports.getCurrentUser = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  return res
    .status(200)
    .json({
      success: true,
      data: user,
    });
};
