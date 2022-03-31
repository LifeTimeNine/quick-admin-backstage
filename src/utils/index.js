/**
 * 判断是否是外部连接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 计算百分比
 * @param {float} current 当前值
 * @param {float} total 总和
 * @param {boolean} showSymbol 是否显示百分号
 */
export function percentage(current, total, showSymbol = true) {
  if (showSymbol) {
    return Math.round((current / total) * 10000) / 100 + '%'
  } else {
    return Math.round((current / total) * 10000) / 100
  }
}
