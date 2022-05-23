const mongoose = require('mongoose')
const config = require('config')
const bcrypt = require('bcryptjs/dist/bcrypt')
const User = require('../models/user.model')

// Database connection string
const dbUrl = config.get('dbConfig.url')

const init = async () => {
	const user = await User.findOne({ userId: 'admin' })

	if (user) {
		return
	} else {
		// create a new admin user
		const user = await User.create({
			name: 'Rupam',
			userId: 'admin',
			email: 'dev.kerkettarupam@gmail.com',
			userType: 'ADMIN',
			password: bcrypt.hashSync('w3lc0m3</>', 8)
		})
		console.log('admin user is created')
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
