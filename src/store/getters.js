export default {
  settings: state => state.settings,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  menuActive: state => state.app.menuActive,
  accessToken: state => state.user.token,
  menus: state => state.user.menus,
  nodes: state => state.user.nodes,
  menuPaths: state => state.user.menuPaths,
  userInfo: state => state.user.userInfo
}
