今天想用 `create-react-app` 速集成 `ant-design + less` 的配置做一些简单的 demo，发现居然脚手架里面的配置更新了。 `npm run eject` 后发现 config 里的文件稍微有了些变化。在 google 上找了一些都没最新的配置【可能是我没发现】，这里就简单记录一下配置，也是一个坑~~

### 安装

```
create-react-app react-antd-less
cd create-antd-less
npm run eject
```

`npm run eject` : 弹出 webpack 的配置，便于去实现不同类型的配置

### 添加 antd + 按需引入

```
npm i antd -S
npm i babel-plugin-import -D
```

删除 package.json 中的 babel 配置:

```json
 "babel": {
  "presets": [
    "react-app"
  ]
 }
```

根目录下新建 `.babelrc` 文件：

```json
{
  "presets": ["react-app"],
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "style": "css"
      }
    ]
  ]
}
```

antd 配置就完成了，可以在页面上测试：

```jsx
import { Button } from 'antd'

// html
<Button>Learn React</Button>
```

就发现 antd 的样式出来了~~~

### 配置 less

```
npm i less less-loader -D
```

修改 `config/webpack.config.dev.js`、`config/webpack.config.prod.js`

```js
const cssRegex = /\.(css|less)$/ // 原来是 const cssRegex = /\.css$/

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    // ...添加 less-loader
    {
      loader: require.resolve('less-loader') // compiles Less to CSS
    }
  ]
  //...
}
```

less 就配置完成了。

### 结语

其余的配置像 `rudux`, `router` 大同小异就不展开说明了，这里笔者仅仅记录踩过的小坑而已。

相关代码[在这里](https://github.com/gershonv/my-code-store/tree/master/react/react-antd-less)