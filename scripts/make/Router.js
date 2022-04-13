const fs = require('fs')
const { promises } = require('fs')
const { rootPath, args } = require('../Utils')

function Router() {
  const name = args._[0]

  this.getFileDir = function() {
    return `${rootPath}/src/router/modules/`
  }

  this.getFileName = function() {
    if (!name) throw new Error('Please enter the name of the Api')
    return `${name}.js`
  }

  this.getFileContent = function() {
    return `
export default {
  path: '/${name}',
  component: () => import('@/layout'),
  children: []
}
`
  }

  const importNodes = function() {
    const filePath = `${rootPath}/src/router/index.js`
    let content = fs.readFileSync(filePath, { encoding: 'utf8' })
    content = content.replace(/import[\w\W]*from\s'[^\s\r\n]*'/g, res => {
      return res + `\r\nimport ${name} from './modules/${name}'`
    })
    content = content.replace(/{[^{]+path: '\/\*'[^}]+}/g, (res) => {
      return `${name},\r\n  ${res}`
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
      if (stat && stat.isFile()) throw new Error('The Api file already exists')
      this.writeFile()
    })
  }
}

module.exports = Router
