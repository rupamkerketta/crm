const User = require('../../models/user.model')
const db = require('../db')
const jwt = require('jsonwebtoken')
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

	// Insert three test users in the Database
	await User.create({
		name: 'Admin Rick',
		userId: 'admin_rkc137',
		email: 'admin_rkc137@rickety.com',
		userType: 'ADMIN',
		password: '@dmin-sch-wifty',
		ticketsAssigned: [],
		ticketsCreated: [],
		userStatus: 'APPROVED'
	})

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

const apiEndpoint = '/api/v1/users'

describe('Testing the GET users endpoint', () => {
	// 1. JWT access token in the header
	const token = jwt.sign(
		{ id: 'admin_rkc137' },
		config.get('jwtConfig.secret'),
		{
			expiresIn: 600
		}
	)

	it('Should be able to successfully fetch all the users', async () => {
		const res = await request(app).get(apiEndpoint).set('x-access-token', token)

		expect(res.statusCode).toEqual(200)
	})

	it('Should be able to successfully fetch all the user of type ENGINEER', async () => {
		const res = await request(app)
			.get(`${apiEndpoint}?userType=ENGINEER`)
			.set('x-access-token', token)

		console.info(res.body.data[0].userType)

		expect(res.statusCode).toEqual(200)
		expect(res.body.nbHits).toEqual(1)
		expect(res.body.data[0].userType).toEqual('ENGINEER')
	})
})
