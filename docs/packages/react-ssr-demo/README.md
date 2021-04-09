---
title: React SSR 构建过程
---

## 基本构建

安装依赖

```bash
# 构建工具
npm i -D webpack webpack-cli webpack-merge webpack-node-externals
npm i -D npm-run-all # 启动多个 npm 命令
npm i -D nodemon # 热启动，文件修改则重新执行 node
npm i -D babel-loader @babel/core @babel/cli @babel/preset-react @babel/preset-env
npm i -D @babel/runtime-corejs2 @babel/plugin-transform-runtime # 垫片 解析 async await 等

npm i react react-dom # react
npm i express # express
```

第一次构建后的目录：

```bash
├── build             # server 端打包后的文件夹
│   └── bundle.js     # server 打包的文件
├── package.json
├── public
│   └── index.js      # client 端打包后的文件
├── src
│   ├── App.jsx       # App 组件
│   ├── client
│   │   └── index.js  # 客户端入口
│   └── server
│       └── index.js  # 服务端入口
├── webpack.base.js   # webpack 公用的配置
├── webpack.client.js # 打包 client 的 webpack 配置
├── webpack.server.js # 打包 server 的 webpack 配置
```

`src/App.jsx`

```js
import React from 'react';

const App = () => <h2>Hello React</h2>;

export default App;
```

`src/client/index.js`

```js
import React from 'react';
import ReactDom from 'react-dom';
import App from '../App';

ReactDom.hydrate(<App />, document.getElementById('root'));
```

这里很熟悉了，不同的是 SPA 使用的是 `ReactDOM.render`， 服务端是采用了 `ReactDom.hydrate`

`src/server/index.js`

```js
import express from 'express';

import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';

const app = express();
app.use(express.static('public'));

app.use('*', function (req, res) {
  const content = renderToString(<App />);
  res.end(
    `
    <html>
      <head>
        <title>ssr</title>
      </head>
      <body>
        <div id="root">${content}</div>
      </body>
    </html>
  `,
  );
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
```

服务端采用的是 `renderToString` 将组件渲染生成字符串

---

**webpack 的打包配置**

`webpack.base.js`

```js
// base config
module.exports = {
  mode: 'development', // 开发模式

  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader', // .babelrc 单独配置 babel
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: ['>1%', 'last 2 versions', 'not ie <= 8'],
                },
              },
            ],
            '@babel/preset-react',
          ],
          plugins: [['@babel/plugin-transform-runtime', { corejs: 2 }]],
          cacheDirectory: true, // 构建优化 第二次构建时，会读取之前的缓存
        },
      },
    ],
  },
};
```

`webpack.client.js`

```js
const { resolve } = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.base.js');

module.exports = merge(config, {
  entry: resolve(__dirname, './src/client/index.js'),
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'public'),
  },
});
```

`webpack.server.js`

```js
const { resolve } = require('path');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');
const config = require('./webpack.base.js');

module.exports = merge(config, {
  entry: resolve(__dirname, './src/server/index.js'),
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build'),
  },
  // target: node 不会将 node 的核心模块打包进来
  target: 'node',
  externals: [nodeExternals()], // 排除 node_modules 目录中所有模块
});
```

`package.json` 中添加 `scripts`

```json
"scripts": {
  "dev": "npm-run-all --parallel dev:**",
  "dev:start": "nodemon --watch build --exec node \"./build/bundle.js\"",
  "dev:build:server": "webpack --config webpack.server.js --watch",
  "dev:build:client": "webpack --config webpack.client.js --watch"
},
```

`npm run dev` 打开 `http://localhost:3000` 即可。

## 实现同构

我们给 `App.jsx` 添加事件，但是没有效果

```jsx | pure
import React from 'react';

const App = () => {
  return <button onClick={(e) => alert(1)}>click</button>;
};

export default App;
```

原因很简单，`react-dom/server` 下的 `renderToString` 并没有做事件相关的处理，因此返回给浏览器的内容不会有事件绑定。

那怎么解决这个问题呢？

这就需要进行同构了。所谓同构，通俗的讲，就是一套 `React` 代码在服务器上运行一遍，到达浏览器又运行一遍。服务端渲染完成页面结构，浏览器端渲染完成事件绑定。

那如何进行浏览器端的事件绑定呢？

让浏览器去拉取 JS 文件执行，让 JS 代码来控制。

修改 `server/index.js`, 添加 `<script src="/index.js"></script>`

```html
<body>
  <div id="root">${content}</div>
  <script src="/index.js"></script>
</body>
```

## 实现路由同构

src 下的目录如下

```bash
├── src
│   ├── client
│   │   └── index.js
│   ├── containers
│   │   ├── Home.jsx
│   │   └── Login.jsx
│   ├── routes.js
│   └── server
│       └── index.js
```

`routes.js`

