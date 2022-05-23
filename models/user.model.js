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
	}
})

module.exports = mongoose.model('User', userSchema)