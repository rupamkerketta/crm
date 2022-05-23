const { BadRequestError } = require('../errors')
const { isEmail } = require('validator')
const User = require('../models/user.model')
const constants = require('../utils/constants')

exports.verifySignUpMiddleware = async (req, res, next) => {
	// name, userId, password, email, userType, userStatus
	const { name, userId, password, email, userType } = req.body

	if (!name) {
		throw new BadRequestError('Failed! User name required!')
	}

	if (!userId) {
		throw new BadRequestError('Failed! userId required!')
	}

	// Check if the user already exists
	const user = await User.findOne({ userId })
	if (user !== null) {
		throw new BadRequestError('Failed! userId already exists!')
	}

	// Check if email exists
	if (!email) {
		throw new BadRequestError('Failed! email required!')
	}

	// If the email exists check if it's a valid email or not
	if (!isEmail(email)) {
		throw new BadRequestError(
			'Failed! invalid email, please provide a valid email!'
		)
	}
	const emailCheck = await User.findOne({ email })
	if (emailCheck) {
		throw new BadRequestError('Failed! email already exists!')
	}

	// Check if password exists
	if (!password) {
		throw new BadRequestError('Failed! password required!')
	}

	// Check if userType exist and is of the correct type
	// [ CUSTOMER | ENGINEER | ADMIN ]
	if (userType) {
		const userTypesArr = Object.entries(constants.userTypes).map((el) => el[1])
		const _userType = userType.toUpperCase()
		if (!userTypesArr.includes(_userType)) {
			throw new BadRequestError('Failed! invalid userType!')
		}
		req.body.userType = _userType
	}

	next()
}
