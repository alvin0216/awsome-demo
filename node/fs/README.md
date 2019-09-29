## fs 文件系统

### 文件读取

> 代码: [demo1](./demo1.js)

```js
const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, './test/a.txt')

// === 文件读取 fs.readFile

/**
 * 异步
 * fs.readFile(filename,[options],function(err,data){ })
 */
fs.readFile(filePath, 'utf-8', function(err, data) {
  if (err) {
    console.log('文件读取失败', err)
  } else {
    console.log(`读取 ${filePath} 成功, 内容为：`, data)
  }
})

const bufferData = fs.readFileSync(filePath) // 同步读取，返回 buffer 对象
const fileData = fs.readFileSync(filePath, 'utf-8') // 同步读取，返回 buffer 对象
console.log(`同步读取 ${filePath} 成功, 内容为：`, fileData)
```

### 文件写入

> 代码：[demo2](./demo2.js)

```js
/**
 * fs.writeFile(path, data, [options], function(err){ })
 */
fs.writeFile(filePath, '这是异步写入的数据', function(err) {
  //...
})

fs.writeFileSync(filePath, '这是同步写入的数据')
```

#### 复制图片

```js
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
```

### 文件内容追加

> 代码：[demo3](./demo3.js)

```js
/**
 * fs.appendFile(path, data, options, callback)
 */
fs.appendFile(filePath, '这是异步的内容追加', 'utf-8', function(err) {
  //...
})

fs.appendFileSync(filePath, '这是同步的内容追加', 'utf-8')
```

### 目录读取

> 代码：[demo4](./demo4.js)

```js
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
```

### 目录创建

> 代码：[demo5](./demo5.js)

```js
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
```
