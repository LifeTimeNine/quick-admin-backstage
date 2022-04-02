import * as XLSX from 'xlsx'

function dateNum(v, date1904) {
  if (date1904) v += 1462
  var epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

/**
 * Book 对象
 */
export function WorkBook() {
  this.SheetNames = []
  this.Sheets = {}
  /**
   * 添加 Sheet
   * @param {WorkSheet} sheet
   */
  this.appendSheet = function(sheet) {
    sheet.buildRange()
    this.SheetNames.push(sheet.name)
    this.Sheets[sheet.name] = sheet
  }
}

/**
 * 工作簿对象
 * @param {String} name 名称
 * @param {XLSX.WorkSheet} workSheet
 */
export function WorkSheet(name = '', workSheet = null) {
  if (workSheet !== null) {
    Object.setPrototypeOf(this, workSheet)
  }

  this.name = name
  var range = {
    s: { r: 0, c: 0 },
    e: { r: 0, c: 0 }
  }
  // 列属性
  if (!this['!cols']) this['!cols'] = []
  if (!this['fullref']) this['!fullref'] = null
  // 数据范围
  if (!this['!ref']) this['!ref'] = null
  // 行属性
  if (!this['!rows']) this['!rows'] = []
  // 合并单元格
  if (!this['!merges']) this['!merges'] = []
  // 页边距
  if (!this['!margins']) this['!margins'] = {}

  this.setMargin = function({
    left,
    right,
    top,
    bottom,
    header,
    footer
  } = {}) {
    this['!margins'] = { left, right, top, bottom, header, footer }
  }

  this.appendCell = function(r, c, value) {
    var cell = {
      v: value
    }
    if (typeof value === 'number') {
      cell.t = 'n'
    } else if (typeof value === 'boolean') {
      cell.t = 'b'
    } else if (value instanceof Date) {
      cell.t = 'n'
      cell.z = XLSX.SSF._table[14]
      cell.v = dateNum(value)
    } else {
      cell.t = 's'
    }
    this[XLSX.utils.encode_cell({ c, r })] = cell
    if (c > range.e.c) range.e.c = c
    if (r > range.e.r) range.e.r = r
  }
  this.getCell = function(r, c) {
    const cell = this[XLSX.utils.encode_cell({ c, r })]
    return cell ? cell.v : undefined
  }
  this.getData = function() {
    if (!this['!ref']) return []
    const range = XLSX.utils.decode_range(this['!ref'])
    var result = []
    for (var r = range.s.r; r <= range.e.r; ++r) {
      if (!result[r]) result[r] = []
      for (var c = range.s.c; c <= range.e.c; ++c) {
        result[r][c] = this.getCell(r, c)
      }
    }
    return result
  }
  this.setData = function(data) {
    for (var r of Object.keys(data)) {
      for (var c of Object.keys(data[r])) {
        this.appendCell(parseInt(r), parseInt(c), data[r][c])
      }
    }
  }
  this.buildRange = function() {
    this['!ref'] = XLSX.utils.encode_range(range)
  }
  this.getRange = function() {
    return range
  }
}

/**
 * 写入文件
 * @param {WorkSheet} workbook Book对象
 * @param {String} filename 文件名称
 * @param {Object} 参数
 */
export function writeFile(workbook, filename, {
  type = 'binary',
  bookSST = false,
  bookType = 'xlsx'
} = {}) {
  XLSX.writeFile(workbook, filename, { type, bookSST, bookType })
}

/**
 * 读取文件
 * @param {File} file 文件对象
 * @returns Promise
 */
export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const workbook = XLSX.read(e.target.result, { type: 'array' })
      const data = workbook.SheetNames.map(sheetName => {
        return new WorkSheet(sheetName, workbook.Sheets[sheetName])
      })
      resolve(data)
    }
    reader.readAsArrayBuffer(file)
  })
}
