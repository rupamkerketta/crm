// This file will have the setup for mongodb server
// which will be used for integration testing
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
let mongodbMem

// Method for connecting to the Database
module.exports.connect = async () => {
	mongodbMem = await MongoMemoryServer.create()
	const uri = mongodbMem.getUri()
	const mongooseOpts = {
		maxPoolSize: 10
	}
	await mongoose.connect(uri, mongooseOpts)
}

// Method for disconnecting and closing the Database
module.exports.closeDatabase = async () => {
	await mongoose.connection.dropDatabase()
	await mongoose.connection.close()
	if (mongodbMem) {
		await mongodbMem.stop()
	}
}

// Method to clear all the data in the Database
module.exports.clearDatabase = async () => {
	const collections = mongoose.connection.collections
	for (key in collections) {
		const collection = collections[key]

		// This will clear all the documents in a collection
		await collection.deleteMany()
	}
}
