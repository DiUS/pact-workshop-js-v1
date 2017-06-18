const client = require('./client')

client.fetchProviderData()
  .then(response => {
  console.log(response)
    return response
  })
  .catch((error) => {
    console.error(error)
    return error
  })
