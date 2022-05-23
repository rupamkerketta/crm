const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const { verifySignUpMiddleware } = require('../middlewares/verify-signup')

router.route('/').get((req, res) => {
	res.send({ message: 'crm app' })
})

router.route('/signup').post([verifySignUpMiddleware], authController.signup)
router.route('/signin').post(authController.signin)

module.exports = router
