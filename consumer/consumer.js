const client = require('./client')

client.fetchProviderData().then(response => {
  console.log(response)
}, error => {
  console.error(error)
})
