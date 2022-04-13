
module.exports = {
  /**
   * 参数
   */
  args: require('minimist')(process.argv.slice(2)),
  /**
   * 根目录
   */
  rootPath: process.env.INIT_CWD
}
