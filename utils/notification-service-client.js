// Logic to make a POST call to the notification service
const Client = require('node-rest-client').Client
const client = new Client()

// Expose a function which will take the following information
// subject, content, recepientEmails, requester, ticketId as arguments
// and then make a POST call

module.exports = ({
	ticketId,
	subject,
	content,
	recepientEmails,
	requester
}) => {
	// POST call
	//  - URI
	//  - HTTP Verb : POST
	//  - Request Body
	//  - Headers

	const uri = 'http://127.0.0.1:5001/api/v1/notifications'

	const reqBody = {
		ticketId,
		subject,
		content,
		recepientEmails,
		requester
	}

	const headers = {
		'Content-Type': 'application/json'
	}

	const args = {
		data: reqBody,
		headers
	}

	const req = client.post(uri, args, (data, response) => {
		// console.log(data)
		console.log(response)
	})

	req.on('requestTimeout', function (req) {
		console.log('request has expired')
		req.abort()
	})

	req.on('responseTimeout', function (res) {
		console.log('response has expired')
	})

	req.on('error', (err) => {
		console.log('request error', err)
	})
}
