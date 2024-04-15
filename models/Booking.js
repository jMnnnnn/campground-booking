const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    booking_start_date: {
        type: Date,
        required: true
    },
    booking_end_date: {
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

const validateNights = function (startDate, endDate) {
    const oneDay = 24 * 60 * 60 * 1000;
    const number_of_nights = Math.round((endDate - startDate) / oneDay);

    return number_of_nights <= 3;
}

// Each booking cannot be longer than 3 nights
BookingSchema.path("booking_start_date").validate({
    validator: function(value) {
        const startDate = value.getTime();
        const endDate = this.get("booking_end_date").getTime();
        return validateNights(startDate, endDate)
    },
   message: 'Booking is only allowed for up to 3 nights', 
});

BookingSchema.path("booking_end_date").validate({
    validator: function(value) {
        const startDate = this.get("booking_start_date").getTime();
        const endDate = value.getTime();
        return validateNights(startDate, endDate)
    },
   message: 'Booking is only allowed for up to 3 nights', 
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = {
    Booking,
    validateNights
};