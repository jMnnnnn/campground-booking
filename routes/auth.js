const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getCurrentUser);

module.exports = router;
