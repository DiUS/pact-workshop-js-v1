const chai = require('chai')
const path = require('path')
const chaiAsPromised = require('chai-as-promised')
const Pact = require('@pact-foundation/pact').Pact
const { somethingLike: like, term } = require('@pact-foundation/pact').Matchers
const expect = chai.expect
const API_PORT = process.env.API_PORT || 9123
const { fetchProviderData } = require('../client')
chai.use(chaiAsPromised)

// Configure and import consumer API
// Note that we update the API endpoint to point at the Mock Service
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN'

const provider = new Pact({
  consumer: 'Our Little Consumer',
  provider: 'Our Provider',
  port: API_PORT,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: LOG_LEVEL,
  spec: 2,
})
const date = '2013-08-16T15:31:20+10:00'
const submissionDate = new Date().toISOString()

describe('Pact with Our Provider', () => {
  describe('given data count > 0', () => {
    describe('when a call to the Provider is made', () => {
      before(() => {
        return provider.setup().then(() => {
          return provider.addInteraction({
            uponReceiving: 'a request for JSON data',
            withRequest: {
              method: 'GET',
              path: '/provider',
              query: {
                validDate: submissionDate,
              },
            },
            willRespondWith: {
              status: 200,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
              body: {
                test: 'NO',
                validDate: term({
                  generate: date,
                  matcher:
                    '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\+|\\-)\\d{2}:\\d{2}',
                }),
                count: like(1000),
              },
            },
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
