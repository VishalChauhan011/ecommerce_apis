const Reward = require('../models/reward')
const BigPromise = require('../middleware/bigPromise')
const CustomError = require('../utils/customError')

exports.createReward = BigPromise(async (req, res, next) => {
    const {name, coins, photo, type, details } = req.body;

    if(!name) {
        return next(new CustomError("Please enter name", 400));
    } else if(!photo) {
        return next(new CustomError("Please enter photo", 400));
    } else if(!coins) {
        return next(new CustomError("Please enter coins", 400));
    } else if(!type) {
        return next(new CustomError("Please enter type", 400));
    }

    const reward = await Reward.create({
        name, coins, photo, type, details
    })

    res.status(200).json({
        success: true,
        message: "Reward created successfully",
        reward
    })
})

exports.getAllReward = BigPromise(async (req, res, next) => {
    const rewards = await Reward.find({});

    res.status(200).json({
        success: true,
        message: "All rewards",
        rewards
    })
})