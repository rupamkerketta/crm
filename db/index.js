const mongoose = require('mongoose')
const config = require('config')
const bcrypt = require('bcryptjs/dist/bcrypt')
const User = require('../models/user.model')
const { isEmail } = require('validator')

// Database connection string
const dbUrl = config.get('dbConfig.url')

const init = async () => {
	const user = await User.findOne({ userId: 'admin' })

	if (user) {
		return
	} else {
		// create a new admin user
		const adminUser = await User.findOne({ userId: 'admin' })
		if (
			!adminUser &&
			config.has('adminConfig.email') &&
			isEmail(config.get('adminConfig.email')) &&
			config.has('adminConfig.password')
		) {
			await User.create({
				name: 'Rupam',
				userId: 'admin',
				email: config.get('adminConfig.email'),
				userType: 'ADMIN',
				password: bcrypt.hashSync(config.get('adminConfig.password'), 8)
			})
			console.log('admin user is created')
		}
	}
}

const connect = async (app) => {
	try {
		await mongoose.connect(dbUrl)
		console.log('[mongodb] Connected to the database successfully!')
		app()
		init()
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}

module.exports = connect
