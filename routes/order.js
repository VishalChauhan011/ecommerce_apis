const express = require('express');
const router = express.Router();

const { placeOrder, getAllOrdersAdmin, getAllOrdersByUserId } = require('../controllers/orderControllers')

const { isLoggedIn, customRole } = require('../middleware/user');

router.route('/placeorder').post(isLoggedIn, placeOrder);
router.route('/getallordersadmin').get(isLoggedIn, customRole('admin'), getAllOrdersAdmin);
router.route('/getallorders/user').get(isLoggedIn, customRole('user'), getAllOrdersByUserId)


module.exports = router;