const chai = require('chai')
const path = require('path')
const chaiAsPromised = require('chai-as-promised')
const pact = require('pact')
const expect = chai.expect
const API_PORT = process.env.API_PORT || 9123
const {
  fetchProviderData
} = require('../client')
chai.use(chaiAsPromised)

// Configure and import consumer API
// Note that we update the API endpoint to point at the Mock Service
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN'

const provider = pact({
  consumer: 'Our Little Consumer',
  provider: 'Our Provider',
  port: API_PORT,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: LOG_LEVEL,
  spec: 2
})
const date = '2013-08-16T15:31:20+10:00'
const submissionDate = new Date().toISOString()
const expectedBody = {
  test: 'NO',
  date: date,
  count: 1000
}

describe('Pact with Our Provider', () => {
  describe('given data count > 0', () => {
    describe('when a call to the Provider is made', () => {
      before(() => {
        return provider.setup()
          .then(() => {
            provider.addInteraction({
              uponReceiving: 'a request for JSON data',
              withRequest: {
                method: 'GET',
                path: '/provider',
                query: {
                  validDate: submissionDate
                }
              },
              willRespondWith: {
                status: 200,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                },
                body: expectedBody
              }
            })
          })
      })

      it('can process the JSON payload from the provider', () => {
        const response = fetchProviderData(submissionDate)

        return expect(response).to.eventually.have.property('count', 0.1)
      })

      it('should validate the interactions and create a contract', () => {
        return provider.verify()
      })
    })

    // Write pact files to file
    after(() => {
      return provider.finalize()
    })
  })
})
