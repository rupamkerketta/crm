const { StatusCodes } = require('http-status-codes')
const CustomApiError = require('./custom-api-err')

class BadRequestError extends CustomApiError {
	constructor(message) {
		super(message)
		this.statusCode = StatusCodes.BAD_REQUEST
	}
}

module.exports = BadRequestError
