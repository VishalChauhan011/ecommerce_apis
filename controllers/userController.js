const User = require('../models/user')
const BigPromise = require('../middleware/bigPromise')
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const mailHelper = require('../utils/emailHelper')
const crypto = require('crypto')

exports.signup = BigPromise(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
        return next(new CustomError("Email, name and password are required", 400));
    }

    const user = await User.create({
        name, email, password
    })
    cookieToken(user, res);
})

exports.login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;

    //check for presence of email and password
    if (!email || !password) {
        return next(new CustomError("Email and password are required", 400));
    }

    //get user from db
    const user = await User.findOne({ email }).select("+password")

    //if user not found in db
    if (!user) {
        return next(new CustomError("You are not registered in our database", 400));
    }

    //match the password
    const isPasswordCorrect = await user.validatePassword(password);

    //if password is not correct
    if (!isPasswordCorrect) {
        return next(new CustomError("Email or password doesn't exist", 400));
    }

    cookieToken(user, res);
})

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

exports.forgotPassword = BigPromise(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new CustomError("User not found", 400))
    }

    const forgotToken = user.getResetPasswordToken();

    console.log("forgotToken", forgotToken)

    await user.save({ validateBeforeSave: false });

    const myUrl = `${req.protocol}://${req.get("host")}/password/reset/${forgotToken}`

    const message = `Copy paste this link in you URL and enter \n\n ${myUrl}`

    try {

        await mailHelper({
            email: email,
            subject: "Ecommerce - Password reset email",
            message,
        })

        res.status(200).json({
            status: true,
            message: "Email sent successfully"
        })

    } catch (error) {
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined
        await user.save({ validateBeforeSave: false });

        return next(new CustomError(error.message, 500));
    }
})

exports.passwordReset = BigPromise(async (req, res, next) => {
    const token = req.params.token;

    const encryToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
        forgotPasswordToken: encryToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
        return next(new CustomError("Invalid token or token expired", 400))
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new CustomError("Password and confrim password must be same", 400))
    }

    user.password = req.body.password

    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save();

    // send a json response or send token
    cookieToken(user, res);

})

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })

})

exports.changePassword = BigPromise(async (req, res, next) => {

    const userId  = req.user.id

    const user = await User.findById(userId).select("+password")

    const isOldPasswordCorrect = await user.validatePassword(req.body.oldPassword)
    
    if(!isOldPasswordCorrect) {
        return next(new CustomError("Old password is incorrect", 400))
    }

    user.password = req.body.newPassword

    await user.save()

    cookieToken(user, res);

})

exports.updateUserDetails = BigPromise(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        email: req.body.email
    };

   const user = await User.findById(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
   })

   user.name = newData.name;
   user.email = newData.email;

   await user.save();

   res.status(200).json({
    success: true,
    user
   })

})

exports.adminAllUser = BigPromise(async (req, res, next) => {

    const user = await User.find();

    res.status(200).json({
        success: true,
        user
    })

})

exports.admingetOneUser = BigPromise(async (req, res, next) => {

   const user = await User.findById(req.params.id);

   if(!user) {
    return next(new CustomError("No user found", 400))
   }

   res.status(200).json({
    success: true,
    user
   })

})

exports.adminUpdateUserDetails = BigPromise(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

   const user = await User.findOneAndUpdate({_id:req.params.id}, newData, {
    new: true
   })

   res.status(200).json({
    success: true,
    user
   })

})

exports.adminDeleteUser = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new CustomError("No user found", 401))
    }

    await user.deleteOne()

    res.status(200).json({
        success: true,
    })

})

exports.managerAllUser = BigPromise(async (req, res, next) => {

    const user = await User.find({role: 'user'});

    console.log("USER", user)

    res.status(200).json({
        success: true,
        user
    })

})