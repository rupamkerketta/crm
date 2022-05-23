// Create a ticket
//  - v1 -> anyone should be able to create the ticket

const Ticket = require('../models/ticket.model')
const User = require('../models/user.model')

const { StatusCodes } = require('http-status-codes')
const constants = require('../utils/constants')

const objConverter = require('../utils/obj-converter')

exports.createTicket = async (req, res) => {
	const { title, description, priority } = req.body
	const ticketObj = {
		title,
		description,
		priority,
		reporter: req.userId
	}

	// :TODO: Improve the assignment logic for ticket allotment

	// If any Engineer is available
	const engineer = await User.find({
		userType: constants.userTypes.engineer,
		userStatus: constants.userStatus.approved
	})

	if (engineer) {
		ticketObj.assignee = engineer.userId
	}

	const ticket = await Ticket.create(ticketObj)

	if (ticket) {
		const user = await User.findOne({ userId: req.userId })
		user.ticketsCreated.push(ticket._id)
		await user.save()

		// Assign the ticker to an engineer
		engineer.ticketsAssigned.push(ticket._id)
		await engineer.save()

		return res
			.status(StatusCodes.CREATED)
			.send(objConverter.ticketResponse(ticket))
	} else {
		// This thrown error will be seen as internal server error
		// by the error handler
		throw new Error()
	}
}
