const express = require('express')
const router = express.Router()

const tickController = require('../controllers/ticket.controller')
const authJwt = require('../middlewares/auth-jwt')

router.route('/').post([authJwt.verifyToken], tickController.createTicket)

module.exports = router
