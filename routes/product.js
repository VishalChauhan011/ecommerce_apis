const express = require('express');
const router = express.Router();

const { 
    createProduct, 
    getAllProduct,
    adminDeleteProduct,
    adminGetOneProduct ,
    updateProductDetails
} = require('../controllers/productControllers')

const { isLoggedIn, customRole } = require('../middleware/user');

router.route('/createproduct').post(isLoggedIn, customRole('admin'), createProduct)
router.route('/getallproducts').get(getAllProduct)
router.route('/delete/:id').delete(isLoggedIn, customRole('admin'), adminDeleteProduct)
router.route('/getproductbyid/:id').get(isLoggedIn, customRole('admin'), adminGetOneProduct)
router.route('/update/productdetails/:id').post(isLoggedIn, customRole('admin'), updateProductDetails)


module.exports = router;