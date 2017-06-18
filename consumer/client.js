const request = require('superagent')
const API_HOST = process.env.API_HOST || 'http://localhost'
const API_PORT = process.env.API_PORT || 8080
const moment = require('moment')
const API_ENDPOINT = `${API_HOST}:${API_PORT}`

// Fetch provider data
const fetchProviderData = (submissionDate) => {
  return request
    .get(`${API_ENDPOINT}/provider`)
    .query({validDate: submissionDate})
    .then((res) => {
      // Validate date
      if (res.body.validDate.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/)) {
        return {
          value: 100 / res.body.count,
          date: moment(res.body.validDate, moment.ISO_8601).format('YYYY-MM-DDTHH:mm:ssZ')
        }
      } else {
        return Promise.reject(new Error('Invalid date format in response'))
      }
    })
}

module.exports = {
  fetchProviderData
}
