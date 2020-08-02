const fs = require('fs')
const path = require('path')
const vm = require('vm') // 虚拟机模块，沙箱运行，防止变量污染

function Module(id) {
  this.id = id
  this.exports = {}
}

// 模块加载
Module._load = function (filePath) {
  // 相对路径,可能这个文件没有后缀，尝试加后缀
  let fileName = Module._resolveFilename(filePath) // 获取到绝对路径

  // 判断缓存中是否有该模块
  if (Module._cacheModule[fileName]) {
    return Module._cacheModule[fileName].exports
  }

  let module = new Module(fileName) // 没有就创建模块
  Module._cacheModule[fileName] = module // 并将创建的模块添加到缓存

  // 加载模块
  tryModuleLoad(module)
  return module.exports
}

// 根据绝对路径进行缓存的模块对象
Module._cacheModule = {}

Module._resolveFilename = function (filePath) {
  if (/\.js$|\.json$/.test(filePath)) {
    return path.resolve(__dirname, filePath) // 直接返回路径
  } else {
    // 1. 没有后后缀 自动拼后缀
    // 2. 找不到文件，在通过目录
    let exts = Object.keys(Module._extensions)

    // 文件扩展名分析
    for (let i = 0; i < exts.length; i++) {
      let filename = path.resolve(__dirname, filePath + exts[i])
      if (fs.existsSync(filename)) {
        return filename
      }
    }

    // 目录分析
    for (let i = 0; i < exts.length; i++) {
      let filename = path.resolve(__dirname, filePath + '/index' + exts[i])
      if (fs.existsSync(filename)) {
        return filename
      }
    }

    throw new Error('module not exists')
  }
}

// 不同模块编译的方法
Module._extensions = {
  '.js': function (module) {
    let content = fs.readFileSync(module.id, 'utf8')
    let funcStr = Module.wrap(content) // 给内容添加闭包

    // vm沙箱运行, node内置模块，前面我们已经引入， 将我们js函数执行，将this指向 module.exports
    vm.runInThisContext(funcStr).call(module.exports, module.exports, requireFunc, module)
  },
  '.json': function (module) {
    // 对于json文件的处理就相对简单了，将读取出来的字符串转换未JSON对象就可以了
    module.exports = JSON.parse(fs.readFileSync(module.id, 'utf8'))
  }
}

// 存放闭包字符串
Module.wrapper = ['(function (exports, require, module, __filename, __dirname) {', '})']

// 根据传入的模块，尝试加载模块方法
function tryModuleLoad(module) {
  let ext = path.extname(module.id) //扩展名
  // 如果扩展名是js 调用js处理器 如果是json 调用json处理器
  Module._extensions[ext](module) // exports 上就有了数组
}

// 将我们读到js的内容传入,组合成闭包字符串
Module.wrap = function (script) {
  return Module.wrapper[0] + script + Module.wrapper[1]
}

// 测试代码
function requireFunc(path) {
  return Module._load(path) // 加载模块
}

console.log(requireFunc('./moduleA'))
