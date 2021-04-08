// console.log(require('./utils'));
// require('./utils');
const fs = require('fs');
const { resolve, extname } = require('path');
const vm = require('vm'); // 虚拟机模块，沙箱运行，防止变量污染

function Module(id) {
  this.id = id;
  this.exports = {};
}

/** 模块缓存 */
Module._cacheModule = {};

/** 模块加载 */
Module._load = function(filePath) {
  let fileName = Module._resolveFilename(filePath); // 文件路径解析

  // 判断缓存中是否有该模块
  if (Module._cacheModule[fileName]) {
    return Module._cacheModule[fileName].exports;
  }

  let module = new Module(fileName); // 没有就创建模块
  Module._cacheModule[fileName] = module; // 并将创建的模块添加到缓存

  // 根据传入的模块，尝试加载模块方法
  let ext = extname(module.id); //扩展名
  Module._extensions[ext](module); // exports 上就有了数组

  return module.exports;
};

/**  解析文件地址 filePath:string => string */
Module._resolveFilename = filePath => {
  // 文件名 *.js *.json 则直接返回
  if (/\.js$|\.json$/.test(filePath)) return resolve(__dirname, filePath);

  // 1. 没有后后缀 自动拼后缀
  // 2. 找不到文件，在通过目录
  let exts = Object.keys(Module._extensions);

  // 文件扩展名分析
  for (let i = 0; i < exts.length; i++) {
    let filename = resolve(__dirname, filePath + exts[i]);
    if (fs.existsSync(filename)) {
      return filename;
    }
  }

  // 目录分析
  for (let i = 0; i < exts.length; i++) {
    let filename = resolve(__dirname, filePath + '/index' + exts[i]);
    if (fs.existsSync(filename)) {
      return filename;
    }
  }

  throw new Error('module not exists');
};

/** 不同模块编译的方法 */
Module._extensions = {
  '.js': function(module) {
    let fileStr = fs.readFileSync(module.id, 'utf8');
    const funcStr = `(function (exports, require, module, __filename, __dirname) {${fileStr}})`;

    // vm沙箱运行, node内置模块，前面我们已经引入， 将我们js函数执行，将this指向 module.exports
    vm.runInThisContext(funcStr).call(
      module.exports,
      module.exports,
      requireFunc,
      module,
    );
  },
  '.json': function(module) {
    // 对于json文件的处理就相对简单了，将读取出来的字符串转换未JSON对象就可以了
    module.exports = JSON.parse(fs.readFileSync(module.id, 'utf8'));
  },
};

function requireFunc(filePath) {
  return Module._load(filePath);
}

const data = requireFunc('./utils'); // return utils
console.log(data);
