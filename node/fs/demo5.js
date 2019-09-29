const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, './test/demo5-test')

const exists = fs.existsSync(filePath)
if (exists) {
  fs.rmdirSync(filePath)
}

/**
 * 异步
 * fs.mkdir(path[, mode], callback)
 */
fs.mkdir(filePath, function(err) {
  if (err) {
    return console.error(err)
  }
  console.log(`demo5 ${filePath} 目录创建成功。`)
})
