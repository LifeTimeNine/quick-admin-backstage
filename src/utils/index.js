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

/**
 * 根据键列表返回对象中的数据
 * @param {Object} obj
 * @param {Array} keys
 * @param {Function} 回调处理方法
 */
export function keysToObj(obj, keys, callback = null) {
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if (keys.includes(key)) {
      newObj[key] = obj[key]
      if (typeof callback === 'function') callback(key, obj[key])
    }
  })
  return newObj
}

