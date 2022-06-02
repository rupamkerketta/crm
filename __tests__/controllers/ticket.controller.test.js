// This file will be used for writing the test cases for ticket.controller
const ticketController = require('../../controllers/ticket.controller')
const { mockRequest, mockResponse } = require('../interceptor')
const User = require('../../models/user.model')
const Ticket = require('../../models/ticket.model')
const client = require('../../utils/notification-service-client').client

const ticketRequestBody = {
	title: 'Test',
	description: 'Testing the ticket controller',
	priority: 1
}

const createdTicketBody = {
	_id: '123',
	title: 'Test',
	description: 'Testing the ticket controller',
	priority: 1,
	status: 'OPEN',
	reporter: 1,
	assignee: 2,
	createdAt: Date.now(),
	updatedAt: Date.now()
}

const savedUserObj = {
	userType: 'CUSTOMER',
	password: '!@#$567*(0',
	name: 'Test User',
	userId: 1,
	email: 'test@user.com',
	ticketsCreated: [],
	ticketsAssigned: [],
	save: jest.fn()
}

// Test the create ticket functionality
describe('Testing create ticket feature', () => {
	it('unit test the ability to successfully create a new ticket', async () => {
		// External entities that we depend on
		// 1. req, res
		const req = mockRequest()
		const res = mockResponse()

		// If I'm calling the create ticket method, this req needs
		// to have the body object
		req.body = ticketRequestBody
		req.userId = 1

		// Mocking and spying User.findOne method
		const userSpy1 = jest
			.spyOn(User, 'findOne')
			.mockReturnValue(Promise.resolve(savedUserObj))

		// const userSpy2 = jest.spyOn(User, 'find').mockImplementation(() => Promise.resolve())
		const userSpy2 = jest.spyOn(User, 'find').mockImplementation(() => ({
			sort: jest.fn(() => ({
				limit: jest.fn(() => Promise.resolve([savedUserObj]))
			}))
		}))

		// Mock the ticket creation also
		const ticketSpy = jest
			.spyOn(Ticket, 'create')
			.mockImplementation((ticketRequestBody) =>
				Promise.resolve(createdTicketBody)
			)

		// Mock the email client
		const clientSpy = jest
			.spyOn(client, 'post')
			.mockImplementation((url, args, cb) => cb('Test', null))

		// Execution of the test
		await ticketController.createTicket(req, res)

		// Validations
		expect(clientSpy).toHaveBeenCalled()
		expect(userSpy1).toHaveBeenCalled()
		expect(userSpy2).toHaveBeenCalled()
		expect(ticketSpy).toHaveBeenCalled()
	})
})