```js
import React from 'react';
import { Route, Link } from 'react-router-dom';

import Home from './containers/Home';
import Login from './containers/Login';

export default (
  <>
    <Link to="/">home</Link>
    <Link to="/login">login</Link>

    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
  </>
);
```

`client/index.js`

```js
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Routes from '../routes';

const Root = <BrowserRouter>{Routes}</BrowserRouter>;

ReactDom.hydrate(Root, document.getElementById('root'));
```

`server/index.js`

```js
import express from 'express';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Routes from '../routes';

const app = express();
app.use(express.static('public'));

app.use('*', function (req, res) {
  const content = renderToString(
    <StaticRouter location={req.path}>{Routes}</StaticRouter>,
  );
  res.end(
    `
    <html>
      <head>
        <title>ssr</title>
      </head>
      <body>
        <div id="root">${content}</div>
        <script src='/index.js'></script>
      </body>
    </html>
  `,
  );
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
```

服务端用了 `StaticRouter` 去匹配路由。

## 引入 redux

```bash
npm i react-redux redux redux-thunk axios
```

引入后的目录：

```bash
src
├── client
│   └── index.js
├── containers
│   ├── Home.jsx
│   └── Login.jsx
├── redux
│   ├── contants.js
│   ├── index.js
│   └── user
│       ├── actions.js
│       └── reducer.js
├── routes.js
└── server
```

`redux/index.js`

```js
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import UserReducer from './user/reducer';

const reducer = combineReducers({
  user: UserReducer,
});

//创建 store，并引入中间件thunk进行异步操作的管理
const store = createStore(reducer, applyMiddleware(thunk));

//导出创建的 store
export default store;
```

`redux` 下其他文件:

```js
// contants.js
export const SET_NAME = Symbol.for('SET_NAME');

// user/actions
import axios from 'axios';
import { SET_NAME } from '../contants';

//异步操作的action(采用thunk中间件)
export const fetchName = () => {
  return (dispatch) => {
    return axios
      .get('https://mock.yonyoucloud.com/mock/13592/random/name')
      .then((res) => {
        dispatch({ type: SET_NAME, payload: res.data.name });
      });
  };
};

// user/reudcer
import { SET_NAME } from '../contants';

let defaultState = {
  name: 'alvin',
};

export default function UserReducer(state = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_NAME:
      return { ...state, name: payload };

    default:
      return state;
  }
}
```

引入 `redux`

`client/index.js`

```js
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../redux';
import Routes from '../routes';

const Root = (
  <Provider store={store}>
    <BrowserRouter>{Routes}</BrowserRouter>
  </Provider>
);

ReactDom.hydrate(Root, document.getElementById('root'));
```

服务端引入 `server/index.js`:

```js
import { Provider } from 'react-redux';
import store from '../redux';

app.use('*', function (req, res) {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path}>{Routes}</StaticRouter>
    </Provider>,
  );
});
```

修改 `Home.jsx`

```jsx | pure
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchName } from '../redux/user/actions';

const Home = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  return (
    <>
      <h2>Home, {user.name}</h2>
      <button onClick={(e) => dispatch(fetchName())}>change name</button>
    </>
  );
};

export default Home;
```

## 数据的注水与脱水

```jsx | pure
const Home = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchName());
  }, []);

  return (
    <>
      <h2>Home, {user.name}</h2>
      <button onClick={(e) => dispatch(fetchName())}>change name</button>
    </>
  );
};
```

当我们在 `Mount` 的时候，异步获取数据。而服务端并不会执行 `componentDidMount` 的操作。

此时只有客户端的渲染，也就是客户端和服务端拿到的数据是不一样的，如何做呢？

将数据进行注水和脱水。我们定义组件的获取数据的方法，名为 `loadData`。意在获取数据。

`Home.jsx`

```js
Home.loadData = (store) => {
  return store.dispatch(fetchName());
};
```

修改 `routes.js`

```js
export default [
  {
    path: '/',
    component: Home,
    exact: true,
    loadData: Home.loadData, //服务端获取异步数据的函数
    key: 'home',
  },
  {
    path: '/login',
    component: Login,
    exact: true,
    key: 'login',
  },
];
```

`redux/index.js`

```js
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import UserReducer from './user/reducer';

const reducer = combineReducers({
  user: UserReducer,
});

//服务端的store创建函数
export const getStore = () => {
  return createStore(reducer, applyMiddleware(thunk));
};
//客户端的store创建函数
export const getClientStore = () => {
  const defaultState = window.context ? window.context.state : {};
  return createStore(reducer, defaultState, applyMiddleware(thunk));
};
```

`client/index.js`

```js
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getClientStore } from '../redux';
import routes from '../routes';

const Root = (
  <Provider store={getClientStore()}>
    <BrowserRouter>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
    </BrowserRouter>
  </Provider>
);

ReactDom.hydrate(Root, document.getElementById('root'));
```

`server/index.js`

