// Create a ticket
//  - v1 -> anyone should be able to create the ticket

const Ticket = require('../models/ticket.model')
const User = require('../models/user.model')

const { StatusCodes } = require('http-status-codes')
const constants = require('../utils/constants')

const objConverter = require('../utils/obj-converter')

const getEngineer = async (userId) => {
	// If the enginner creates a ticket it should not be assigned
	// to himself/herself
	const engineer = await User.find({
		userId: { $ne: userId },
		userType: constants.userTypes.engineer,
		userStatus: constants.userStatus.approved
	})
		.sort({ ticketsAssignedSize: 1 })
		.limit(1)

	if (engineer) {
		return engineer[0]
	}
	return null
}

exports.createTicket = async (req, res) => {
	const { title, description, priority } = req.body
	const ticketObj = {
		title,
		description,
		priority,
		reporter: req.userId
	}

	// Engineer assignment
	const engineer = await getEngineer(req.userId)

	if (engineer) {
		ticketObj.assignee = engineer.userId
	}

	const ticket = await Ticket.create(ticketObj)
	if (ticket) {
		const user = await User.findOne({ userId: req.userId })
		user.ticketsCreated.push(ticket._id)
		user.ticketsCreatedSize += 1
		await user.save()

		// Assign the ticker to an engineer
		if (engineer) {
			engineer.ticketsAssigned.push(ticket._id)
			engineer.ticketsAssignedSize += 1
			await engineer.save()
		}

		res.status(StatusCodes.CREATED).send(objConverter.ticketResponse(ticket))
	} else {
		// This thrown error will be seen as internal server error
		// by the error handler
		throw new Error()
	}
}

// API to fetch all the tickets
// Depending on the user return different list of tickets
// 		1. ADMIN - Return all tickets
// 		2. ENGINEER - All the tickets, either created or assigned to him/her
// 		3. CUSTOMER - All the tickets created by him/her
exports.getAllTickets = async (req, res) => {
	const queryObjUser = { userId: req.userId }
	const user = await User.findOne(queryObjUser)

	if (user.ticketsCreated === null || user.ticketsCreated.length === 0) {
		return res
			.status(StatusCodes.OK)
			.send({ message: 'No tickets created by you!' })
	}

	const ticketIds = user.ticketsCreated
	const queryObjTicket = {}

	// Query object for non-admin user
	if (user.userType === constants.userTypes.customer) {
		queryObjTicket._id = { $in: ticketIds }
	} else if (user.userType === constants.userTypes.engineer) {
		// Enginner should get all tickets
		// - created by him/her &
		// - assigned to him or her
		ticketIds.push(...user.ticketsAssigned)
		queryObjTicket._id = { $in: ticketIds }

		// * Alternate way of query
		// queryObjTicket._id = {
		// 	$or: [{ _id: { $in: ticketIds } }, { assignee: req.userId }]
		// }
	} else {
		// do nothing
	}

	const { status } = req.query
	if (status) {
		const _status = status.toUpperCase()
		const validStatusArr = Object.keys(constants.ticketStatus).map((key) => [
			constants.ticketStatus[key],
			''
		])
		const validStatus = new Map(validStatusArr)
		if (!validStatus.has(_status)) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.send({ message: 'Invalid search query!' })
		}
		queryObjTicket.status = _status
	}
	const tickets = await Ticket.find(queryObjTicket)

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

	const user = await User.findOne({
		userId: req.userId
	})

	// 1. customer -> should be able to change the title, description and priority
	// 2. engineer -> should be able to change the status of the ticket assigned to him/her
	// 3. admin -> should be able to change the assignee and priority of a ticket

	const updateTicketUtil = () => {
		const { title, description, priority } = req.body
		if (title) {
			ticket.title = title
		}
		if (description) {
			ticket.description = description
		}
		if (priority) {
			ticket.priority = priority
		}
	}

	switch (user.userType) {
		case 'CUSTOMER':
			updateTicketUtil()
			break
		case 'ENGINEER':
			if (
				ticket.assignee !== user.userId &&
				user.ticketsCreated.includes(ticket._id)
			) {
				updateTicketUtil()
			} else if (ticket.assignee === user.userId) {
				const { status } = req.body
				if (status) {
					ticket.status = status
				}
			} else if (ticket.assignee === 'none' && user.ticketsAssignedSize <= 4) {
				ticket.assignee = user.userId
				user.ticketsAssigned.push(ticket._id)
				user.ticketsAssignedSize += 1
				await user.save()
			}
			break
		case 'ADMIN':
			// do domething
			break
		default:
		// throw an error
	}

	// The ticket should only be updated by the owner of the ticket and the assignee engineer
	// if (
	// 	ticket.assignee === user._id ||
	// 	(user.ticketsCreated !== undefined &&
	// 		user.ticketsCreated.length !== 0 &&
	// 		user.ticketsCreated.includes(req.params.id))
	// ) {
	// Update the attributes of the saved ticket
	// const { title, description, priority } = req.body

	// ticket.title = title === undefined ? ticket.title : title
	// ticket.description =
	// 	description === undefined ? ticket.description : description
	// ticket.priority = priority === undefined ? ticket.priority : priority

	// Ability to re-assign the ticket
	// if (user.userType === constants.userTypes.admin) {
	// 	ticket.assignee =
	// 		req.body.assignee === undefined ? ticket.assignee : req.body.assignee
	// }

	// Save the updated ticket
	// const updatedTicket = await ticket.save()

	// Return the updated ticket
	// return res.status(StatusCodes.OK).send({
	// 	message: `Ticket with id: ${ticket._id} updated successfully!`,
	// 	ticket: updatedTicket
	// })
	// }

	// res.status(StatusCodes.FORBIDDEN).send({
	// 	message: 'Not allowed to update the ticket!'
	// })
}
