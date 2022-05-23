const { StatusCodes } = require('http-status-codes')
const CustomApiError = require('./custom-api-err')

class ForbiddenError extends CustomApiError {
	constructor(message) {
		super(message)
		this.statusCode = StatusCodes.FORBIDDEN
	}
}

module.exports = ForbiddenError
