const CustomApiError = require('./custom-api-err')
const BadRequestError = require('./bad-request-err')
const UnauthorizedError = require('./un-authorized-err')
const ForbiddenError = require('./forbidden-err')

module.exports = {
	CustomApiError,
	BadRequestError,
	UnauthorizedError,
	ForbiddenError
}
