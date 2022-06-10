// This file will have all the logic to manipulate the {user} resource
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const User = require('../models/user.model')
const objConverter = require('../utils/obj-converter')

// Fetch list of all users
//  - only admin is allowed to call this method
//  - ADMIN should be able to filter based on
//      - name
//      - userType
//      - userStatus

exports.findAll = async (req, res) => {
	const { name, userType, userStatus } = req.query
	const queryObj = {}

	if (name) {
		queryObj.name = name
	}

	if (userType) {
		queryObj.userType = userType
	}

	if (userStatus) {
		queryObj.userStatus = userStatus
	}

	const allUsers = await User.find(queryObj)
	const data = objConverter.userResponseList(allUsers)

	res.status(StatusCodes.OK).send({ nbHits: allUsers.length, data })
}

// Fetch the user based on the userId
// Only admin is allowed to call this method
exports.findUserById = async (req, res) => {
	const userId = req.params.userId

	const user = await User.findOne({ userId })
	if (user) {
		res.status(StatusCodes.OK).send({ user: objConverter.userResponse(user) })
	} else {
		res
			.status(StatusCodes.NOT_FOUND)
			.send({ message: `User with id ${userId} doen't exist` })
	}
}

// Update the userStatus, userType
//  - only admin should be allowed to do this
exports.updateUser = async (req, res) => {
	const userId = req.params.userId

	// Check the userId if it can be updated or not
	const { newUserId } = req.body
	if (newUserId) {
		const checkUser = await User.findOne({
			userId: newUserId
		})
		if (checkUser) {
			throw new BadRequestError('userId already taken!')
		}
	}

	const updateDateObj = {}
	const { name, userType, userStatus } = req.body
	if (name) {
		updateDateObj.name = name
	}
	if (userType) {
		updateDateObj.userType = userType
	}
	if (userStatus) {
		updateDateObj.userStatus = userStatus
	}
	if (newUserId) {
		updateDateObj.newUserId = newUserId
	}

	const user = await User.findOneAndUpdate({ userId }, updateDateObj)

	if (!user) {
		res
			.status(StatusCodes.NOT_FOUND)
			.send({ message: `User with id ${userId} doen't exist` })
	} else {
		res
			.status(StatusCodes.OK)
			.send({ message: `User with userId: ${userId} updated successfully!` })
	}
}
