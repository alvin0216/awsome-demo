const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, './test/b.txt')

const data = fs.readFileSync(filePath, 'utf-8')
console.log(`demo2 ${filePath} 写入前 内容：`, data)
/**
 * 异步
 * fs.writeFile(path, data, [options], function(err){ })
 */
fs.writeFile(filePath, '这是异步写入的数据', function(err) {
  if (err) {
    console.log('demo2 文件写入失败', err)
  } else {
    const fileData = fs.readFileSync(filePath, 'utf-8')
    console.log(`demo2 ${filePath} 异步 写入文件成功: `, fileData)
    // reset
    fs.writeFileSync(filePath, '这是 b.txt')
  }
})

// const bufferData = fs.writeFile(filePath) // 同步读取，返回 buffer 对象
const fileData = fs.writeFileSync(filePath, '这是同步写入的数据')
console.log(`demo2 ${filePath} 同步 写入的内容： `, fs.readFileSync(filePath, 'utf-8'))

// ======== 例子 复制图片
const picPath = path.resolve(__dirname, './test/a.jpeg')
const copyPath = path.resolve(__dirname, './test/b.jpeg')
fs.readFile(picPath, 'base64', function(err, data) {
  fs.writeFile(copyPath, data.toString(), 'base64', function(err) {
    if (err) {
      console.log('demo2 文件复制失败', err)
    } else {
      console.log('demo2 复制 a.jpeg 文件成功')
    }
  })
})
