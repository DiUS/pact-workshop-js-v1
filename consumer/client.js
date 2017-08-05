const request = require('superagent')
const API_HOST = process.env.API_HOST || 'http://localhost'
const API_PORT = process.env.API_PORT || 9123
const API_ENDPOINT = `${API_HOST}:${API_PORT}`

// Fetch provider data
const fetchProviderData = () => {
  return request
    .get(`${API_ENDPOINT}/provider`)
    .query({ validDate: new Date().toISOString() })
    .then((res) => {
      return {
        count: 100 / res.body.count,
        date: res.body.date
      }
    })
}

module.exports = {
  fetchProviderData
}
