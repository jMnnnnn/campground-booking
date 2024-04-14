const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectToDb } = require("./config/mongoDb");

// Route files
const auth = require("./routes/auth");
const bookings = require("./routes/bookings");
const campgrounds = require("./routes/campgrounds");

// Load env variables
dotenv.config({
  path: "./config/config.env",
});

// Connect to MongoDB Database
connectToDb();

// Starting express
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", auth);
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/campgrounds", campgrounds);

// app.get("/api/v1/bookings", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "started successfully",
//   });
// });

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    "Server running in  ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
