const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

const app = express();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getCurrentUser);

module.exports = router;
