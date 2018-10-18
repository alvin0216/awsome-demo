import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// 配置 redux
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducers from './redux/reducers'

// 导入 redux-sage
import createSagaMiddleware from 'redux-saga'
import rootSaga from './redux/saga'

// 第一步 创建 Saga middleware
const sagaMiddleware = createSagaMiddleware()

// 第二步 使用 applyMiddleware 将 middleware 连接至 Store
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

// 第三步 使用 sagaMiddleware.run(rootSaga) 运行 Saga
sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
