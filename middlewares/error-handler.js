const { StatusCodes } = require('http-status-codes')
const { CustomApiError } = require('../errors')

const errorHandlerMiddleware = (err, req, res, next) => {
	if (err instanceof CustomApiError) {
		return res.status(err.statusCode).send({ message: err.message })
	}

	console.log(err)

	return res
		.status(StatusCodes.INTERNAL_SERVER_ERROR)
		.send({ message: 'Internal Server Error!' })
}

module.exports = errorHandlerMiddleware
