const verifier = require('pact').Verifier
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)

const { server } = require('../provider.js')

server.listen(8081, () => {
  console.log('Provider service listening on http://localhost:8081')
})

// Verify that the provider meets all consumer expectations
describe('Pact Verification', () => {
  it('should validate the expectations of Our Little Consumer', function () { // lexical binding required here for timeout
    this.timeout(10000)

    let opts = {
      provider: 'Our Provider',
      providerBaseUrl: 'http://localhost:8081',
      pactUrls: [path.resolve(process.cwd(), './pacts/our_little_consumer-our_provider.json')]
    }

    return verifier.verifyProvider(opts)
      .then(output => {
        console.log('Pact Verification Complete!')
        console.log(output)
      })
  })
})
