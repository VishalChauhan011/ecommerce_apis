const router = require('express').Router();

const authRouter = require('./auth');
const productRouter = require('./product');
const uploadRouter = require('./upload');
const orderRouter = require('./order');

router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/upload', uploadRouter);
router.use('/order', orderRouter);

module.exports = router;