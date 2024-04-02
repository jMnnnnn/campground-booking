const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
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
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: 8,
        select: false,
        validate: {
            validator: function(pwd) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
            },
            message: props => `${props.value} is not a valid password. The password must contain at least one uppercase letter, one lowercase letter, and one digit.`
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);