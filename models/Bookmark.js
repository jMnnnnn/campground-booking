const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    campground: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campground',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);