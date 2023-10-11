const router = require('express').Router();

const {
    signup,
    login,
    logout,
    forgotPassword,
    passwordReset,
    getLoggedInUserDetails,
    changePassword,
    updateUserDetails,
    adminAllUser,
    managerAllUser,
    admingetOneUser,
    adminUpdateUserDetails,
    adminDeleteUser
} = require('../controllers/userController');
const { isLoggedIn, customRole } = require('../middleware/user');

router.route('/signup').post(signup) 
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotpassword').post(forgotPassword)
router.route('/password/reset/:token').post(passwordReset)
router.route('/userdashboard').get(isLoggedIn, getLoggedInUserDetails)
router.route('/password/update').post(isLoggedIn, changePassword)
router.route('/user/update').post(isLoggedIn, updateUserDetails)

//admin only router
router.route('/admin/users').get(isLoggedIn, customRole("admin"), adminAllUser)
router
.route('/admin/user/:id')
.get(isLoggedIn, customRole("admin"), admingetOneUser)
.post(isLoggedIn, customRole("admin"), adminUpdateUserDetails)
.delete(isLoggedIn, customRole("admin"), adminDeleteUser) 

//manager only route
router.route('/manager/users').get(isLoggedIn, customRole("manager"), managerAllUser)

module.exports = router