const verifier = require('pact').Verifier
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)

const { server, dataStore } = require('../provider.js')

// Append some extra endpoints to mutate current state of the API
// NOTE: this requirement will be soon removed!
server.get('/states', (req, res) => {
  res.json({
    "Our Little Consumer": ['date count == 0', 'date count > 0']
  })
})

// Set the current state
server.post('/setup', (req, res) => {
  switch (req.body.state) {
    case 'date count == 0':
      dataStore.count = 0
      break
    default:
      dataStore.count = 1000
  }

  res.end()
})

server.listen(8081, () => {
  console.log('Animal Profile Service listening on http://localhost:8081')
})

// Verify that the provider meets all consumer expectations
describe('Pact Verification', () => {
  it('should validate the expectations of Our Little Consumer', function () { // lexical binding required here for timeout
    this.timeout(10000)

    let opts = {
      provider: 'Our Provider',
      providerBaseUrl: 'http://localhost:8081',
      providerStatesUrl: 'http://localhost:8081/states',
      providerStatesSetupUrl: 'http://localhost:8081/setup',
      pactUrls: [path.resolve(process.cwd(), './pacts/our_little_consumer-our_provider.json')]
    }

    return verifier.verifyProvider(opts)
      .then(output => {
        console.log('Pact Verification Complete!')
        console.log(output)
      })
  })
})
