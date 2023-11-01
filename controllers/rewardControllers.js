const Reward = require('../models/reward')
const ClaimedRewards = require('../models/claimedReward')
const User = require('../models/user')
const BigPromise = require('../middleware/bigPromise')
const CustomError = require('../utils/customError')
const { v4: uuidv4 } = require("uuid");

exports.createReward = BigPromise(async (req, res, next) => {
    const { name, coins, photo, type, details } = req.body;

    if (!name) {
        return next(new CustomError("Please enter name", 400));
    } else if (!photo) {
        return next(new CustomError("Please enter photo", 400));
    } else if (!coins) {
        return next(new CustomError("Please enter coins", 400));
    } else if (!type) {
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

exports.getAllRewards = BigPromise(async (req, res, next) => {
    const rewards = await Reward.find({});

    // Group rewards by their type
    const rewardsByType = rewards.reduce((result, reward) => {
        if (!result[reward.type]) {
            result[reward.type] = [];
        }
        result[reward.type].push(reward);
        return result;
    }, {});

    console.log(rewardsByType);

    res.status(200).json({
        success: true,
        message: "All rewards",
        rewardsByType
    })
})

exports.getRewardsByType = BigPromise(async (req, res, next) => {
    const type = req.body.type;

    const rewards = await Reward.find({ type: type })

    res.status(200).json({
        success: true,
        message: "All rewards",
        rewards
    })
})

exports.claimReward = BigPromise(async (req, res, next) => {
    const coins = req.user.coins;
    const rewardId = req.body.reward;

    const isAlreadyClaimed = await ClaimedRewards.findOne({ user: req.user._id, reward: rewardId })

    if (isAlreadyClaimed) {
        return next(new CustomError("You have already claimed this reward", 400));
    }

    if (!rewardId) {
        return next(new CustomError("Please enter rewardId", 400));
    }

    const claimId = uuidv4();
    const reward = await Reward.findById(rewardId);

    if (!reward) {
        return next(new CustomError("Reward not found", 404));
    }

    if (coins < reward.coins) {
        return next(new CustomError("You don't have enough coins", 400));
    }

    //update users coins
    const newData = {
        coins: coins - reward.coins
    }

    const user = await User.findOneAndUpdate({ _id: req.user._id }, newData, {
        new: true
    })

    const claimedReward = await ClaimedRewards.create({
        id: claimId,
        user: req.user._id,
        totalCoins: reward.coins,
        reward: rewardId
    })

    res.status(200).json({
        success: true,
        message: "Reward claimed successfully",
        claimedReward
    })

})

exports.getClaimedRewardsByUserId = BigPromise(async (req, res, next) => {
    const claimedRewards = await ClaimedRewards.find({ user: req.user._id }).populate('reward')

    res.status(200).json({
        success: true,
        message: "All claimed rewards",
        claimedRewards
    })
})