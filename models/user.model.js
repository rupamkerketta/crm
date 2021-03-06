// This file will hold the schema for the User resource
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	// name, userId, password, email, createdAt, updatedAt
	// userType [ ADMIN | ENGINEER | CUSTOMER ]
	// userStatus [ Pending | Approved | Rejected ]
	name: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		minlength: 10,
		unique: true
	},
	createdAt: {
		type: Date,
		immutable: true,
		default: () => Date.now()
	},
	updatedAt: {
		type: Date,
		default: () => Date.now()
	},
	userType: {
		type: String,
		required: true,
		default: 'CUSTOMER'
	},
	userStatus: {
		type: String,
		required: true,
		default: 'APPROVED'
	},
	ticketsCreated: {
		type: [mongoose.SchemaTypes.ObjectId],
		ref: 'Ticket'
	},
	ticketsAssigned: {
		type: [mongoose.SchemaTypes.ObjectId],
		ref: 'Ticket'
	},
	ticketsCreatedSize: {
		type: Number,
		required: true,
		default: 0
	},
	ticketsAssignedSize: {
		type: Number,
		required: true,
		default: 0
	}
})

module.exports = mongoose.model('User', userSchema)
