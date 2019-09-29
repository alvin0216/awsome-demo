const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, './test/a.txt')

/**
 * 异步
 * fs.readFile(filename,[options],function(err,data){ })
 */
fs.readFile(filePath, 'utf-8', function(err, data) {
  if (err) {
    console.log('demo1 文件读取失败', err)
  } else {
    console.log(`demo1 ${filePath} 异步 读取成功, 内容为：`, data)
  }
})

const bufferData = fs.readFileSync(filePath) // 同步读取，返回 buffer 对象
const fileData = fs.readFileSync(filePath, 'utf-8') // 同步读取，返回 buffer 对象
console.log(`demo1 ${filePath} 同步 读取成功, 内容为：`, fileData)
