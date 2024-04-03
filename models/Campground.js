const mongoose = require('mongoose');

const CampgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the campground's name"],
        unique: true,
        trim: true,
        maxlength: [50, "Campground's name cannot be more than 50 characters"]
    },
    address: {
        type: String,
        required: [true, "Please enter the campground's address"]
    },
    road: {
        type: String,
        required: [true, "Please enter the road the campground located"]
    },
    subdistrict: {
        type: String,
        required: [true, "Please enter the subdistrict the campground located"]
    },
    district: {
        type: String,
        required: [true, "Please enter the district the campground located"]
    },
    province: {
        type: String,
        required: [true, "Please enter the province the campground located"]
    },
    postalcode: {
        type: String,
        required: [true, "Please enter athe campground's postalcode"],
        maxlength: [5, 'Postal code cannot be more than 5 digits'],
        match: [
            /^\d{5}$/,
            "Postal code must compose of only digits with a total length of 5"
        ]
    },
    telephone_number: {
        type: String,
        required: [true, "Please enter your telephone number"],
        unique: true,
        match: [
            /^\d{3}-\d{3}-\d{4}$/,
            "Please enter your phone number in this format: XXX-XXX-XXXX"
        ]
    },
});

module.exports = mongoose.model('Campground', CampgroundSchema);