![](https://user-gold-cdn.xitu.io/2018/9/29/1662310b4cdab44f?w=1071&h=604&f=png&s=62218)

## 什么是 webpack

webpack 可以看做是模块打包机：他做的事情是，分析你的项目结构，找到 `JavaScript` 模块以及其他的一些浏览器不能直接运行的扩展语言（`Scss`、`TypeScript` 等），将其打包为合适的格式以供浏览器使用

构建就是把源代码转换成发布到线上可执行的 `JavaScript`、CSS、HTML 代码，包括以下内容：

- **代码转换**：`TypeScript` 编译成 `JavaScript`、`SCSS` 编译成 CSS 等等
- **文件优化**：压缩 `JavaScript`、CSS、HTML 代码，压缩合并图片等
- **代码分割**：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载
- **模块合并**：在采用模块化的项目有很多模块和文件，需要构建功能把模块分类合并成一个文件
- **自动刷新**：监听本地源代码的变化，自动构建，刷新浏览器
- **代码校验**：在代码被提交到仓库前需要检测代码是否符合规范，以及单元测试是否通过
- **自动发布**：更新完代码后，自动构建出线上发布代码并传输给发布系统。

构建其实是工程化、自动化思想在前端开发中的体现。把一系列流程用代码去实现，让代码自动化地执行这一系列复杂的流程。

### webpack 的基本概念

- [入口(entry point)](https://www.webpackjs.com/concepts/entry-points/): 指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始，webpack 会找出有哪些模块和 library 是入口起点（直接和间接）依赖的。

  - 默认值是 `./src/index.js`，然而，可以通过在 webpack 配置中配置 entry 属性，来指定一个不同的入口起点（或者也可以指定多个入口起点）。

- [出口 output](https://www.webpackjs.com/concepts/output/): 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，主输出文件默认为 `./dist/main.js`，其他生成文件的默认输出目录是 `./dist`

- [loader](https://www.webpackjs.com/concepts/loaders/): 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

> 注意，loader 能够 import 导入任何类型的模块（例如 .css 文件），这是 webpack 特有的功能，其他打包程序或任务执行器的可能并不支持。我们认为这种语言扩展是有很必要的，因为这可以使开发人员创建出更准确的依赖关系图。

- [插件 plugins](https://www.webpackjs.com/concepts/plugins/): loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

- [模式 mode](https://www.webpackjs.com/concepts/mode/): 通过选择 `development` 或 `production` 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化

### 开发环境和生产环境

我们在日常的前端开发工作中，一般都会有两套构建环境：一套开发时使用，一套供线上使用。

- **development**: 用于开发的配置文件，用于定义 `webpack dev server` 和其他东西
- **production**: 用于生产的配置文件，用于定义 `UglifyJSPlugin`，`sourcemaps` 等

简单来说，开发时可能需要打印 debug 信息，包含 `sourcemap` 文件，而生产环境是用于线上的即代码都是压缩后，运行时不打印 debug 信息等。譬如 axios、antd 等我们的生产环境中需要使用到那么我们应该安装该依赖在生产环境中，而 `webpack-dev-server` 则是需要安装在开发环境中

平时我们 `npm` 中安装的文件中有 -S -D, -D 表示我们的依赖是安装在开发环境的，而-S 的是安装依赖在生产环境中。

本文就来带你搭建基本的前端开发环境，前端开发环境需要什么呢？

- 构建发布需要的 HTML、CSS、JS、图片等资源
- 使用 CSS 预处理器，这里使用 less
- 配置 babel 转码器 => 使用 es6+
- 处理和压缩图片
- 配置热加载，HMR

以上配置就可以满足前端开发中需要的基本配置。

## 搭建基本的开发环境

### 安装

```
mkdir webpack-dev && cd webpack-dev
npm init -y
npm i webpack webpack-cli -D
```

### 添加 scripts

生成了 package.json 文件，在文件中添加

```json
 "scripts": {
    "build": "webpack --mode production"
  }
```

> --`mode` 模式 (必选，不然会有 `WARNING`)，是 `webpack4` 新增的参数选项，默认是 `production`

- `--mode production` 生产环境
  - 提供 `uglifyjs-webpack-plugin` 代码压缩
  - 不需要定义 `new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") })` 默认 `production`
  - 默认开启 `NoEmitOnErrorsPlugin -> optimization.noEmitOnErrors`, 编译出错时跳过输出，以确保输出资源不包含错误
  - 默认开启 `ModuleConcatenationPlugin` -> `optimization.concatenateModules`, `webpack3` 添加的作用域提升(`Scope Hoisting`)
- `--mode development` 开发环境
  - 使用 eval 构建 module, 提升增量构建速度
  - 不需要定义 `new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") })` 默认 `development`
  - 默认开启 `NamedModulesPlugin -> optimization.namedModules` 使用模块热替换(HMR)时会显示模块的相对路径

添加了 scripts 之后，新建`src/index.js`，然后执行`npm run build` ，你就会发现新增了一个 `dist` 目录，里边存放的是 webpack 构建好的 `main.js` 文件。

ps [npm scripts 使用指南](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)

### 新建 webpack.config.js 文件

要想对 webpack 中增加更多的配置信息，我们需要建立一个 webpack 的配置文件。在根目录下创建 `webpack.config.js` 后再执行 `webpack` 命令，webpack 就会使用这个配置文件的配置了

配置中具备以下的基本信息：

```js
module.exports = {
  entry: '', // 打包入口：指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
  output: '', // 出口
  resolve: {}, // 配置解析：配置别名、extensions 自动解析确定的扩展等等
  devServer: {}, // 开发服务器：run dev/start 的配置，如端口、proxy等
  module: {}, // 模块配置：配置loader（处理非 JavaScript 文件，比如 less、sass、jsx、图片等等）等
  plugins: [] // 插件的配置：打包优化、资源管理和注入环境变量
}
```

#### 配置打包入口和出口

首先我们往 `webpack.config.js` 添加点配置信息

```js
const path = require('path')

module.exports = {
  // 指定打包入口
  entry: './src/index.js',

  // 打包出口
  output: {
    path: path.resolve(__dirname, 'dist'), // 解析路径为 ./dist
    filename: 'bundle.js'
  }
}
```

上面我们定义了打包入口 `./src/index.js`，打包出口为 `./dist`, 打包的文件夹名字为`bundle.js`，执行`npm run build`命令后，index.js 文件会被打包为 `bundle.js` 文件。此时随便建立一个 html 文件引用这个`bundle.js`就可以看到你在`index.js` 写的代码了。

[path.resolve([...paths])](http://nodejs.cn/api/path.html#path_path_resolve_paths) 方法会把一个路径或路径片段的序列解析为一个绝对路径。

### 使用 html-webpack-plugin 创建 html 文件

更多情况下我们不希望打包一次，就新建一次 html 文件来引用打包后的文件，这样显得不智能或者说当你打包的文件名修改后，引用路径就会出错。

这个时候我们就可以使用 [html-webpack-plugin](https://webpack.docschina.org/plugins/html-webpack-plugin/) 插件来将 HTML 引用路径和我们的构建结果关联起来。

```
npm install html-webpack-plugin -D
```

创建文件`public/index.html` 修改 `webpack.config.js` 文件

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  //...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: './public/index.html' // 配置要被编译的html文件
    })
  ]
}
```

重新执行 `npm run build`, dist 目录就会多个 `index.html` 并引入了 `bundle.js`.

#### 压缩 html 文件

修改 `webpack.config.js`

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  //...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: './public/index.html', // 配置要被编译的html文件
      hash: true,
      // 压缩 => production 模式使用
      minify: {
        removeAttributeQuotes: true, //删除双引号
        collapseWhitespace: true //折叠 html 为一行
      }
    })
  ]
}
```

### 打包 css 文件

我们希望使用 webpack 来进行构建 css 文件，，为此，需要在配置中引入 loader 来解析和处理 CSS 文件：

```
npm install style-loader css-loader -D
```

新建 `src/assets/style/color.css`, 修改 `webpack.config.js` 文件：

```js
module.exports = {
  //...
  module: {
    /**
     * test: 匹配特定条件。一般是提供一个正则表达式或正则表达式的数组
     * include: 匹配特定条件。一般是提供一个字符串或者字符串数组
     * exclude: 排除特定条件
     * and: 必须匹配数组中的所有条件
     * or: 匹配数组中任何一个条件,
     * nor: 必须排除这个条件
     */
    rules: [
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        use: ['style-loader', 'css-loader']
      }
    ]
  }
  //...
}
```

经由上述两个 loader 的处理后，CSS 代码会转变为 JS， 如果需要单独把 CSS 文件分离出来，我们需要使用 [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) 插件

#### 抽取 css 到独立文件, 自动添加前缀

```
npm i mini-css-extract-plugin postcss-loader autoprefixer -D
```

我们在写 css 时不免要考虑到浏览器兼容问题，如 `transform` 属性，需要添加浏览器前缀以适配其他浏览器。故使用到 `postcss-loader` 这个 loader， 下面则是相关的配置

`webpack.config.js`

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    //...
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
}
```

#### 打包 less 文件

开发中通常会用到一门预处理语言，这里以`less`为例，通过`less-loader`可以打包 less 为 css 文件

```
npm install less less-loader -D
```

新建 `src/assets/style/index.less`, 并且在 `src/index.js` 中引入 `import './assets/style/index.less'`

配置 `webpack.config.js`

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')] // 添加css中的浏览器前缀
            }
          },
          'less-loader'
        ]
      }
    ]
  }
  //...
}
```

执打包命令后就可以发现 `index.less` 中写的样式会和`color.css`一样被打包进 `main.css`中。

[webpack@v4 升级踩坑](https://segmentfault.com/a/1190000014396803?utm_source=tag-newest): 关于使用 `mini-css-extract-plugin` 的注意点。

### 打包图片

```
npm install file-loader url-loader -D
```

**file-loader:** 可以用于处理很多类型的文件，它的主要作用是直接输出文件，把构建后的文件路径返回。

**url-loader:**
如果图片较多，会发很多 http 请求，会降低页面性能。`url-loader` 会将引入的图片编码，生成 dataURl。相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。当然，如果图片较大，编码会消耗性能。因此 `url-loader` 提供了一个 limit 参数，小于 limit 字节的文件会被转为 DataURl，大于 limit 的还会使用 `file-loader` 进行 copy。

- url-loader 可以看作是增强版的 file-loader。
- url-loader 把图片编码成 base64 格式写进页面，从而减少服务器请求。

```js
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'images/', //输出到images文件夹
              limit: 500 //是把小于500B的文件打成Base64的格式，写入JS
            }
          }
        ]
      }
    ]
  }
  //...
}
```

**url-loader 和 file-loader 是什么关系呢？**

简单地说，`url-loader` 封装了 `file-loader`。`url-loader` 不依赖于 `file-loader`，即使用 `url-loader` 时，只需要安装 `url-loader` 即可，不需要安装 `file-loader`，因为 `url-loader` 内置了 `file-loader`。

通过上面的介绍，我们可以看到，url-loader 工作分两种情况：

- 文件大小小于 limit 参数，url-loader 将会把文件转为 DataURL；
- 文件大小大于 limit，url-loader 会调用 file-loader 进行处理，参数也会直接传给 file-loader。因此我们只需要安装 url-loader 即可。

有关 `url-loader` 和 `file-loader` 的解析：[webpack 之图片引入-增强的 file-loader：url-loader](https://blog.csdn.net/hdchangchang/article/details/80175782)

### 配置 babel

#### babel-loader

`Babel` 是一个让我们能够使用 ES 新特性的 JS 编译工具，我们可以在 webpack 中配置 Babel，以便使用 ES6、ES7 标准来编写 JS 代码。

Babel 7 的相关依赖包需要加上 `@babel` scope。一个主要变化是 presets 设置由原来的 `env` 换成了 `@babel/preset-env`, 可以配置 `targets`, `useBuiltIns` 等选项用于编译出兼容目标环境的代码。其中 `useBuiltIns` 如果设为 `"usage"`，Babel 会根据实际代码中使用的 ES6/ES7 代码，以及与你指定的 targets，按需引入对应的 `polyfill`，而无需在代码中直接引入 `import '@babel/polyfill'`，避免输出的包过大，同时又可以放心使用各种新语法特性。

```
npm i babel-loader @babel/core @babel/preset-env -D
```

笔者这里配的版本号如下

```json
{
  "babel-loader": "^8.0.4",
  "@babel/core": "^7.1.2",
  "@babel/preset-env": "^7.1.0"
}
```

- [babel-loader](https://www.npmjs.com/package/babel-loader): 用 babel 转换 ES6 代码需要使用到 `babel-loader`
- [@babel-preset-env](https://www.npmjs.com/package/@babel/preset-env)： 默认情况下是等于 ES2015 + ES2016 + ES2017，也就是说它对这三个版本的 ES 语法进行转化。
- [@babel/core](https://www.npmjs.com/package/@babel/core)：babel 核心库

根目录下新建 `.babelrc` 文件

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        },
        "useBuiltIns": "usage"
      }
    ]
  ]
}
```

- presets 是一堆 plugins 的预设，起到方便的作用。
- plugins 是编码转化工具，babel 会根据你配置的插件对代码进行相应的转化。

修改 `webpack.config.js`

```js
module.exports = {
  module: {
    rules: [
      //...
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
```

#### babel/polyfill 和 transform-runtime

> Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API ，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。

- babel-polyfill: 如上述所说，对于新的 API，你可能需要引入 babel-polyfill 来进行兼容
- 关键点

  - babel-polyfill 是为了模拟一个完整的 ES2015+环境，旨在用于应用程序而不是库/工具。
  - babel-polyfill 会污染全局作用域

babel-runtime 的作用：

- **提取辅助函数**。ES6 转码时，babel 会需要一些辅助函数，例如 \_extend。babel 默认会将这些辅助函数内联到每一个 js 文件里， babel 提供了 transform-runtime 来将这些辅助函数“搬”到一个单独的模块 babel-runtime 中，这样做能减小项目文件的大小。
- **提供 polyfill**：不会污染全局作用域，但是不支持实例方法如 Array.includes

`babel-runtime` 更像是分散的 polyfill 模块，需要在各自的模块里单独引入，借助 `transform-runtime` 插件来自动化处理这一切，也就是说你不要在文件开头 import 相关的 `polyfill`，你只需使用，`transform-runtime` 会帮你引入。

对于开发应用来说，直接使用上述的按需 `polyfill` 方案是比较方便的，但如果是开发工具、库的话，这种方案未必适合（`babel-polyfill` 是通过向全局对象和内置对象的 `prototype` 上添加方法实现的，会造成全局变量污染）。Babel 提供了另外一种方案 `transform-runtime`，它在编译过程中只是将需要 `polyfill` 的代码引入了一个指向 `core-js` 中对应模块的链接(alias)。关于这两个方案的具体差异和选择，可以自行搜索相关教程，这里不再展开，下面提供一个 `transform-runtime` 的参考配置方案。

- 首先安装 runtime 相关依赖

```
npm i @babel/plugin-transform-runtime -D
npm i @babel/runtime -S
```

修改 `.babelrc`

```json
{
  //...
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

### 打包前清理源目录文件 clean-webpack-plugin

每次打包，都会生成项目的静态资源，随着某些文件的增删，我们的 dist 目录下可能产生一些不再使用的静态资源，webpack 并不会自动判断哪些是需要的资源，为了不让这些旧文件也部署到生产环境上占用空间，所以在 webpack 打包前最好能清理 dist 目录。

```
npm install clean-webpack-plugin -D
```

修改 `webpack.config.js` 文件

```js
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  plugins: [new CleanWebpackPlugin(['dist'])]
}
```

### 提取公用代码

假如你 `a.js` 和 `b.js` 都 import 了 `c.js` 文件，这段代码就冗杂了。为什么要提取公共代码，简单来说，就是减少代码冗余，提高加载速度。

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          // 抽离自己写的公共代码
          chunks: 'initial',
          name: 'common', // 打包后的文件名，任意命名
          minChunks: 2, //最小引用2次
          minSize: 0 // 只要超出0字节就生成一个新包
        },
        styles: {
          name: 'styles', // 抽离公用样式
          test: /\.css$/,
          chunks: 'all',
          minChunks: 2,
          enforce: true
        },
        vendor: {
          // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10
        }
      }
    }
  }
}
```

### hash

hash 是干嘛用的？
我们每次打包出来的结果可能都是同一个文件，那我上线的时候是不是要替换掉上线的 js，那我怎么知道哪是最新的呢，我们一般会清一下缓存。而 hash 就是为了解决这个问题而存在的

我们此时在改一些 webpack.config.js 的配置

```js
module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js'
  },
  //...
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
      chunkFilename: '[id].[hash:8].css'
    })
  ]
}
```

### 减少 resolve 的解析，配置别名

如果我们可以精简 `resolve` 配置，让 `webpack` 在查询模块路径时尽可能快速地定位到需要的模块，不做额外的查询工作，那么 `webpack` 的构建速度也会快一些

```js
module.exports = {
  resolve: {
    /**
     * alias: 别名的配置
     *
     * extensions: 自动解析确定的扩展,
     *    比如 import 'xxx/theme.css' 可以在extensions 中添加 '.css'， 引入方式则为 import 'xxx/theme'
     *    @default ['.wasm', '.mjs', '.js', '.json']
     *
     * modules 告诉 webpack 解析模块时应该搜索的目录
     *   如果你想要添加一个目录到模块搜索目录，此目录优先于 node_modules/ 搜索
     *   这样配置在某种程度上可以简化模块的查找，提升构建速度 @default node_modules 优先
     */
    alias: {
      '@': path.resolve(__dirname, 'src'),
      tool$: path.resolve(__dirname, 'src/utils/tool.js') // 给定对象的键后的末尾添加 $，以表示精准匹配
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
}
```

### webpack-dev-serve

上面讲到了都是如何打包文件，但是开发中我们需要一个本地服务，这时我们可以使用 `webpack-dev-server` 在本地开启一个简单的静态服务来进行开发。

`webpack-dev-server` 是 webpack 官方提供的一个工具，可以基于当前的 webpack 构建配置快速启动一个静态服务。当 `mode` 为 `development` 时，会具备 `hot reload` 的功能，即当源码文件变化时，会即时更新当前页面，以便你看到最新的效果。...

```
npm install webpack-dev-server -D
```

package.json 中 scripts 中添加

```
"start": "webpack-dev-server --mode development"
```

默认开启一个本地服务的窗口 http://localhost:8080/ 便于开发

#### 配置开发服务器

我们可以对 `webpack-dev-server` 做针对性的配置

```js
module.exports = {
  // 配置开发服务器
  devServer: {
    port: 1234,
    open: true, // 自动打开浏览器
    compress: true // 服务器压缩
    //... proxy、hot
  }
}
```

- contentBase: 服务器访问的根目录（可用于访问静态资源）
- port: 端口
- open: 自动打开浏览器

### 模块热替换(hot module replacement)

模块热替换(`HMR - Hot Module Replacement`)功能会在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度：

- 保留在完全重新加载页面时丢失的应用程序状态。
- 只更新变更内容，以节省宝贵的开发时间。
- 调整样式更加快速 - 几乎相当于在浏览器调试器中更改样式。

上面我们 `npm start` 后修改一次文件，页面就会刷新一次。这样就存在很大问题了，比如我们使用 `redux`, `vuex` 等插件，页面一刷新那么存放在 `redux`, `vuex` 中的东西就会丢失，非常不利于我们的开发。

HMR 配合 webpack-dev-server ，首先我们配置下 webpack.config.js

```js
const webpack = require('webpack')

module.exports = {
  devServer: {
    //...
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    //...
  ]
}
```

配置后还不行，因为 webpack 还不知道你要更新哪里, 修改 `src/index.js` 文件, 添加

```js
if (module.hot) {
  module.hot.accept()
}
```

重启服务，`npm start` 之后，修改引入 `index.js` 文件后，页面就不会重新刷新了，这便实现了 HMR

但是但是有个问题是，你修改 css/less 等样式文件并未发生改变， what ?

HMR 修改样式表 需要借助于 `style-loader`， 而我们之前用的是 `MiniCssExtractPlugin.loader`， 这也好办，修改其中一个 rules 就可以了，我们可以试试改

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')] // 添加css中的浏览器前缀
            }
          },
          'less-loader'
        ]
      }
    ]
  }
}
```

这样我们修改 less 文件就会发现 HMR 已经实现了。

其实，我们可以发现，dev 下配置的 loader 为 `style-loader` , 而生产环境下则是需要 `MiniCssExtractPlugin.loader`

这就涉及到了不同环境之间的配置。可以通过 `process.env.NODE_ENV` 获取当前是开发环境或者是生产环境，然后配置不同的 loader，这里就不做展开了。下一篇文章打算在做一个 `react-cli` 或者 `vue-cli` 的配置，将开发环境的配置与生产环境的配置分开为不同的文件。

### 结语

前面讲到的知识都是 webpack 的一些基础的知识，更多的资料可以查询[webpack 中文官网](https://webpack.js.org/)，官网讲的比较详细，我这里也是讲最常的配置，也是一篇入门系列的文章，文中涉及的知识点还有很多地方还需要完善，譬如 优化 webpack 的构建速度， 减小打包的体积等等。

学习 `webpack 4.0` 还需要多实践，多瞎搞，笔者也是刚刚学习 webpack 的配置，不对之处请各位指出。

下一篇文章打算从零配置一个脚手架，以加深自己对 webpack 的理解。

本文产生的代码：[webpack-dev](https://github.com/gershonv/my-code-store/tree/master/webpack/webpack-dev)

### 参考

- [webpack4.x 入门一篇足矣](https://juejin.im/post/5b2b9a00e51d45587b48075e#heading-0)
- [Webpack4 不深不浅的实践教程](https://segmentfault.com/a/1190000014466696?utm_source=index-hottest/*&%5E%25$#articleHeader0)
- [webpack 之 babel 配置和 HMR](https://juejin.im/post/5b3834e051882574ce2f3dd9)
- [使用 webpack 4 和 Babel 7 配置 Vue.js 工程模板](https://segmentfault.com/a/1190000015247255)
- [webpack 4 ：从 0 配置到项目搭建](https://juejin.im/post/5b3daf2ee51d451962727fbe)
- [webpack 详解](https://juejin.im/post/5aa3d2056fb9a028c36868aa)
- [手写一个 webpack4.0 配置](https://juejin.im/post/5b4609f5e51d4519596b66a7)
- [Webpack 4 教程：从零配置到生产发布（2018）](https://juejin.im/entry/5b552985f265da0f697036b2)
- [Webpack 揭秘——走向高阶前端的必经之路](https://juejin.im/post/5badd0c5e51d450e4437f07a)
- [珠峰架构师培训公开课 webpack4.0 进阶](https://www.bilibili.com/video/av25439651?from=search&seid=14183256954711376795)
- [webpack 官网](https://webpack.js.org/)