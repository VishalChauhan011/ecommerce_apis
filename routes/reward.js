const express = require('express');
const router = express.Router();

const { createReward, getRewardsByType, claimReward, getClaimedRewardsByUserId, getAllRewards } = require('../controllers/rewardControllers');

const { isLoggedIn, customRole } = require('../middleware/user')

router.route('/createreward').post(isLoggedIn, customRole('admin'), createReward)
router.route('/getallrewards').get(getAllRewards)
router.route('/getrewardsbytype').get(getRewardsByType)
router.route('/claimreward').post(isLoggedIn, customRole('user'), claimReward)
router.route('/getclaimedrewards').get(isLoggedIn, customRole('user'), getClaimedRewardsByUserId)



module.exports = router;