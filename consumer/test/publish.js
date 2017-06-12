const pact = require('@pact-foundation/pact-node')
const path = require('path')
const opts = {
  pactUrls: [path.resolve(__dirname, '../../pacts/our_little_consumer-our_provider.json')],
  pactBroker: 'https://test.pact.dius.com.au',
  pactBrokerUsername: 'dXfltyFMgNOFZAxr8io9wJ37iUpY42M',
  pactBrokerPassword: 'O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1',
  tags: ['prod', 'test'],
  consumerVersion: '1.0.0'
}

pact.publishPacts(opts)
  .then(() => {
    console.log('Pact contract publishing complete!')
    console.log('')
    console.log('Head over to https://test.pact.dius.com.au/ and login with')
    console.log('=> Username: dXfltyFMgNOFZAxr8io9wJ37iUpY42M')
    console.log('=> Password: O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1')
    console.log('to see your published contracts.')
  })
  .catch(e => {
    console.log('Pact contract publishing failed: ', e)
  })
