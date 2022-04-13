const Api = require('./Api')
const Router = require('./Router')
const args = require('minimist')(process.argv.slice(2))

switch (args.action) {
  case 'api':
    new Api().run()
    break
  case 'router':
    new Router().run()
    break
}