```js
// ....
import { StaticRouter, Route } from 'react-router-dom';
import { matchRoutes } from 'react-router-config'; // 使用 react-router-config 匹配路由
import { getStore } from '../redux';
import routes from '../routes';

app.use('*', function (req, res) {
  const store = getStore();
  //调用matchRoutes用来匹配当前路由(支持多级路由)
  const matchedRoutes = matchRoutes(routes, req.path);
  //promise对象数组
  const promises = [];

  matchedRoutes.forEach((item) => {
    //如果这个路由对应的组件有 loadData 方法
    if (item.route.loadData) {
      //那么就执行一次,并将store传进去
      //注意 loadData 函数调用后需要返回 Promise 对象
      promises.push(item.route.loadData(store));
    }
  });

  Promise.all(promises).then(() => {
    //此时该有的数据都已经到store里面去了
    //执行渲染的过程(res.send操作)
    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.path}>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </StaticRouter>
      </Provider>,
    );
    res.end(
      `
      <html>
        <head>
          <title>ssr</title>
        </head>
        <body>
          <div id="root">${content}</div>
          <script>
            window.context = {
              state: ${JSON.stringify(store.getState())}
            }
          </script>
          <script src='/index.js'></script>
        </body>
      </html>
    `,
    );
  });
});
```

## node 做中间层

更新目录为：

```bash
src
├── client
│   ├── index.js
│   └── request.js
├── containers
│   ├── Home.jsx
│   └── Login.jsx
├── redux
│   ├── contants.js
│   ├── index.js
│   └── user
│       ├── actions.js
│       └── reducer.js
├── routes.js
└── server
    ├── index.js
    └── request.js
```

`client/request.js`

```js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://mock.yonyoucloud.com/mock/13592',
});

export default instance;
```

`server/request.js`

```js
import axios from 'axios';

const createInstance = (req) =>
  axios.create({
    baseURL: 'https://mock.yonyoucloud.com/mock/13592',
    headers: {
      cookie: req.get('cookie') || '',
    },
  });

export default createInstance;
```

修改 `redux/index.js`

```js
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import clientAxios from '../client/request';
import serverAxios from '../server/request';

import UserReducer from './user/reducer';

const reducer = combineReducers({
  user: UserReducer,
});

//服务端的store创建函数
export const getStore = (req) => {
  return createStore(
    reducer,
    applyMiddleware(thunk.withExtraArgument(serverAxios(req))),
  );
};
//客户端的store创建函数
export const getClientStore = () => {
  const defaultState = window.context ? window.context.state : {};
  return createStore(
    reducer,
    defaultState,
    applyMiddleware(thunk.withExtraArgument(clientAxios)),
  );
};
```

修改 `server/index.js`

```js
// ...
import proxy from 'express-http-proxy'

// 当访问 /api 路由时代理到指定服务器地址
app.use(
  '/api',
  proxy('https://mock.yonyoucloud.com/mock/13592', {
    proxyReqPathResolver: function (req) {
      // return '/api' + req.url
      return req.url
    }
  })
)

app.use('*', function (req, res) {
  const store = getStore(req)
  //...
}
```

最终可以修改 `redux/user/actions`

```js
import { SET_NAME } from '../contants';

//异步操作的action(采用thunk中间件)
export const fetchName = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/random/name').then((res) => {
      console.log(res.data);
      return dispatch({ type: SET_NAME, payload: res.data.name });
    });
  };
};
```

## 多级路由渲染 renderRoutes

更新目录结构：

```bash
├── App.jsx
├── client
│   ├── index.js
│   └── request.js
├── containers
│   ├── Home.jsx
│   └── Login.jsx
├── redux
│   ├── contants.js
│   ├── index.js
│   └── user
│       ├── actions.js
│       └── reducer.js
├── routes.js
└── server
    ├── index.js
    └── request.js
```

修改 `routes.js`

```js
import Home from './containers/Home';
import Login from './containers/Login';
import App from './App';

//这里出现了多级路由
export default [
  {
    path: '/',
    component: App,
    routes: [
      {
        path: '/',
        component: Home,
        exact: true,
        loadData: Home.loadData,
        key: 'home',
      },
      {
        path: '/login',
        component: Login,
        exact: true,
        key: 'login',
      },
    ],
  },
];
```

`App.jsx`

```jsx | pure
import React from 'react';
import { renderRoutes } from 'react-router-config';

const App = (props) => {
  return (
    <>
      <h2>App...</h2>
      {renderRoutes(props.route.routes)}
    </>
  );
};

export default App;
```

修改 `client/index.js`

```js
// ...
import { renderRoutes } from 'react-router-config';

const Root = (
  <Provider store={getClientStore()}>
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
  </Provider>
);
```

修改 `server/index.js`

```js
// ...
import { matchRoutes, renderRoutes } from 'react-router-config';
const content = renderToString(
  <Provider store={store}>
    <StaticRouter location={req.path}>{renderRoutes(routes)}</StaticRouter>
  </Provider>,
);
```
