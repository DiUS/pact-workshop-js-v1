const { server } = require('./provider.js')
const port = 8080 || process.env.API_PORT

server.listen(port, () => {
  console.log(`Provider Service listening on http://localhost:${port}`)
})
