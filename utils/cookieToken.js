require('dotenv').config();

const cookieToken = (user, res) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
        ),
        // insecure cookies
        httpOnly: true,
    }

    user.password = undefined; // remove password from response
    res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}



module.exports = cookieToken;