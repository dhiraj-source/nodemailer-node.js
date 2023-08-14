const express = require('express')
const allControllerUser = require('../controllers/userControllers')

const router = express.Router()

router.post('/user/signup', allControllerUser.userSignupController)
router.post('/product/bill', allControllerUser.productBillController)

module.exports = router;