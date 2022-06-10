// This file will have the logic to test the ticket route

const User = require('../../models/user.model')
const db = require('../db')
const jwt = require('jsonwebtoken')
const client = require('../../utils/notification-service-client').client
const request = require('supertest')
const config = require('config')
const app = require('../../app')

beforeAll(async () => {
	jest.spyOn(console, 'log').mockImplementation(() => {})
	jest.spyOn(console, 'debug').mockImplementation(() => {})

	// Connect to the testing database
	await db.connect()

	// This will be executed before all the tests
	await db.clearDatabase()

	// Insert two test user in the Database
	await User.create({
		name: 'Rick',
		userId: 'rkc137',
		email: 'rkc137@rickety.com',
		userType: 'ENGINEER',
		password: 'sch-wifty',
		ticketsAssigned: [],
		ticketsCreated: [],
		userStatus: 'APPROVED'
	})

	await User.create({
		name: 'Morty',
		userId: 'morty',
		email: 'morty@evil.com',
		userType: 'CUSTOMER',
		ticketsAssigned: [],
		ticketsCreated: [],
		password: '3vil_morty',
		userStatus: 'APPROVED'
	})

	// console.log(await User.findOne({ userId: 'vpk17' }))
})

afterAll(async () => {
	db.closeDatabase()
})

const apiEndpoint = '/api/v1/tickets'
const ticketRequestBody = {
	title: 'Test',
	description: 'Integration Test',
	priority: 1
}

describe('Testing the POST ticket creation endpoint', () => {
	// 1. Request body
	// 2. JWT Access token in the header
	// 3. POST call
	const token = jwt.sign({ id: 'morty' }, config.get('jwtConfig.secret'), {
		expiresIn: 600
	})

	// Mock the notification service
	const spyClient = jest
		.spyOn(client, 'post')
		.mockImplementation((uri, args, cb) => cb('Integration Testing', null))

	it('Should be able to successfully create a ticket', async () => {
		const res = await request(app)
			.post(apiEndpoint)
			.send(ticketRequestBody)
			.set('x-access-token', token)

		expect(spyClient).toHaveBeenCalled()
		expect(res.statusCode).toEqual(201)
	})
})

describe('Testing the PUT ticket updation endpoint', () => {
	const token = jwt.sign({ id: 'morty' }, config.get('jwtConfig.secret'), {
		expiresIn: 600
	})

	// Mock the notification service
	const spyClient = jest
		.spyOn(client, 'post')
		.mockImplementation((uri, args, cb) => cb('Integration Testing', null))

	it('Should be able to successfully update a ticket', async () => {
		const res1 = await request(app)
			.post(apiEndpoint)
			.send(ticketRequestBody)
			.set('x-access-token', token)
		const ticketId = res1.body.id

		const res2 = await request(app)
			.patch(`${apiEndpoint}/${ticketId}`)
			.send({
				title: 'Updated Ticket',
				description: 'Updated Ticket Description'
			})
			.set('x-access-token', token)

		expect(res2.statusCode).toEqual(200)
	})
})
