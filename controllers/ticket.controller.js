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

		res.status(StatusCodes.CREATED).send(objConverter.ticketResponse(ticket))
	} else {
		// This thrown error will be seen as internal server error
		// by the error handler
		throw new Error()
	}
}

// API to fetch all the tickets
exports.getAllTickets = async (req, res) => {
	const queryObj = { userId: req.userId }
	const user = await User.findOne(queryObj)

	if (user.ticketsCreated === null || user.ticketsCreated.length === 0) {
		return res
			.status(StatusCodes.OK)
			.send({ message: 'No tickets created by you!' })
	}

	const ticketIds = user.ticketsCreated
	const tickets = await Ticket.find({
		_id: {
			$in: ticketIds
		}
	})

	res.status(StatusCodes.OK).send({ nbHits: tickets.length, tickets })
}

// API to fetch one ticket
exports.getOneTicket = async (req, res) => {
	const ticket = await Ticket.findOne({
		_id: req.params.id
	})

	res.status(StatusCodes.OK).send(objConverter.ticketResponse(ticket))
}

// API to updated the ticket
exports.updateTicket = async (req, res) => {
	// Check of the ticket exists
	const ticket = await Ticket.findOne({
		_id: req.params.id
	})

	if (!ticket) {
		return res
			.status(StatusCodes.OK)
			.send({ message: 'Ticket does not exist!' })
	}

	// Only the ticket requester be allowed to update the ticket
	const user = await User.findOne({
		userId: req.userId
	})

	if (!user.ticketsCreated.includes(req.params.id)) {
		return res.status(StatusCodes.FORBIDDEN).send({
			message: 'Only the owner of the ticket is allowed to update!'
		})
	}

	// Update the attributes of the saved ticket
	const { title, description, priority } = req.body

	ticket.title = title === undefined ? ticket.title : title
	ticket.description =
		description === undefined ? ticket.description : description
	ticket.priority = priority === undefined ? ticket.priority : priority

	// Save the updated ticket
	const updatedTicket = await ticket.save()

	// Return the updated ticket
	res.status(StatusCodes.OK).send({
		message: `Ticket with id: ${ticket._id} updated successfully!`,
		ticket: updatedTicket
	})
}
