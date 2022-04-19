import auth from './modules/auth'

export default {
  install(app) {
    app.directive('auth', auth)
  }
}
