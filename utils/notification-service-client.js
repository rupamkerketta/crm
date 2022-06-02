// Logic to make a POST call to the notification service
const Client = require('node-rest-client').Client
const client = new Client()

exports.client = client

// Expose a function which will take the following information
// subject, content, recepientEmails, requester, ticketId as arguments
// and then make a POST call

exports.sendEmail = ({
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
		console.log('notification request sent')
		console.log(data)
	})
}
