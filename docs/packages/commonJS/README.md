---
title: CommonJS 的实现
---

## CommonJS 规范基本语法

简单了解 commonjs 的用法，其实在 node 端用的比较多。

```js
// module1.js
module.exports = 'alvin';

// main.js 通过 require 引入
// 在 node 端执行会输出 alvin，因为 node 采用 commonJS 规范
console.log(require('./module1'));
```

> 浏览器不支持 `commonjs` 规范，如需使用，可以借助 [browserify](http://www.ruanyifeng.com/blog/2015/05/commonjs-in-browser.html) 转译

```bash
npm i -g browserify
browserify main.js -o bundle.js
```

<Badge>browserify 示例</Badge>

```js
// module1.js
module.exports = 'alvin'

// main.js
console.log(require('./module1'))

// 在 html 引入转义后的文件
<script src="bundle.js"></script>
```

## Module 有什么？

简单的 demo

```js
// utils.js
module.exports = 'utils';

// index.js
console.log(require('./utils'));
console.log(module);
```

输出

```js
Module {
  id: '.', //模块的识别符，通常是带有绝对路径的模块文件名
  path: '/Users/alvin/Desktop/code/template/dumi/docs/webpack/commonJS',
  exports: {}, // 导出什么值
  parent: null, // 被什么模块调用
  filename: '/Users/alvin/Desktop/code/template/dumi/docs/webpack/commonJS/index.js',
  loaded: false,
  children: [ // 调用了哪些模块
    Module {
      ...
    }
  ],
  paths: [
    '/Users/alvin/Desktop/code/template/dumi/docs/webpack/commonJS/node_modules',
    '/Users/alvin/Desktop/code/template/dumi/docs/webpack/node_modules',
    '/Users/node_modules',
    '/node_modules'
  ]
}
```

| 参数              | 描述                                           |
| ----------------- | ---------------------------------------------- |
| `module.id`       | 模块的识别符，通常是带有绝对路径的模块文件名。 |
| `module.filename` | 模块的文件名，带有绝对路径。                   |
| `module.loaded`   | 返回一个布尔值，表示模块是否已经完成加载。     |
| `module.parent`   | 返回一个对象，表示调用该模块的模块。           |
| `module.children` | 返回一个数组，表示该模块要用到的其他模块。     |
| `module.exports`  | 表示模块对外输出的值。                         |

## 实现读取 js 文件

```bash
└── src
    ├── index.js # console.log(requireFunc('./utils'));
    └── utils.js # console.log('run utils'); module.exports = 'utils';
```

```js
// console.log(require('./utils'));
// require('./utils');
const fs = require('fs');
const { resolve } = require('path');
const vm = require('vm'); // 虚拟机模块，沙箱运行，防止变量污染

const data = requireFunc('./utils'); // return utils
console.log(data);

function Module(id) {
  this.id = id;
  this.exports = {};
}

function requireFunc(filePath) {
  const filename = resolve(__dirname, filePath + '.js');
  const fileStr = fs.readFileSync(filename, 'utf8'); // 文件内容

  const _module = new Module(filename);

  // 执行文件
  function runJS(_module) {
    // 添加到闭包中
    const closure = `(function (exports, require, module, __filename, __dirname) {${fileStr}})`;
    vm.runInThisContext(closure).call(
      _module.exports,
      _module.exports,
      requireFunc,
      _module,
    );
  }

  runJS(_module);
  return _module.exports;
}
```

这里简单实现了一波，然而还有很多问题。

1. 引入 `json` 文件。不需要执行 js 文件，直接 `JSON.parse` 里面的数据导出即可
2. 后缀名，文件名解析。比如 `utils/index.js` 会解析到该 `index.js` 的地址，以及同时存在 `index.json` 优先解析哪一个文件？
3. 模块缓存，加入多个模块同时引用一个 js 文件，那么这个 js 文件不需要解析多次，解析了一次后通过 id 读取即可。

## 实现代码

```js
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
```
