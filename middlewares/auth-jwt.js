// Authentication
// If the token passed is valid or not
//  - if no token is passed in the request header -> 'not allowed'
//  - if token is passed -> 'authenticated'
//      - if correct -> 'allow' else -> 'reject'

const jwt = require('jsonwebtoken')
const config = require('config')
const { ForbiddenError, UnauthorizedError } = require('../errors')
const User = require('../models/user.model')
const constants = require('../utils/constants')

exports.verifyToken = (req, res, next) => {
	// Read token from the header
	const token = req.headers['x-access-token']

	if (!token) {
		throw new ForbiddenError('Token not found!')
	}

	// If the token was provided we need to verify it
	jwt.verify(token, config.get('jwtConfig.secret'), (err, decoded) => {
		if (err) {
			throw new UnauthorizedError('Unauthorized')
		}

		// Read the userId from the decoded token and store it in req object
		req.userId = decoded.id
		next()
	})
}

// To check if the passed access token is of 'ADMIN' or not
exports.isAdmin = async (req, res, next) => {
	// Fetch user from the DB using the userId
	const user = await User.findOne({ userId: req.userId })

	// Check what is the userType
	if (user && user.userType === constants.userTypes.admin) {
		next()
	} else {
		throw new ForbiddenError('Required ADMIN role')
	}
}
