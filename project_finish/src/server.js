const express = require('express')
const path = require('path')
const morgan = require('morgan')
const session = require('express-session')
require('dotenv').config()

// initializations
const app = express()
require('./database')

// Importing routes
const Routes = require('./routes/index')

// settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // procure que sea una cadena larga y compleja
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// routes
app.use('/', Routes)

// static files
app.use('/public', express.static('public'))

// start the server
app.listen(3000, () => {
  console.log(`Server on port ${app.get('port')}`)
})
