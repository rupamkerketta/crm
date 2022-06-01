// This file will be used for writing the test cases for ticket.controller
const ticketController = require('../../controllers/ticket.controller')
const { mockRequest, mockResponse } = require('../interceptor')

const ticketRequestBody = {
	title: 'Test',
	description: 'Testing the ticket controller',
	priority: 1
}

// Test the create ticket functionality
describe('Testing create ticket feature', () => {
	it('unit test the ability to successfully create a new ticket', () => {
		// External entities that we depend on
		// 1. req, res

		const req = mockRequest()
		const res = mockResponse()

		// If I'm calling the create ticket method, this req needs
		// to have the body object
		req.body = ticketRequestBody
	})
})
