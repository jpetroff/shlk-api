if (process.env.NODE_ENV === 'production') {
  module.exports = require('./credentials.production.json')
} else {
  module.exports = require('./credentials.development.json')
}