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

## 发起异步调用

- actions.js

添加

```js
export const incrementAsync = () => ({
  type: 'INCREMENT_ASYNC'
})
```

- reducers.js

添加一个 case

```js
  case 'INCREMENT_ASYNC':
      return state + 1
```

- App.jsx

调用

```jsx
import { increment, incrementAsync } from './redux/actions.js'

onIncrementAsync = () => {
  this.props.incrementAsync() // 相当于 this.props.dispatch({ type: 'INCREMENT_ASYNC' })
}

//...
<button onClick={this.onIncrementAsync}>incrementAsync</button>

export default connect(
  mapStateToProps,
  { increment, incrementAsync }
)(App)
```

- saga.js 【重点】

```jsx
import { delay } from 'redux-saga' // Returns a Promise that will resolve after ms milliseconds with val

/**
 * all - all([...effects]) | all(effects)
         命令 middleware 并行地运行多个 Effect，并等待它们全部完成。
 *       
 * put - put(action) 
         触发一个 action, 这个 effect 是非阻塞型的
 *        
 * takeEvery - takeEvery(pattern, saga, ...args)
               在发起（dispatch）到 Store 并且匹配 pattern 的每一个 action 上派生一个 saga
               - pattern: String | Array | Function
               - saga: Function
               - args: Array<any>

 */
import { all, put, takeEvery } from 'redux-saga/effects'

export function* incrementAsync() {
  yield delay(1000)
  yield put({ type: 'INCREMENT' })
}

export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

export default function* rootSage() {
  yield all([watchIncrementAsync()])
}
```

执行步骤：

![](https://user-gold-cdn.xitu.io/2018/10/18/16685ea75d4100da?w=1017&h=564&f=png&s=75024)

我们引入了一个工具函数 `delay`，这个函数返回一个延迟 1 秒再 `resolve` 的 `Promise` 我们将使用这个函数去 block(阻塞) `Generator`
Sagas 被实现为`Generator functions`，它会 yield 对象到 `redux-saga middleware`。被 yield 的对象都是一类指令，指令可被 `middleware` 解释执行。当 `middleware` 取得一个 `yield` 后的 `Promise`，`middleware` 会暂停 `Saga`，直到 `Promise` 完成。 在上面的例子中，`incrementAsync` 这个 `Saga` 会暂停直到 delay 返回的 `Promise` 被 `resolve`，这个 `Promise` 将在 1 秒后 resolve。

- `redux-saga/effect` 中的 `all`

假设我们现在有两个 saga, 如何并发执行（不考虑执行顺序）saga 函数呢？all 用处就在这里 `all([...effects])`

改写 saga.js ，添加

```js
function* helloSaga() {
  yield console.log('Hello Sagas!')
}
export default function* rootSage() {
  yield all([watchIncrementAsync(), helloSaga()])
}
```

## 请求的状态处理

让我们通过常见的 AJAX 例子来演示一下。每次点击按钮时，我们发起一个 `FETCH_USER_REQUEST` 的 action。 我们想通过启动一个从服务器获取一些数据的任务，来处理这个 action。

- 添加 actions.js

```js
export const fetchUser = () => ({
  type: 'FETCH_USER_REQUEST'
})
```

- reducers.js

```js
//...
const userState = {
  isFetching: false,
  error: null,
  user: null
}

const userReducer = (state = userState, action = {}) => {
  switch (action.type) {
    case 'FETCH_USER_REQUEST':
      return {
        isFetching: true,
        error: null,
        user: null
      }
    case 'FETCH_USER_SUCCEEDED':
      return {
        isFetching: false,
        error: null,
        user: action.user
      }
    case 'FETCH_USER_FAILURE':
      return {
        isFetching: false,
        error: action.error,
        user: null
      }
    default:
      return state
  }
}

export default combineReducers({
  counter: counterReducer,
  user: userReducer
})
```

- saga.js

```js
import axios from 'axios'
//...
// user
function* fetchUser() {
  try {
    const user = yield call(axios.get, 'https://jsonplaceholder.typicode.com/users')
    yield put({ type: 'FETCH_USER_SUCCEEDED', user: user })
  } catch (error) {
    yield put({ type: 'FETCH_USER_FAILURE', error: error.message })
  }
}

function* watchFetchUser() {
  yield takeEvery('FETCH_USER_REQUEST', fetchUser)
}

export default function* rootSage() {
  yield all([watchIncrementAsync(), helloSaga(), watchFetchUser()])
}
```

- App.jsx

```jsx
import { increment, incrementAsync, fetchUser } from './redux/actions.js'

onFetchUser = () => {
  this.props.fetchUser()
}

//...
const { isFetching, error, user } = this.props.user
return (
  <div>
    <button onClick={this.onFetchUser}>fetchUser</button>
    <br />
    {error ? error : isFetching ? 'Loading...' : user && user.data[0].name}
  </div>
)

const mapStateToProps = state => ({
  counter: state.counter,
  user: state.user
})

export default connect(
  mapStateToProps,
  { increment, incrementAsync, fetchUser }
)(App)
```

点击 `fetchUser` 就可以看到请求状态

## takeEvery , takeLastest

有时候我们不希望用户频繁的点击发送请求， 这样会给服务器造成压力。这时候 `takeLatest` 就派上用场了, 重复点击执行的 `saga` 函数, `takeLatest` 只执行最新一次触发的 `saga` 函数

- `takeEvery(pattern, saga, ...args)`
  - 在发起（dispatch）到 Store 并且匹配 pattern 的每一个 action 上派生一个 saga。
- `takeLatest(pattern, saga, ...args)`

  - 在发起到 Store 并且匹配 pattern 的每一个 action 上派生一个 saga。并自动取消之前所有已经启动但仍在执行中的 saga 任务。

- 改写 saga

```js
import { all, put, call, takeEvery, takeLatest } from 'redux-saga/effects'

function* watchFetchUser() {
  yield takeLatest('FETCH_USER_REQUEST', fetchUser)
}
```

改写后再进行测试就可以看到效果了

## 相关链接

- [https://redux-saga.js.org/](https://redux-saga.js.org/)
- [https://redux-saga-in-chinese.js.org](https://redux-saga-in-chinese.js.org)
