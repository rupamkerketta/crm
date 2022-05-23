// Controller for signup/registration
const bcrypt = require('bcryptjs')
const constants = require('../utils/constants')
const { StatusCodes } = require('http-status-codes')
const User = require('../models/user.model')
const { BadRequestError, UnauthorizedError } = require('../errors')
const jwt = require('jsonwebtoken')
const config = require('config')

exports.signup = async (req, res) => {
	// userStatus: APPROVED | PENDING | REJECTED
	// userType: CUSTOMER, userStatus: APPROVED
	// userType: ENGINEER, userStatus: PENDING

	let userStatus = req.body.userStatus

	if (!userStatus) {
		if (
			!req.body.userType ||
			req.body.userType === constants.userTypes.customer
		) {
			userStatus = constants.userStatus.approved
		} else {
			userStatus = constants.userStatus.pending
		}
	}

	const userObj = {
		name: req.body.name,
		userId: req.body.userId,
		email: req.body.email,
		userType: req.body.userType,
		password: bcrypt.hashSync(req.body.password, 8),
		userStatus
	}

	// Insert this new user to the database
	const userCreated = await User.create(userObj)

	// Return the response
	const userCreationResponse = {
		name: userCreated.name,
		userId: userCreated.userId,
		email: userCreated.email,
		userType: userCreated.userType,
		userStatus: userCreated.userStatus,
		createdAt: userCreated.createdAt,
		updatedAt: userCreated.updatedAt
	}

	res.status(StatusCodes.CREATED).send(userCreationResponse)
}

exports.signin = async (req, res) => {
	// Check if the user exists or not
	const user = await User.findOne({ userId: req.body.userId })

	if (!user) {
		throw new BadRequestError(`User with userId: ${req.body.userId} not found`)
	}

	// User exists, so now we will do the password matching
	const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)

	if (!isPasswordValid) {
		throw new UnauthorizedError('Invalid Password')
	}

	// Check if the user is approved
	if (user.userStatus !== constants.userStatus.approved) {
		throw new UnauthorizedError(
			`Login not allowed as the user is not approved!`
		)
	}

	// Successful login
	// I need to generate access token now
	const token = jwt.sign({ id: user.userId }, config.get('jwtConfig.secret'), {
		expiresIn: 600
	})

	// Send the response back
	res.status(StatusCodes.OK).send({
		name: user.name,
		userId: user.userId,
		email: user.email,
		userType: user.userType,
		userStatus: user.userStatus,
		token
	})
}
