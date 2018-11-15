const express = require('express')
const cors = require('cors')
const moment = require('moment')
const bodyParser = require('body-parser')
const server = express()

server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use((_, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')
  next()
})

const dataStore = {
  count: 1000,
}

server.get('/provider', (req, res) => {
  const validDate = req.query.validDate

  if (!validDate) {
    res.status(400)
    res.json({ error: 'validDate is required' })
  } else if (!moment(validDate, moment.ISO_8601).isValid()) {
    res.status(400)
    res.json({ error: `'${validDate}' is not a date` })
  } else {
    if (dataStore.count > 0) {
      res.json({
        test: 'NO',
        validDate: moment(new Date(), moment.ISO_8601).format(
          'YYYY-MM-DDTHH:mm:ssZ'
        ),
        count: dataStore.count,
      })
    } else {
      res.status(404)
      res.send()
    }
  }
})

module.exports = {
  server,
  dataStore,
}
