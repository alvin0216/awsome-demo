import express from 'express';
import proxy from 'express-http-proxy';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { getStore } from '../redux';
import routes from '../routes';

const app = express();
app.use(express.static('public'));

// 当访问 /api 路由时代理到指定服务器地址
app.use(
  '/api',
  proxy('https://mock.yonyoucloud.com/mock/13592', {
    proxyReqPathResolver: function (req) {
      // return '/api' + req.url
      return req.url;
    },
  }),
);

app.use('*', function (req, res) {
  const store = getStore(req);
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
    console.log(store.getState());
    //此时该有的数据都已经到store里面去了
    //执行渲染的过程(res.send操作)
    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.path}>{renderRoutes(routes)}</StaticRouter>
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

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
