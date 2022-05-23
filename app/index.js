const express = require('express')
const errorHandlerMiddleware = require('../middlewares/error-handler')
const notFoundMiddleware = require('../middlewares/not-found')
const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
require('../routes')(app)

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

module.exports = app
