// Create a ticket
//  - v1 -> anyone should be able to create the ticket
const { StatusCodes } = require('http-status-codes')
const Ticket = require('../models/ticket.model')
const objConverter = require('../utils/obj-converter')

exports.createTicket = async (req, res) => {
	const { title, description, priority } = req.body
	const ticket = await Ticket.create({
		title,
		description,
		priority
	})

	// :TODO: Assigning an engineer to the ticket

	res.status(StatusCodes.CREATED).send(objConverter.ticketResponse(ticket))
}
