const express = require('express')
const router = express.Router()

const tickController = require('../controllers/ticket.controller')
const authJwt = require('../middlewares/auth-jwt')

router.route('/').get([authJwt.verifyToken], tickController.getAllTickets)
router.route('/:id').get([authJwt.verifyToken], tickController.getOneTicket)

router.route('/').post([authJwt.verifyToken], tickController.createTicket)

router.route('/:id').patch([authJwt.verifyToken], tickController.updateTicket)

module.exports = router
