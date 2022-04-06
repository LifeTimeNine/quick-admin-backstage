const Api = require('./Api')
const args = require('minimist')(process.argv.slice(2))

switch (args.action) {
  case 'api':
    new Api().run()
    break
}
