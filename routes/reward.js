const express = require('express');
const router = express.Router();

const { createReward, getAllReward } = require('../controllers/rewardControllers');

const { isLoggedIn, customRole } = require('../middleware/user')

router.route('/createreward').post(isLoggedIn, customRole('admin'), createReward)
router.route('/getallrewards').get(getAllReward)



module.exports = router;