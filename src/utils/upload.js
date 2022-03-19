import SparkMd5 from 'spark-md5'
import nodes from '@/nodes'
import { $post } from '@/utils/request'
import Axios from 'axios'

const Upload = function(options = {}) {
  // 异步上传
  this.async = typeof options.async === 'boolean' ? options.async : true
  // 最大任务数(只有异步的切片上传生效)
  this.maxTaskNum = options.maxTaskNum ? parseInt(options.maxTaskNum) : 8
  const slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  // 计算文件md5之前的回调
  var md5BeforeCallback
  // 计算文件md5进度回调
  var md5ProgressCallback
  // 计算文件md5之后的回调
  var md5AfterCallback
  // 文件上传之前的回调
  var beforeCallback
  // 上传文件进度回调
  var progressCallback
  // 文件上传之后的回调
  var afterCallback
  this.onMd5Before = function(callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback is not a function')
    }
    md5BeforeCallback = callback
    return this
  }
  this.onMd5Progress = function(callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback is not a function')
    }
    md5ProgressCallback = callback
    return this
  }
  this.onMd5After = function(callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback is not a function')
    }
    md5AfterCallback = callback
    return this
  }
  this.onBefore = function(callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback is not a function')
    }
    beforeCallback = callback
    return this
  }
  this.onProgress = function(callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback is not a function')
    }
    progressCallback = callback
    return this
  }
  this.onAfter = function(callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback is not a function')
    }
    afterCallback = callback
    return this
  }
  // 调用回调函数
  var callback = function(callback, args = []) {
    if (callback) {
      return callback(...args)
    }
  }
  // key-value转对象
  var keyValueToObj = function(keyValue, callback = null) {
    var obj = {}
    keyValue.forEach(item => {
      if (typeof callback === 'function' && callback(item.key, item.value) === false) return
      obj[item.key] = item.value
    })
    return obj
  }
  // key-value转FormData
  var keyValueToFormData = function(keyValue, callback = null) {
    var formdata = new FormData()
    keyValue.forEach(item => {
      if (typeof callback === 'function' && callback(item.key, item.value) === false) return
      formdata.append(item.key, item.value)
    })
    return formdata
  }
  // 计算文件md5
  var fileMd5 = function(file) {
    // 块大小 2M
    var chunkSize = 1024 * 1024 * 5
    // 块数量
    var chunkNum = Math.ceil(file.size / chunkSize)
    // 当前块
    var currentChunk = 1
    var spark = new SparkMd5.ArrayBuffer()
    var fileReader = new FileReader()
    callback(md5BeforeCallback)
    return new Promise(function(resolve, reject) {
      var nextFunc = function() {
        var start = (currentChunk - 1) * chunkSize
        var end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(slice.call(file, start, end))
      }
      fileReader.onload = function(e) {
        spark.append(e.target.result)
        callback(md5ProgressCallback, [currentChunk >= chunkNum ? file.size : currentChunk * chunkSize, file.size, file])
        if (currentChunk >= chunkNum) {
          var md5 = spark.end()
          callback(md5AfterCallback)
          resolve(md5)
          return
        }
        currentChunk++
        nextFunc()
      }
      fileReader.onerror = function() {
        reject()
      }
      nextFunc()
    })
  }
  // 上传
  this.save = file => {
    if (file instanceof File === false) {
      throw new Error('The first argument should be a File')
    }
    return new Promise((resolve, reject) => {
      fileMd5(file).then(md5 => {
        callback(beforeCallback)
        $post(nodes.upload.info, {
          fileName: file.name,
          fileMd5: md5
        }).then(data => {
          var { options, url } = data.map
          if (!options) {
            resolve(url)
          } else {
            var body = keyValueToFormData(options.body)
            body.append(options.file_key, file)
            Axios.request({
              url: options.server,
              method: options.method,
              headers: keyValueToObj(options.header),
              data: body,
              onUploadProgress: function(progressEvent) {
                callback(progressCallback, [progressEvent.loaded, progressEvent.total])
              }
            }).then(response => {
              if (response.status === 200) {
                callback(afterCallback, [url])
                resolve(url)
              }
            }).catch(() => {
              reject()
            })
          }
        }).catch(() => {
          reject()
        })
      }).catch(() => {
        reject()
      })
    })
  }
  // 切片上传
  this.partSave = file => {
    if (file instanceof File === false) {
      throw new Error('The first argument should be a File')
    }
    return new Promise((resolve, reject) => {
      fileMd5(file).then(md5 => {
        callback(beforeCallback)
        $post(nodes.upload.partInfo, {
          fileName: file.name,
          fileMd5: md5
        }).then(data => {
          var { options, url } = data.map
          if (!options) {
            resolve(url)
          } else {
            // 单个切片大小
            var partSize = Math.floor(options.part_size) * 1024 * 1204
            // 上传ID
            var uploadId = options.upload_id
            // 切片数量
            var partNum = Math.ceil(file.size / partSize)
            // 已申请切片数量
            var applyNum = 0
            // 切片参数列表
            var partOptions = []
            // 已完成切片信息
            var completePart = {}
            // 正在进行的上传任务数
            var taskNum = 0
            // 异常状态
            var errorStatus = false
            // 获取参数的任务数量
            var getOptionsTaskNum = 0
            var nextFunc = () => {
              if (errorStatus) return
              if (taskNum >= this.maxTaskNum) return
              if (partOptions.length <= 4 && applyNum < partNum && getOptionsTaskNum === 0) {
                var startNumber = applyNum + 1
                var endNUmber = startNumber + 10 >= partNum ? partNum + 1 : startNumber + 10
                $post(nodes.upload.partOptions, {
                  fileName: file.name,
                  fileMd5: md5,
                  uploadId,
                  partNumbers: Array.from({ length: endNUmber - startNumber }, (v, k) => startNumber + k).join(',')
                }).then(data => {
                  data.list.forEach(item => {
                    partOptions.push(item)
                    applyNum++
                  })
                  getOptionsTaskNum--
                  nextFunc()
                }).catch(e => {
                  errorStatus = true
                  reject(e)
                })
                getOptionsTaskNum++
              }
              if (!this.async && taskNum >= 1) return
              if (partOptions.length > 0) {
                var option = partOptions.shift()
                var start = (option.part_number - 1) * partSize
                var end = start + partSize >= file.size ? file.size : start + partSize
                Axios.request({
                  url: option.server,
                  method: option.method,
                  headers: keyValueToObj(option.header),
                  data: slice.call(file, start, end),
                  onUploadProgress: function(progressEvent) {
                    completePart[option.part_number] = { completeSize: progressEvent.loaded, etag: null }
                    // todo 上传进度回调
                    callback(progressCallback, [Object.values(completePart).map(item => item.completeSize).reduce((total, cur) => total + cur, 0), file.size])
                  }
                }).then(response => {
                  if (response.status !== 200 && response.status !== 204) {
                    errorStatus = true
                  } else {
                    taskNum--
                    completePart[option.part_number].etag = response.data.etag || response.headers.etag
                    if (taskNum === 0 && partOptions.length === 0 && applyNum === partNum) {
                      // todo 上传之后
                      callback(afterCallback)
                      var parts = []
                      for (var item in completePart) {
                        parts.push({ partNumber: parseInt(item), etag: completePart[item].etag })
                      }
                      $post(nodes.upload.partComplete, {
                        fileName: file.name,
                        fileMd5: md5,
                        uploadId,
                        parts
                      }).then(() => {
                        // todo 完成
                        resolve(url)
                      }).catch(() => {
                        reject()
                      })
                    }
                    nextFunc()
                  }
                }).catch(e => {
                  errorStatus = true
                  reject(e)
                })
                taskNum++
              }
            }
            nextFunc()
          }
        }).catch((e) => {
          reject(e)
        })
      }).catch(e => {
        reject(e)
      })
    })
  }
}

export default Upload
