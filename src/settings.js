
module.exports = {
  /**
   * @type {string}
   * @description 系统名称
   */
  system_name: 'QuickAdmin',
  /**
   * @type {string}
   * @description 请求应用名称
   */
  appName: 'admin',
  /**
   * @type {Array}
   * @description 不需要验证Token的页面地址
   */
  whitePaths: ['/404', '/login'],
  /**
   * @type {Array}
   * @description 不需要验证节点权限的页面地址
   */
  commonPaths: ['/dashboard'],
  /**
   * @type {boolean} true | false
   * @description 是否修复标题
   */
  fixedHeader: false,

  /**
  * @type {boolean} true | false
  * @description 是否显示侧边栏Login
  */
  sidebarLogo: false
}
