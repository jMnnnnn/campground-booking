const express = require("express");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({
    path: "./config/config.env",
});


// Starting express
const app = express();

app.use(express.json());

// app.use("/api/v1/test", console.log("testing successful"))
app.get("/api/v1/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "started successfully"
    })
})

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log("Server running in  ", process.env.NODE_ENV, " mode on port ", PORT));

// Handle unhandled promise rejections
process.on("unhandledRejection", (error, promise) => {
    console.log(`Error: ${error.message}`);
    // Close server & exit process
    server.close(() => process.exit(1)); 
})