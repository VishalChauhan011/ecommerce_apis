require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        maxLength: [40, "Your name cannot exceed 40 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        validate: [validator.isEmail, "Please provide a valid email address"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minLength: [8, "Password must be at least 8 characters long"],
        select: false
    },
    role: {
        type: String,
        default: "user"
        // required: [true, "Please provide a role"],
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// Encrypting password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//validate the password with passed on user password
userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

//create and return jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
}

//generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    //generate long random string
    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log("resetToken", resetToken);

    //hash and set to resetPasswordToken
    this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log("this.forgotPasswordToken", this.forgotPasswordToken);

    //set token expiry time
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);