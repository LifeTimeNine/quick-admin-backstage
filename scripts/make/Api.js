const fs = require('fs')
const { promises } = require('fs')
const { rootPath, args } = require('./Utils')

function Api() {
  const name = args._[0]

  this.getFileDir = function() {
    return `${rootPath}/src/apis/modules/`
  }

  this.getFileName = function() {
    if (!name) throw new Error('Please enter the name of the Api')
    return `${name}.js`
  }

  this.getFileContent = function() {
    const controller = name.toLocaleLowerCase()
    return `
import { get, post } from '@/utils/request'

export const nodes = {
  list: '${controller}/list',
  recycleList: '${controller}/recycleList',
  add: '${controller}/add',
  edit: '${controller}/edit',
  modifyStatus: '${controller}/modifyStatus',
  softDelete: '${controller}/softDelete',
  restore: '${controller}/restore',
  del: '${controller}/delete'
}

export const list = query => get(nodes.list, query)
export const recycleList = query => get(nodes.recycleList, query)
export const add = data => post(nodes.add, data)
export const edit = data => post(nodes.edit, data)
export const modifyStatus = data => post(nodes.modifyStatus, data)
export const softDelete = data => post(nodes.softDelete, data)
export const restore = data => post(nodes.restore, data)
export const del = data => post(nodes.del, data)
`
  }

  const importNodes = function() {
    const filePath = `${rootPath}/src/apis/nodes.js`
    let content = fs.readFileSync(filePath, { encoding: 'utf8' })
    content = content.replace(/import[\w\W]*'/g, res => {
      return res + `\r\nimport { nodes as ${name} } from './modules/${name}'`
    })
    content = content.replace(/export default {\s*([a-zA-Z][\w\W]*[a-zA-Z]|\s*)\s*}/, (res, $1) => {
      return `export default {${($1 ? '\r\n  ' + $1 + ',\r\n' : '\r\n') + '  ' + name}\r\n}`
    })
    fs.writeFileSync(filePath, content)
  }

  this.writeFile = async function() {
    await promises.access(this.getFileDir()).catch(() => {
      fs.mkdirSync(this.getFileDir(), {
        recursive: true
      })
    })
    const filePath = `${this.getFileDir()}${this.getFileName()}`
    fs.writeFileSync(filePath, this.getFileContent())
    importNodes()
    console.log(`${filePath} creating a successful`)
  }

  this.run = function() {
    const filePath = `${this.getFileDir()}${this.getFileName()}`
    fs.stat(filePath, (_err, stat) => {
      // if (stat.isFile()) throw new Error('The Api file already exists')
      this.writeFile()
    })
  }
}

module.exports = Api
