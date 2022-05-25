const validator = require('validator')
const { BadRequestError } = require('../errors')
const constants = require('../utils/constants')

exports.verifyUpdateData = async (req, res, next) => {
	const { name, userType, newUserId, userStatus } = req.body
	const { userId } = req.params

	if (!name && !userType && !userId && !userStatus) {
		throw new BadRequestError('Invalid update parameters!')
	}

	// name validation
	if (name) {
		if (!validator.default.isAlpha(name)) {
			throw new BadRequestError('Invalid name!')
		}
	}

	// userTypes validation
	if (userType) {
		const userTypes = Object.keys(constants.userTypes).map(
			(key) => constants.userTypes[key]
		)
		const _userType = userType.toUpperCase()
		if (!userTypes.includes(_userType)) {
			throw new BadRequestError('Invalid userType!')
		}
		req.body.userType = _userType
	}

	// userStatus validation
	if (userStatus) {
		const userStates = Object.keys(constants.userStatus).map(
			(key) => constants.userStatus[key]
		)
		const _userStatus = userStatus.toUpperCase()
		if (!userStates.includes(_userStatus)) {
			throw new BadRequestError('Invalid userStatus!')
		}
		req.body.userStatus = _userStatus
	}

	// newUserId validation
	if (newUserId) {
		if (!validator.default.isAlphanumeric(newUserId)) {
			throw new BadRequestError(
				'userId can have only letters and numbers (a-zA-Z0-9)'
			)
		}
	}

	next()
}
