const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, './test/c.txt')

/**
 * 异步 文件内容追加
 * fs.appendFile(path, data, options, callback)
 */
fs.appendFile(filePath, '这是异步的内容追加', 'utf-8', function(err) {
  if (err) {
    console.log('demo3 文件追加失败', err)
  } else {
    console.log(`demo3 ${filePath} 异步 内容追加成功：`, fs.readFileSync(filePath, 'utf-8'))
    // reset
    fs.writeFileSync(filePath, '这是 c.txt')
  }
})

const fileData = fs.appendFileSync(filePath, '这是同步的内容追加', 'utf-8')
console.log(`demo3 ${filePath} 同步 内容追加成功：`, fs.readFileSync(filePath, 'utf-8'))
