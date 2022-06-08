if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

module.exports = {
	serverConfig: {
		port: process.env.PORT
	},
	dbConfig: {
		url: process.env.DB_URL
	},
	jwtConfig: {
		secret: process.env.JWT_SECRET
	},
	adminConfig: {
		name: process.env.ADMIN_NAME,
		email: process.env.ADMIN_EMAIL,
		password: process.env.ADMIN_PASSWORD
	}
}
