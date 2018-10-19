## rudux
`redux` 运行流程图：
![](https://user-gold-cdn.xitu.io/2018/9/12/165c9daf60abdbd6?w=638&h=479&f=jpeg&s=21322)

简单概述：**click** -> **store.dispatch(action)** -> **reduer** -> **newState** -> **viewUpdate**

**react-readux** 中 通过 **connect** 链接组件和 **redux** , **this.props.dispatch()**调用
 
 后面将会讲到...

`redux` 依赖包也是十分的简洁
![](https://user-gold-cdn.xitu.io/2018/9/14/165d8c900fb1fcd4?w=280&h=295&f=png&s=14746)
先来个`demo`

```js
const redux = require('redux')
const createStore = redux.createStore

const types = {
  UPDATE_NAME: 'UPDATE_NAME'
}

const defaultStore = {
  user: 'tom'
}

/**
 * reducer 纯函数 接收一个state,返回一个新的state
 * @param {Object} state
 * @param {Object} action [type] 必选参数
 * @return newState
 * */
function getUser(state = defaultStore, action) {
  const { type, payload } = action
  let res = Object.assign({}, defaultStore)
  switch (type) {
    case types.UPDATE_NAME:
      res.user = payload.name
      break
    default:
      return res
  }
  return res
}

const store = createStore(getUser)

/**
 * listener
 * */
store.subscribe(() => {
  console.log(store.getState())
})


/**
 * dispatch(action) action
 * */
store.dispatch({
  type: types.UPDATE_NAME,
  payload: {
    name: '大帅哥'
  }
})
//@log { name: '大帅哥' }
```
1. 用户发出 `action` 【`store.dispatch(action)`】 
2. `Store` 自动调用 `Reducer` , 返回新的 `state` 【`let nextState = getUser(previousState, action)`】
3. `State` 一旦有变化，`Store` 就会调用监听函数 【`store.subscribe(listener)`】

运行过程如下：
![](https://user-gold-cdn.xitu.io/2018/9/15/165d8e7f3f6d9205?w=635&h=931&f=png&s=95651)

#### store

`Store` 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 `Store`
常用方法：
- store.dispatch() ：分发 action 较为常用
- store.subscribe() : state 发生变化后立即执行
- store.getState() : 获取store 中存着的state

#### createStore
[createStore](https://github.com/reduxjs/redux/blob/master/src/createStore.js) 如其名，创建 `store` 下面是该方法的部分源码：
```js
/**
 * @param {Function} reducer 函数
 * @param {any} [preloadedState] The initial state
 * @param {Function} [enhancer] The store enhancer
 * @returns {Store}
 * */
export default function createStore(reducer, preloadedState, enhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(reducer, preloadedState)
  }
  // ...
  return {
    dispatch,  // 分发 action
    subscribe, // 监听器
    getState, // 获取 store 的 state 值
    replaceReducer, 
    [$$observable]: observable // 供Redux内部使用
  }
}

```
- `preloadedState`: 初始化的`initialState`，第二个参数不是`Object`,而是`Function`，`createStore`会认为你忽略了`preloadedState`而传入了一个`enhancer`
- `createStore`会返回`enhancer(createStore)(reducer, preloadedState)`的调用结果，这是常见高阶函数的调用方式。在这个调用中`enhancer`接受`createStore`作为参数，对`createStore`的能力进行增强，并返回增强后的`createStore`

#### dispatch(action)
`diapatch` 是store对象的方法，主要用来分发 `action` , 
> redux规定action一定要包含一个type属性，且type属性也要唯一

dispatch 是 store 非常核心的一个方法，也是我们在应用中最常使用的方法，下面是dispatch的源码 ：


```js
  function dispatch(action) {
    if (!isPlainObject(action)){ // 校验了action是否为一个原生js对象
      throw new Error(
        'Actions must be plain objects. ' +
          'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') { // action对象是否包含了必要的type字段
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?'
      )
    }

    if (isDispatching) {// 判断当前是否处于某个action分发过程中, 主要是为了避免在reducer中分发action
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
   // 在一系列检查完毕后，若均没有问题，将当前的状态和action传给当前reducer，用于生成新的state
    return action
  }
```

#### reducer && store.replaceReducer
Redux中负责响应action并修改数据的角色就是`reducer`，`reducer`的本质实际上是一个函数
replaceReducer: 
```js
/**
 * @desc 替换当前的reducer的函数
 * @param {Function} 
 * @return {void} 
 */
function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }
    
    currentReducer = nextReducer
    dispatch({ type: ActionTypes.REPLACE })
}
```
replaceReducer 使用场景：
- 当你的程序要进行代码分割的时候
- 当你要动态的加载不同的reducer的时候
- 当你要实现一个实时reloading机制的时候

#### 中间件 middleware 

以上介绍了redux的实现流的过程，应用场景无非于

button -- click --> `disptch` -- action --> `reducer` -- newState --> `view`

但是这种实现方式是基于同步的方式的，日常开发中当然少不了 http 这些异步请求，这种情况下必须等到服务器数据返回后才重新渲染 view, 显然某些时候回阻塞页面的展示。

举例来说，要添加日志功能，把 `Action` 和 `State` 打印出来，可以对store.dispatch进行如下改造。
```js
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
}
```
上面代码中，对store.dispatch进行了重定义，在发送 Action 前后添加了打印功能。这就是中间件的雏形。

中间件就是一个函数，对store.dispatch方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能。



#### applyMiddleware
Redux提供了`applyMiddleware`来装载`middleware`：
它是 Redux 的原生方法，**作用是将所有中间件组成一个数组，依次执行。**下面是它的源码。

```js
/**
 * @param {...Function} middlewares 
 * returns {Function} A store enhancer applying the middleware
 */
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```

所有中间件被放进了一个数组chain，然后嵌套执行，最后执行store.dispatch。可以看到，中间件内部（middlewareAPI）可以拿到`getState`和`dispatch`这两个方法

`compose` 实际上是函数式编程中的组合，接收多个函数体并且将其组合成一个新的函数，例如`compose` 后 [fn1, fn2...] 依次从右到左嵌套执行函数 而`compose`用于`applyMiddleware` 也是为了组合中间件
**dispatch = compose(...chain)(store.dispatch)**
==>
**dispatch=fn1(fn2(fn3(store.dispatch)))**
```js
/**
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 */
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```
#### redux-thunk 
上面的中间件的介绍可以知道 
redux 通过 `applyMiddleware` 来装载中间件，通过compose 方法可以组合函数

异步的问题可以通过 `redux-thunk` 解决，用法也不难 react 组件中使用相关如下：

```js
// 配置 redux 加上这个...
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
// ...
const store = createStore(getUser, compose(
  applyMiddleware(thunk)
))


// react 中使用
import { connect } from 'react-redux'

handleClick = () => {
    this.props.dispatch(
      dispatch => {
        return axios.get('https://randomuser.me/api/').then(
          res => {
            dispatch({
              type: types.CHANGE_ARRAY,
              payload: {
                name: res.data.results[0].name.title
              }
            })
          }
        )
      }
    )
}

const mapStateToProps = (state, props) => {
  return {
    name: state.demo.name
  }
}

export default connect(
  mapStateToProps
)(Demo)
```
> 处理异步的还有很多插件 如 redux-soga 等，楼主并未实践过，所以不做延伸...

## react-redux
下面是在react中使用的代码的雏形：

```jsx
import { createStore } from 'redux'

let defaultState = {
  count: 1
}

/**
 * Reducer
 * */
function demoReducer(state = defaultState, action = {}) {
  const { type, payload } = action
  const res = Object.assign({}, state)
  if (type === 'changeCount') {
    res.count = payload.count
  }
  return res
}

/**
 * @Store 存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store。
 * combineReducers({ ...reducers }) 可以组合多个reducer
 * */
const store = createStore(
  demoReducer,
  window.devToolsExtension && window.devToolsExtension() // 配置redux 开发工具
)

// ... 根元素下配置下 Provider
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)

// 组件中使用
import { connect } from 'react-redux'

//use
this.dispatch({
    type: 'changeCount',
    payload: {
        count: 22
    }
})

const mapStateToProps = (state, props) => {
  return {
    name: state.demo.name
  }
}

export default connect(
  mapStateToProps
)(Demo)
```
#### mapStateToProps 
- 用于建立组件跟 store 的 state的映射关系作为一个函数，它可以传入两个参数，结果一定要返回一个 object
- 传入`mapStateToProps`之后，会订阅store的状态改变，在每次 store 的 state 发生变化的时候，都会被调用 
- 如果写了第二个参数props，那么当props发生变化的时候，mapStateToProps也会被调用

#### mapDispatchToProps
- `mapDispatchToProps`用于建立组件跟store.dispatch的映射关系
- 可以是一个object，也可以传入函数
- 如果`mapDispatchToProps`是一个函数，它可以传入dispatch,props,定义UI组件如何发出action，实际上就是要调用dispatch这个方法

```js
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// 页面中使用... 
this.props.changeName()

const mapDispatchToProps = { changeName } =  (dispatch, props) => {
  return bindActionCreators({
    changeName: function() {
      return {
        type: types.UPDATE_NAME,
        payload: {
          name: '大大大'
        }
      }
    }
  }, dispatch)
}

export default connect(
  mapDispatchToProps
)(App)

```

## 模块化配置

下面的配置仅供参考。

#### 安装
```
npm install redux react-redux redux-thunk --save
npm install immutability-helper --save
npm install babel-plugin-transform-decorators-legacy -D
```

当state中存放的字段内存未发生改变时，视图并不会更新。所以借用到了 [immutability-helper](https://github.com/kolodny/immutability-helper)，辅助更新
当然也可以替换掉json数组，这样便会触发视图的更新了。

src 下新建 store 文件，如下所示：

![](https://user-gold-cdn.xitu.io/2018/9/15/165dbf4e9e63a9ae?w=263&h=286&f=png&s=11539)

#### 配置文件
`types.js` 文件
```js
export const UPDATE_NAME = 'UPDATE_NAME'
export const UPODATE_ARRAY = 'UPODATE_ARRAY'

```

`demoModule.js` 文件
```js
import * as types from '../types'
import update from 'immutability-helper'

const defaultState = {
  name: '默认值',
  jsonArray: [{ name: '数组默认值' }],
  array: []
}

/**
 * demo reducer
 * */
export default function demo(state = defaultState, action = {}) {
  const { type, payload } = action
  const res = Object.assign({}, state)
  switch (type) {
    case types.UPDATE_NAME:
      res.name = payload.name
      break
    case types.UPODATE_ARRAY:
      res.jsonArray = update(state.jsonArray, {
        [0]: {
          $set: { name: payload.name }
        }
      })
      break
    default:

  }
  return res
}
```

`modeules` 文件夹下的`index.js`（模块入口文件）
```js
import { combineReducers } from 'redux'

import demo from './demoModule'

const Reducers = combineReducers({
  demo
})

export default Reducers
```

`combineReducers` : 用于合并 `reducers`

`store` 文件下的 `index` （`redux` 总入口文件）
```
import { createStore, applyMiddleware, compose } from 'redux'
import Modules from './modules'
import thunk from 'redux-thunk'

const store = createStore(Modules, compose(
  applyMiddleware(thunk),
  window.devToolsExtension && window.devToolsExtension() // 配置redux 开发工具
));

export default store
```
- `Redux` 默认只处理同步，异步任务需要 `redux-thunk` 中间件
- 引入 `applyMiddleware` 来处理中间件
- 使用 `compose` 结合 `thunk` 和 `window.devToolsExtension`
 
修改src 下`index.js`（渲染根组件的入口文件）

```jsx
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'))
```

测试: `demo.jsx` 组件
```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as types from './types'
import axios from 'axios'
import { Button } from 'antd'

/**
 * @state store 中的state
 * @props 组件内接收的props 写了第二个参数props，那么当组件内props发生变化的时候，mapStateToProps也会被调用
 * @return Object
 * */
const mapStateToProps = (state, props) => {
  return {
    name: state.demo.name,
    jsonArray: state.demo.jsonArray,
    array: state.demo.array,
  }
}


@connect(mapStateToProps)
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleClick = (type) => {
    switch (type) {
      case 1:
        // 常规调用
        this.props.dispatch({
          type: types.UPDATE_NAME,
          payload: {
            name: '同步调用redux'
          }
        })
        break
      case 2:
        // 异步请求
        this.props.dispatch(
          dispatch => {
            return axios.get('https://randomuser.me/api/').then(
              res => {
                dispatch({
                  type: types.UPDATE_NAME,
                  payload: {
                    name: res.data.results[0].name.title
                  }
                })
              }
            )
          }
        )
        break
      case 3:
        // 改变json数组，通过普通方式
        this.props.dispatch({
          type: types.UPODATE_ARRAY,
          payload: {
            name: '这是需要被渲染的 name'
          }
        })
        break
      default:

    }
  }

  componentWillReceiveProps() {
    console.log('props change')
  }

  render() {
    const { name, jsonArray } = this.props
    return (
      <div>
        name: {name} <br/>
        jsonArray[0]['name'] : {jsonArray[0]['name']}<br/>
        <Button onClick={e => this.handleClick(1)}>常规调用</Button>
        <Button onClick={e => this.handleClick(2)}>异步调用</Button>
        <Button onClick={e => this.handleClick(3)}>改变json数组</Button>
      </div>
    )
  }
}

export default App
```
上面用了装饰器模式来 connect ， 配置一下 babel 就好了
```
"plugins": [
  "transform-decorators-legacy"
]
```
以上配置，仅供参考，网上有更多更好的，也求大家推荐一下更好地配置。这是一篇学习记录，学海无涯，希望自己加油...

参考
- [阮一峰 redux 入门教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)