const mongoose = require('mongoose')
const constants = require('../utils/constants')

const ticketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	priority: {
		type: Number,
		required: true,
		default: constants.ticketPriority.four
	},
	status: {
		type: String,
		required: true,
		default: constants.ticketStatus.open
	},
	reporter: {
		type: String
	},
	assignee: {
		type: String
	},
	createdAt: {
		type: Date,
		immutable: true,
		default: () => Date.now()
	},
	updatedAt: {
		type: Date,
		required: true,
		default: () => Date.now()
	}
})

module.exports = mongoose.model('Ticket', ticketSchema)
