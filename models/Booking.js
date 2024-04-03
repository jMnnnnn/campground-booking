const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    booking_date: {
        type: Date,
        required: true
    },
    booking_user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    booked_campground: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campground',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", BookingSchema);