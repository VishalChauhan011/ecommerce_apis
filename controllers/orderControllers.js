const Order = require("../models/order");
const Product = require("../models/product");

const BigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customError");
const mailHelper = require("../utils/emailHelper")

const { v4: uuidv4 } = require("uuid");

exports.placeOrder = BigPromise(async (req, res, next) => {
  const { products } = req.body;
  const  email  = req.user.email;

  if (!products) {
    return next(new CustomError("Please enter products", 400));
  }

  const orderId = uuidv4();
  for (let i = 0; i < products.length; i++) {
    const product = await Product.findById(products[i].id);

    if (!product) {
      return next(
        new CustomError(`Product not found with id: ${products[i].id}`, 404)
      );
    }

    const totalAmount = products[i].count * product.price;

    const message = `Order placed successfully with order id: ${orderId}. For the product: ${product.name} for total amount: ${totalAmount}`

    try {
      await mailHelper({
        email: email,
        subject: "Order Placed Successfully",
        message,
      })
    } catch (error) {
      console.log(error)
      return next(new CustomError("Email could not be sent", error.message, 500));
    }

    const order = await Order.create({
      id: orderId,
      user: req.user._id,
      totalAmount,
      product: products[i].id,
    });
  }

  res.status(200).json({
    success: true,
    message: "Order placed successfully",
  });
});

exports.getAllOrdersAdmin = BigPromise(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    success: true,
    message: "All orders",
    orders,
  });
});

exports.getAllOrdersByUserId = BigPromise(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  }).populate("product");

  res.status(200).json({
    success: true,
    message: "All orders",
    orders,
  });
});
