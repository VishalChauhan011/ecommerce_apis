const express = require('express');
const router = express.Router();

const { placeOrder } = require('../controllers/orderControllers')

const { isLoggedIn, customRole } = require('../middleware/user');

router.route('/placeorder').post(isLoggedIn, placeOrder);



module.exports = router;