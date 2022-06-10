const { mockRequest, mockResponse } = require('../interceptor')
const User = require('../../models/user.model')
const userController = require('../../controllers/user.controller')

const userList = [
	{
		_id: '629ef9f62ca03b7cd8c4f0e3',
		user: 'Jack',
		email: 'jack@pirate.com',
		userId: 'admin',
		userType: 'ADMIN',
		userStatus: 'APPROVED',
		createdAt: '2022-06-07T07:10:46.860Z',
		updatedAt: '2022-06-07T07:10:46.861Z'
	},
	{
		_id: '629efcc7ab0b1d619b27c9d2',
		user: 'Eddie',
		email: 'eddie@griffin.com',
		userId: 'eddie101',
		userType: 'ENGINEER',
		userStatus: 'APPROVED',
		createdAt: '2022-06-07T07:22:47.181Z',
		updatedAt: '2022-06-07T07:22:47.181Z'
	},
	{
		_id: '629efcc7ab0b1d619b27c9d2',
		user: 'Dave',
		email: 'dave@chappelle.com',
		userId: 'dave911',
		userType: 'CUSTOMER',
		userStatus: 'APPROVED',
		createdAt: '2022-06-07T07:22:47.181+00:00',
		updatedAt: '2022-06-07T07:22:47.181+00:00'
	}
]

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
