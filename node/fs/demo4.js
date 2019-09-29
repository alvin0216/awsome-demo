var fs = require('fs')
const path = require('path')
const filePath = path.resolve(__dirname)

// fs.readdir(path,function(err,files){})
fs.readdir(filePath, function(err, files) {
  if (err) {
    console.log('读取目录失败')
  } else {
    console.log(`demo4 ${filePath} 异步 文件目录读取成功`, files)
  }
})

const files = fs.readdirSync(filePath)
console.log(`demo4 ${filePath} 同步 文件目录读取成功`, files)
