require('express-async-errors')
const config = require('config')

const app = require('./app')
const PORT = config.get('serverConfig.port')

const dbConnect = require('./db')
const startServer = () => {
	// Start the express server
	app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
}

dbConnect(startServer)
