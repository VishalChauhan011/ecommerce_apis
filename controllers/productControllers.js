const Product = require('../models/product')
const BigPromise = require('../middleware/bigPromise')
const CustomError = require('../utils/customError')

exports.createProduct = BigPromise(async (req, res, next) => {
    const { key, id, name, price, description, category, rating, reviews, photos, colors } = req.body;

    if(!key) {
        return next(new CustomError("Please enter key", 400));
    } else if(!photos) {
        return next(new CustomError("Please enter photos", 400));
    } else if(!name) {
        return next(new CustomError("Please enter name", 400));
    } else if(!price) {
        return next(new CustomError("Please enter price", 400));
    } else if(!description) {
        return next(new CustomError("Please enter description", 400));
    } else if(!category) {
        return next(new CustomError("Please enter category", 400));
    } else if(!colors) {
        return next(new CustomError("Please enter colors", 400));
    } else if(!rating) {
        return next(new CustomError("Please enter rating", 400));
    } else if(!reviews) {
        return next(new CustomError("Please enter reviews", 400));
    }

    const product = await Product.create({
        key, id, name, price, description, category, rating, reviews, photos, colors
    })

    res.status(200).json({
        success: true,
        message: "Product created successfully",
        product
    })
})

exports.getAllProduct = BigPromise(async (req, res, next) => {
    const products = await Product.find({});

    res.status(200).json({
        success: true,
        message: "All products",
        products
    })
})

exports.adminGetOneProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if(!product) {
        return next(new CustomError("No product found", 401))
    }

    res.status(200).json({
        success: true,
        product
    })
})

exports.adminDeleteProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new CustomError("No product found", 401))
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})

exports.updateProductDetails = BigPromise(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        rating: req.body.rating,
        reviews: req.body.reviews,
        photos: req.body.photos,
        colors: req.body.colors
    }

    const product = await Product.findOneAndUpdate({_id:req.params.id}, newData, {
        new: true,
    });

    res.status(200).json({
        success: true,
        product
    })
})