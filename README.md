# Example JS project for the Pact workshop

This project has 2 components, a consumer project and a service provider as an Express API.

## Step 1 - Simple Consumer calling Provider

Given we have a client that needs to make a HTTP GET request to a provider service, and requires a response in JSON format.

The consumer client is quite simple and looks like this

*consumer/consumer.js:*

```js
request
  .get(`${API_ENDPOINT}/provider`)
  .query({validDate: new Date().toISOString()})
  .then((res) => {
    console.log(res.body)
  })
```

and the express provider resource

*provider/provider.js:*

```js
server.get('/provider/:', (req, res) => {
  const date = req.query.validDate

  res.json(
    {
      'test': 'NO',
      'validDate': new Date().toISOString(),
      'count': 100
    }
  )
})
```

This providers expects a `validDate` parameter in HTTP date format, and then return some simple json back.

Start the provider in a separate terminal:

```
$ node provider/provider.js
Provider Service listening on http://localhost:8080
```

Running the client works nicely.

```
$ node consumer/consumer.js
{ test: 'NO', validDate: '2017-06-12T06:25:42.392Z', count: 100 }
```


## Step 2 - Client Tested but integration fails

Now lets separate the API client (collaborator) that uses the data it gets back from the provider into its own module. Here is the updated client method that uses the returned data:

*consumer/client.js:*

```js
const fetchProviderData = () => {
  return request
    .get(`${API_ENDPOINT}/provider`)
    .query({validDate: new Date().toISOString()})
    .then((res) => {
      return {
        value: 100 / res.body.count,
        date: res.body.date
      }
    })
}
```

The consumer is now a lot simpler:

*consumer/consumer.js:*

```js
const client = require('./client')

client.fetchProviderData().then(response => console.log(response))
```

Let's now test our updated client.

*consumer/test/consumer.spec.js:*

```js
describe('Consumer', () => {
  describe('when a call to the Provider is made', () => {
    const date = '2013-08-16T15:31:20+10:00'
    nock(API_HOST)
      .get('/provider')
      .query({validDate: /.*/})
      .reply(200, {
        test: 'NO',
        date: date,
        count: 1000
      })

    it('can process the JSON payload from the provider', done => {
      const {fetchProviderData} = require('../consumer')
      const response = fetchProviderData()

      expect(response).to.eventually.have.property('count', 1000)
      expect(response).to.eventually.have.property('date', date).notify(done)
    })
  })
})
```

Let's run this spec and see it all pass:

```
$ npm run test:consumer

> pact-workshop-js@1.0.0 test:consumer /Users/mfellows/development/public/pact-workshop-js
> mocha consumer/test/consumer.spec.js



  Consumer
    when a call to the Provider is made
      ✓ can process the JSON payload from the provider


  1 passing (24ms)

```

However, there is a problem with this integration point. Running the actual client against any of the providers results in problem!

```
$ node consumer/consumer.js
{ count: 100, date: undefined }
```

The provider returns a `validDate` while the consumer is
trying to use `date`, which will blow up when run for real even with the tests all passing. Here is where Pact comes in.
