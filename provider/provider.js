const express = require('express')
const cors = require('cors')
const moment = require('moment')
const bodyParser = require('body-parser')
const server = express()
const port = 8080 || process.env.API_PORT

server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')
  next()
})

// Get all animals
server.get('/provider', (req, res) => {
  const date = req.query.validDate

  res.json(
    {
      'test': 'NO',
      'validDate': moment(new Date(), moment.ISO_8601).format('YYYY-MM-DDTHH:mm:ssZ'),
      'count': 100
    }
  )
})

module.exports = {
  server
}
