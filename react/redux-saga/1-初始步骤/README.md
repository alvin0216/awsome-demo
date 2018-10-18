## 初始步骤

### 安装

使用 `create-react-app`, 然后删除不必要的文件。如下
![](https://user-gold-cdn.xitu.io/2018/10/18/16685bbb457433ec?w=289&h=155&f=png&s=6442)

```js
npm i yarn -g //  下面的命令均使用 yarn
yarn add redux react-readux redux-saga
yarn add redux-devtools-extension -D
```

### index.js && App.jsx

- index.js

```jsx
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
```

- App.jsx

```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { increment } from './redux/actions.js'

class App extends Component {
  onIncrement = () => {
    this.props.increment()
  }

  render() {
    return (
      <div className="App">
        <h2>{this.props.counter}</h2>
        <button onClick={this.onIncrement}>increment</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  counter: state.counter
})

export default connect(
  mapStateToProps,
  { increment }
)(App)
```

### 创建 redux 相关文件

#### actions.js

```js
export const increment = () => ({
  type: 'INCREMENT'
})
```

#### reducers.js

```js
import { combineReducers } from 'redux'

const counterReducer = (state = 1, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    default:
      return state
  }
}

export default combineReducers({
  counter: counterReducer
})
```

#### saga.js

```js
import { all } from 'redux-saga/effects'

function* helloSaga() {
  yield console.log('Hello Sagas!')
}

export default function* rootSage() {
  yield all([helloSaga()])
}
```

到目前为止，我们的 `Saga` 并没做什么特别的事情。它只是打印了一条消息，然后退出。
