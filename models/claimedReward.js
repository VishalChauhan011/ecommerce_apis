
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const claimedRewardSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalCoins: {
        type: Number,
        required: true
    },
    reward: {
        type: Schema.Types.ObjectId,
        ref: 'Reward'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('ClaimedRewards', claimedRewardSchema);