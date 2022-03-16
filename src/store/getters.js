export default {
  config: state => state.app.config,
  sidebarOpened: state => state.app.sidebarOpened,
  menuActive: state => state.app.menuActive,
  accessToken: state => state.user.token,
  menus: state => state.user.menus,
  nodes: state => state.user.nodes,
  menuPaths: state => state.user.menuPaths,
  userInfo: state => state.user.userInfo
}
