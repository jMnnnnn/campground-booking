const mongoose = require("mongoose");

exports.connectToDb = async () => {
    mongoose.set("strictQuery", true);
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connect.connection.host}`);
}