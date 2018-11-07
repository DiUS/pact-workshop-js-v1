const express = require('express')
const cors = require('cors')
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
  const date = req.query.validDate

  res.json({
    test: 'NO',
    validDate: new Date().toISOString(),
    count: 100,
  })
})

server.listen(port, () => {
  console.log(`Provider Service listening on http://localhost:${port}`)
})
