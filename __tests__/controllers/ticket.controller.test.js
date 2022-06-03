// This file will be used for writing the test cases for ticket.controller
const ticketController = require('../../controllers/ticket.controller')
const { mockRequest, mockResponse } = require('../interceptor')
const User = require('../../models/user.model')
const Ticket = require('../../models/ticket.model')
const client = require('../../utils/notification-service-client').client
const errorHandlerMiddleware = require('../../middlewares/error-handler')
const constants = require('../../utils/constants')

const ticketRequestBody = {
	title: 'Test',
	description: 'Testing the ticket controller',
	priority: 1
}

const createdTicketBody = {
	_id: '123',
	title: 'Test',
	description: 'Testing the ticket controller',
	priority: constants.ticketPriority.one,
	status: constants.ticketStatus.open,
	reporter: 1,
	assignee: 2,
	createdAt: Date.now(),
	updatedAt: Date.now(),
	save: jest.fn(() => Promise.resolve(updatedTicketBody))
}

const updatedTicketBody = {
	_id: '123',
	title: 'Update Test',
	description: 'Ticket update test',
	priority: constants.ticketPriority.one,
	status: constants.ticketStatus.inProgress,
	reporter: 1,
	assignee: 2,
	createdAt: createdTicketBody.createdAt,
	updatedAt: Date.now(),
	save: jest.fn()
}

const savedUserObj = {
	userType: 'CUSTOMER',
	password: '!@#$567*(0',
	name: 'Test User',
	userId: 1,
	email: 'test@user.com',
	ticketsCreated: ['123'],
	ticketsAssigned: [],
	save: jest.fn()
}

beforeAll(() => {
	jest.spyOn(console, 'log').mockImplementation(jest.fn())
	jest.spyOn(console, 'debug').mockImplementation(jest.fn())
})

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
		expect(res.status).toHaveBeenCalledWith(201)
		expect(res.send).toHaveBeenCalledWith(
			expect.objectContaining({
				title: 'Test',
				description: 'Testing the ticket controller',
				priority: 1,
				status: 'OPEN',
				assignee: 2
			})
		)
	})

	it('Not able to create a ticket - Error', async () => {
		// when res.status === 500
		// res send message: {
		// 		message: 'Internal Server Error!'
		// }

		// External entities that we depend on
		// 1. req and res
		const req = mockRequest()
		const res = mockResponse()

		// 2. req.body and req.userId
		req.body = ticketRequestBody
		req.userId = 1

		// Mocking and spying User.findOne method
		const userSpy1 = jest
			.spyOn(User, 'findOne')
			.mockReturnValue(Promise.resolve(savedUserObj))

		const userSpy2 = jest.spyOn(User, 'find').mockImplementation(() => ({
			sort: jest.fn(() => ({
				limit: jest.fn(() => Promise.resolve([savedUserObj]))
			}))
		}))

		// Mocking and spying Ticket.create
		// This shoudl return an error
		const ticketSpy = jest
			.spyOn(Ticket, 'create')
			.mockImplementation((ticketsCreated) =>
				Promise.reject({ statusCode: 500, message: 'Internal Server Error!' })
			)

		// Mock the email client
		const clientSpy = jest
			.spyOn(client, 'post')
			.mockImplementation((uri, args, cb) => cb('Test', null))

		// Execution of the test
		try {
			await ticketController.createTicket(req, res)
		} catch (err) {
			const next = jest.fn()
			errorHandlerMiddleware(err, req, res, next)
		}

		// Validations
		expect(clientSpy).toHaveBeenCalled()
		expect(userSpy1).toHaveBeenCalled()
		expect(userSpy2).toHaveBeenCalled()
		expect(ticketSpy).toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.send).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Internal Server Error!'
			})
		)
	})
})

describe('Testing update ticket feature', () => {
	// Write a test for the happy flow ro updating an existing ticket
	it('unit test the ability to update a ticket successfully', async () => {
		// External entities that we depend on
		// 1. req, res
		const req = mockRequest()
		const res = mockResponse()

		req.params = {}
		req.params.id = '123'
		req.body = {
			title: 'Update Test',
			description: 'Ticket update test',
			priority: 1
		}

		// Mock Ticket.findOne
		const ticketSpy = jest
			.spyOn(Ticket, 'findOne')
			.mockImplementation((queryObj) => Promise.resolve(createdTicketBody))

		// Mock user.findOne
		const userSpy = jest
			.spyOn(User, 'findOne')
			.mockImplementation((queryObj) => Promise.resolve(savedUserObj))

		// Mock client.post
		const clientSpy = jest
			.spyOn(client, 'post')
			.mockImplementation((uri, args, cb) => cb('Test', null))

		// Execution of the test
		await ticketController.updateTicket(req, res)

		// Validations
		expect(clientSpy).toHaveBeenCalled()
		expect(userSpy).toHaveBeenCalled()
		expect(ticketSpy).toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(200)
	})
})
