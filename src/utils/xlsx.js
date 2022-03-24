import * as XLSX from 'xlsx'

function dateNum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

export function Workbook() {
  this.SheetNames = [];
  this.Sheets = {};
  /**
   * 添加 Sheet
   * @param {string} name
   * @param {WorkSheet} sheet
   */
  this.appendSheet = function(name, sheet) {
    sheet.buildRange()
    this.SheetNames.push(name)
    this.Sheets[name] = sheet
  }
}

export function WorkSheet() {
  var range = {
    s: { r: 0, c: 0 },
    e: { r: 0, c: 0 }
  }
  // 列属性
  this['!cols'] = []
  this['!fullref'] = null
  // 数据范围
  this['!ref'] = null
  // 行属性
  this['!rows'] = []
  // 合并单元格
  this['!merges'] = []
  // 页边距
  this['!margins'] = {}
  this.setCols = function(value) {
    this['!cols'] = value
  }
  this.setFullRef = function(value) {
    this["!fullref"] = value
  }
  this.setRef = function(value) {
    this['!ref'] = value
  }
  this.setRows = function(value) {
    this['!rows'] = value
  }
  this.appendMerge = function(value) {
    this['!merges'] = value
  }
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
    this[XLSX.utils.encode_cell({c, r})] = cell
    if (c > range.e.c) range.e.c = c
    if (r > range.e.r) range.e.r = r
  }
  this.buildRange = function() {
    this['!ref'] = XLSX.utils.encode_range(range)
  }
  this.getRange = function() {
    return range
  }
}

export function writeFile(workbook, filename, {
  type = 'binary',
  bookSST = false,
  bookType = 'xlsx'
} = {}) {
  XLSX.writeFile(workbook, filename, { type, bookSST, bookType })
}
