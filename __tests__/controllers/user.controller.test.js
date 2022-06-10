const { mockRequest, mockResponse } = require('../interceptor')
const User = require('../../models/user.model')
const userController = require('../../controllers/user.controller')
const fs = require('fs')
const path = require('path')

let userList

beforeAll(() => {
	jest.spyOn(console, 'log').mockImplementation(() => {})
	jest.spyOn(console, 'debug').mockImplementation(() => {})

	const data = fs.readFileSync(
		path.resolve(__dirname, '../users-test-data.json'),
		'utf-8'
	)
	console.log(__dirname)
	userList = JSON.parse(data)
})

describe('Testing find feature of userController', () => {
	it('unit test the ability to successfully find all the users', async () => {
		// External entities that we depend on
		// 1. req, res
		const req = mockRequest()
		const res = mockResponse()

		req.query = {}

		const userSpy = jest.spyOn(User, 'find').mockImplementation(() => {
			return Promise.resolve(userList)
		})

		await userController.findAll(req, res)
		expect(userSpy).toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(200)
	})

	it('unit test the ability to successfully find a user with the given id', async () => {
		// External entities that we depend on
		// 1. req, res
		const req = mockRequest()
		const res = mockResponse()

		req.params = { userId: '629efcc7ab0b1d619b27c9d2' }

		const userSpy = jest.spyOn(User, 'findOne').mockImplementation(() => {
			for (const user of userList) {
				if (user._id === req.params.userId) {
					return Promise.resolve(userList[2])
				}
			}
		})

		await userController.findUserById(req, res)
		expect(userSpy).toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(200)
	})

	it('unit test the ability send correct response if the user does not exist', async () => {
		// External entities that we depend on
		// 1. req, res
		const req = mockRequest()
		const res = mockResponse()

		req.params = { userId: '629efcc7ab0b1d619b27c9d3' }

		const userSpy = jest.spyOn(User, 'findOne').mockImplementation(() => {
			for (const user of userList) {
				if (user._id === req.params.userId) {
					return Promise.resolve(userList[2])
				} else {
					return Promise.resolve(null)
				}
			}
		})

		await userController.findUserById(req, res)
		expect(userSpy).toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(404)
	})
})

describe('Testing update feature of userController', () => {
	it('unit test the ability to successfully update a specific user', async () => {
		// External entities that we depend on
		// 1. req, res
		const req = mockRequest()
		const res = mockResponse()

		req.params = { userId: userList[2]._id }
		req.body = { name: 'Jane', userType: 'ENGINEER', userStatus: 'APPROVED' }

		// Mock User.findOne
		const userSpy1 = jest.spyOn(User, 'findOne').mockImplementation(() => {
			for (const user of userList) {
				if (user._id === req.params.userId) {
					return Promise.resolve(userList[2])
				} else {
					return Promise.resolve(null)
				}
			}
		})

		// Mock User.findOneAndUpdate
		const userSpy2 = jest
			.spyOn(User, 'findOneAndUpdate')
			.mockImplementation((arg1, arg2) => {
				const user = userList[2]
				user.name = req.body.name
				user.userType = req.body.userType
				user.userStatus = req.body.userStatus

				return Promise.resolve(user)
			})

		await userController.updateUser(req, res)

		expect(userSpy1).toHaveBeenCalled()
		expect(userSpy2).toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(200)
	})
})
