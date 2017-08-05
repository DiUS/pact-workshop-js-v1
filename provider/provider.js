const express = require('express')
const cors = require('cors')
const moment = require('moment')
const bodyParser = require('body-parser')
const server = express()
const port = 9123 || process.env.API_PORT

server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')
  next()
})

server.get('/provider', (req, res) => {
  const validDate = req.query.validDate
  const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/

  if (!validDate) {
    res.status(400)
    res.json({error: 'validDate is required'});
  } else if (!moment(validDate, moment.ISO_8601).isValid()) {
    res.status(400)
    res.json({error: `'${validDate}' is not a date`})
  }  else {
    res.json({
      'test': 'NO',
      'validDate': moment(new Date(), moment.ISO_8601).format('YYYY-MM-DDTHH:mm:ssZ'),
      'count': 100
    })
  }
})

module.exports = {
  server
}
