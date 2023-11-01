require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');

const rewardSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "Reward name already exists"],
        required: [true, "Please provide reward name"],
        maxLength: [40, "Your reward name cannot exceed 40 characters"]
    },
    coins: {
        type: Number,
        required: [true, "Please provide reward coins"],
        unique: true
    },
    photo: {
        type: String,
        required: [true, "Please provide reward photo url"]
    },
    details: {
        type: String,
    },
    type: {
        type: String,
        required: [true, 'Please provide reward type'],
        elevation: {
            values: [
                'gadget',
                'coupon',
                'others'
            ],
            message: 'Please select correct type for reward'
        },
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Reward', rewardSchema)