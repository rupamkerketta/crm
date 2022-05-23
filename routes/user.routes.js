const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller')
const { authJwtMiddleware: authJwt } = require('../middlewares')

router
	.route('/')
	.get([authJwt.verifyToken, authJwt.isAdmin], userController.findAll)

router.route('/:userId').get([authJwt.verifyToken], userController.findUserById)

router
	.route('/:userId')
	.put([authJwt.verifyToken, authJwt.isAdmin], userController.updateUser)

module.exports = router
