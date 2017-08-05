# Example JS project for the Pact workshop

This project has 2 components, a consumer project and a service provider as an Express API.

## Step 1 - Simple Consumer calling Provider

Given we have a client that needs to make a HTTP GET request to a provider service, and requires a response in JSON format.

![Simple Consumer](diagrams/workshop_step1.png)

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

![Sequence Diagram](diagrams/sequence_diagram.png)

Start the provider in a separate terminal:

```
$ node provider/provider.js
Provider Service listening on http://localhost:9123
```

Running the client works nicely.

```
$ node consumer/consumer.js
{ test: 'NO', validDate: '2017-06-12T06:25:42.392Z', count: 100 }
```
