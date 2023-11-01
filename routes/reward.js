const express = require('express');
const router = express.Router();

const { createReward, getAllReward, claimReward, getClaimedRewardsByUserId } = require('../controllers/rewardControllers');

const { isLoggedIn, customRole } = require('../middleware/user')

router.route('/createreward').post(isLoggedIn, customRole('admin'), createReward)
router.route('/getallrewards').get(getAllReward)
router.route('/claimreward').post(isLoggedIn, customRole('user'), claimReward)
router.route('/getclaimedrewards').get(isLoggedIn, customRole('user'), getClaimedRewardsByUserId)



module.exports = router;