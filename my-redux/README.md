---
title: redux 原理以及实现
date: 2020-03-02 16:32:28
---

## redux 的实现

本文从零实现一个简单的 `redux` 和 `react-redux`，主要内容在于

1. `redux` 的设计思路及实现原理
2. `redux 中间件`的设计思路及实现原理
3. `react-redux` 的设计思路及实现原理

`redux` 是一个状态管理器，里面存放着数据，比如我们创建 `store.js`，在里面我们存放着这些数据，只需要在任何地方引用这个文件就可以拿到对应的状态值：

```js
let state = {
  count: 1
}
```

我们读取和修改下状态：

```js
console.log(state.count)
state.count = 2
```

现在我们实现了状态（计数）的修改和使用了！当然上面的有一个很明显的问题：

1. 这个状态管理器只能管理 `count`，不通用.
2. 修改 `count` 之后，使用 `count` 的地方不能收到通知。

### 实现 subscribe

我们可以使用发布-订阅模式来解决这个问题。我们用个函数封装一下这个 `redux`

```js
function createStore(initState) {
  let state = initState
  let listeners = []

  /* 订阅函数 */
  function subscribe(listener) {
    listeners.push(listener)
  }

  function changeState(newState) {
    state = newState
    /* 执行通知 */
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }

  function getState() {
    return state
  }

  return { subscribe, changeState, getState }
}
```

到这里我们完成了一个简单的状态管理器。

1. `state` 的数据可以自由的定
2. 我们修改状态，在订阅的地方监听变化，可以实现监听。

```js
let initState = {
  count: 1,
  info: {
    age: 18
  }
}

let store = createStore(initState)

store.subscribe(() => {
  let state = store.getState()
  console.log('subscribe function one: ', state)
})
store.subscribe(() => {
  let state = store.getState()
  console.log('subscribe function two: ', state)
})

store.changeState({ ...store.getState(), count: store.getState().count + 1 })
store.changeState({
  ...store.getState(),
  info: { age: store.getState().info.age - 1 }
})

// ==== result
// subscribe function one:  { count: 2, info: { age: 18 } }
// subscribe function two:  { count: 2, info: { age: 18 } }
// subscribe function one:  { count: 2, info: { age: 17 } }
// subscribe function two:  { count: 2, info: { age: 17 } }
```

这里需要理解的是 `createStore`，提供了 `changeState`，`getState`，`subscribe` 三个能力。

在上面的函数中，我们调用 `store.changeState` 可以改变 `state` 的值，这样就存在很大的弊端了。比如 `store.changeState({})`

> 我们一不小心就会把 `store` 的数据清空，或者误修改了其他组件的数据，那显然不太安全，出错了也很难排查，因此我们需要有条件地操作 `store`，防止使用者直接修改 `store` 的数据。

因此，我们需要一个约束来修改 `state` 的值，而不允许意外的情况来将 `state` 的值清空或者误操作。我们可以分两步来解决这个问题：

1. `dispatch`: 制定一个 `state` 修改计划，告诉 `store`，我的修改计划是什么。
2. `reducer`: 修改 `store.changeState` 方法，告诉它修改 `state` 的时候，按照我们的计划修改。

也即，我们将 `store.changeState` 改写为 `store.dispatch`, 在函数中传递多一个 `reducer` 函数来约束状态值的修改。

### 实现 reducer

> reducer 是一个纯函数，接受一个 state, 返回新的 state。

```js
function createStore(reducer, initState) {
  let state = initState
  let listeners = []

  /* 订阅函数 */
  function subscribe(listener) {
    listeners.push(listener)
  }

  /* state 值的修改 */
  function dispatch(action) {
    state = reducer(state, action)
    /* 执行通知 */
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }

  function getState() {
    return state
  }

  return { subscribe, dispatch, getState }
}
```

我们来尝试使用 `dispatch` 和 `reducer` 来实现自增和自减

```js
let initState = {
  count: 1,
  info: {
    age: 18
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }
    case 'DECREMENT':
      return { ...state, count: state.count - 1 }
    default:
      return state
  }
}

let store = createStore(reducer, initState)

store.subscribe(() => {
  let state = store.getState()
  console.log('subscribe function: ', state)
})

store.dispatch({ type: 'INCREMENT' }) // 自增
store.dispatch({ type: 'DECREMENT' }) // 自减
store.dispatch({ count: 2 }) // 计划外：不生效
```

我们知道 `reducer` 是一个约束函数，接收老的 `state`，按计划返回新的 `state`。那我们项目中，有大量的 `state`，每个 `state` 都需要约束函数，如果全部写在一起会是啥样子呢？

所有的计划写在一个 `reducer` 函数里面，会导致 `reducer` 函数及其庞大复杂。下面将封装 `combineReducers` 来颗粒化 `reducer` 函数。

### 实现 combineReducers

#### 颗粒化 reducer

按经验来说，我们肯定会按组件维度来拆分出很多个 `reducer` 函数，然后通过一个函数来把他们合并起来。

我们来管理两个 `state`，一个 `counter`，一个 `info`。

```js
let state = {
  counter: { count: 0 },
  info: { age: 18 }
}
```

他们各自的 `reducer`

```js
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    default:
      return state
  }
}

function infoReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT-AGE':
      return { age: state.age + 1 }
    default:
      return state
  }
}
```

我们尝试实现下 `combineReducers` 函数

1. 传入对象参数，`key` 值即为 `state` 状态树的 `key` 值， `value` 为对应的 `reducer` 函数。
2. 遍历对象参数，执行每一个 `reducer` 函数，传入 `state[key]`, 函数获得每个 `reducer` 最新的 `state` 值。
3. 耦合 `state` 的值, 并返回。返回合并后的新的 `reducer` 函数。

```js
function combineReducers(reducers) {
  /* reducerKeys = ['counter', 'info']*/
  const reducerKeys = Object.keys(reducers)

  /*返回合并后的新的reducer函数*/
  return function combination(state = {}, action) {
    /*生成的新的state*/
    const nextState = {}

    /*遍历执行所有的reducers，整合成为一个新的state*/
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i]
      const reducer = reducers[key]
      /*之前的 key 的 state*/
      const previousStateForKey = state[key]
      /*执行 分 reducer，获得新的state*/
      const nextStateForKey = reducer(previousStateForKey, action)

      nextState[key] = nextStateForKey
    }
    return nextState
  }
}
```

使用 `combineReducers`:

```js
const reducers = combineReducers({
  counter: counterReducer,
  info: infoReducer
})

let store = createStore(reducers, initState)

store.subscribe(() => {
  let state = store.getState()
  console.log('subscribe function: ', state)
})

store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT-AGE' })
```

然而这还不够，我们把 `reducer` 按组件维度拆分了，通过 `combineReducers` 合并了起来。 但是还有个问题， `state` 我们还是写在一起的，这样会造成 `state` 树很庞大，不直观，很难维护。我们需要拆分，一个 `state`，一个 `reducer` 写一块。

#### 颗粒化 state

改写 `combineReducers` 函数，无非很简单，在 `createStore` 函数中执行 `dispatch({ type: Symbol() })`

```js
function createStore(reducer, initState) {
  let state = initState
  let listeners = []

  /* 订阅函数 */
  function subscribe(listener) {
    listeners.push(listener)
  }

  function dispatch(action) {
    state = reducer(state, action)
    /* 执行通知 */
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }

  /* 注意！！！只修改了这里，用一个不匹配任何计划的 type，来获取初始值 */
  dispatch({ type: Symbol() })

  function getState() {
    return state
  }

  return { subscribe, dispatch, getState }
}
```

将 `state` 分别传入各自的 `reducer`:

```js
function counterReducer(state = { count: 1 }, action) {
  //...
}

function infoReducer(state = { age: 18 }, action) {
  //...
}

// 合并 reducer
const reducers = combineReducers({
  counter: counterReducer,
  info: infoReducer
})

// 移除 initState
let store = createStore(reducers)

console.log(store.getState()) // { counter: { count: 1 }, info: { age: 18 } }
```

我们思考下这行可以带来什么效果？

1. `createStore` 的时候，用一个不匹配任何 `type` 的 `action`，来触发 `state = reducer(state, action)`
2. 因为 `action.type` 不匹配，每个子 `reducer` 都会进到 `default` 项，返回自己初始化的 `state`，这样就获得了初始化的 `state` 树了。

## redux 中间件的实现

如果您使用过 `Express` 和 `Koa` 之类的服务器端库，那么您可能已经很熟悉中间件的概念。

所谓中间件，我们可以理解为拦截器，用于对某些过程进行拦截和处理，且中间件之间能够串联使用。这里主要是对 `dispatch` 的扩展，或者说重写，增强 `dispatch` 的功能。

### 中间件示例

首先让我们实现 `redux-logger` 插件，即打印日志功能，记录修改前后的 `state` 和 `action`，我们可以通过重写 `store.dispatch` 来实现：

```js
const reducers = combineReducers({ counter: counterReducer })

let store = createStore(reducers)
const next = store.dispatch

// 重写 dispatch
store.dispatch = action => {
  console.log('prevState: ', store.getState())
  console.log('action', action)
  next(action)
  console.log('nextState: ', store.getState())
}

store.dispatch({ type: 'INCREMENT' })
```

输出结果

```bash
prevState:  { counter: { count: 1 } }
action { type: 'INCREMENT' }
nextState:  { counter: { count: 2 } }
```

现在我们已经实现了一个简单的 `redux-logger` 中间件了。我又有一个需求，需要记录每次数据出错的原因，我们扩展下 `dispatch`

```js
store.dispatch = action => {
  try {
    next(action)
  } catch (err) {
    console.error('错误报告: ', err)
  }
}
```

这样每次 dispatch 出异常的时候，我们都会记录下来。

### 多中间件的合作

我现在既需要记录日志，又需要记录异常，怎么办？当然很简单了，两个函数合起来呗！

```js
store.dispatch = action => {
  try {
    console.log('prevState: ', store.getState())
    console.log('action', action)
    next(action)
    console.log('nextState: ', store.getState())
  } catch (err) {
    console.error('错误报告: ', err)
  }
}
```

如果又来一个需求怎么办？接着改 `dispatch` 函数？那再来 10 个需求呢？到时候 `dispatch` 函数肯定庞大混乱到无法维护了！

我们需要考虑如何实现扩展性很强的多中间件合作模式。

1. 我们把 `loggerMiddleware` 提取出来

```js
const loggerMiddleware = action => {
  console.log('prevState: ', store.getState())
  console.log('action', action)
  next(action)
  console.log('nextState: ', store.getState())
}
```

2. 我们把 `exceptionMiddleware` 提取出来

```js
const exceptionMiddleware = action => {
  try {
    /*next(action)*/
    loggerMiddleware(action)
  } catch (err) {
    console.error('错误报告: ', err)
  }
}
store.dispatch = exceptionMiddleware
```

3. 现在的代码有一个很严重的问题，就是 `exceptionMiddleware` 里面写死了 `loggerMiddleware`，我们需要让 `next(action)` 变成动态的，随便哪个中间件都可以

```js
const exceptionMiddleware = next => action => {
  try {
    /*loggerMiddleware(action);*/
    next(action)
  } catch (err) {
    console.error('错误报告: ', err)
  }
}
/*loggerMiddleware 变成参数传进去*/
store.dispatch = exceptionMiddleware(loggerMiddleware)
```

4. 同样的道理，`loggerMiddleware` 里面的 `next` 现在恒等于 `store.dispatch`，导致 `loggerMiddleware` 里面无法扩展别的中间件了！我们也把 `next` 写成动态的

```js
const loggerMiddleware = next => action => {
  console.log('this state', store.getState())
  console.log('action', action)
  next(action)
  console.log('next state', store.getState())
}
```

到这里为止，我们已经探索出了一个扩展性很高的中间件合作模式！

```js
const store = createStore(reducer)
const next = store.dispatch

const loggerMiddleware = next => action => {
  console.log('this state', store.getState())
  console.log('action', action)
  next(action)
  console.log('next state', store.getState())
}

const exceptionMiddleware = next => action => {
  try {
    next(action)
  } catch (err) {
    console.error('错误报告: ', err)
  }
}

store.dispatch = exceptionMiddleware(loggerMiddleware(next))
```

这时候我们开开心心的新建了一个 `loggerMiddleware.js`，一个 `exceptionMiddleware.js` 文件，想把两个中间件独立到单独的文件中去。会碰到什么问题吗？

`loggerMiddleware` 中包含了外部变量 `store`，导致我们无法把中间件独立出去。那我们把 `store` 也作为一个参数传进去好了~

```js
const store = createStore(reducer)
const next = store.dispatch

const loggerMiddleware = store => next => action => {
  console.log('this state', store.getState())
  console.log('action', action)
  next(action)
  console.log('next state', store.getState())
}

const exceptionMiddleware = store => next => action => {
  try {
    next(action)
  } catch (err) {
    console.error('错误报告: ', err)
  }
}

const logger = loggerMiddleware(store)
const exception = exceptionMiddleware(store)
store.dispatch = exception(logger(next))
```

到这里为止，我们真正的实现了两个可以独立的中间件啦！

现在我有一个需求，在打印日志之前输出当前的时间戳。用中间件来实现！

```js
const timeMiddleware = store => next => action => {
  console.log('time', new Date().getTime())
  next(action)
}

const time = timeMiddleware(store)
store.dispatch = exception(time(logger(next)))
```

### 实现 applyMiddleware

上一节我们已经完全实现了正确的中间件！但是中间件的使用方式不是很友好

```js
let store = createStore(reducers)
const next = store.dispatch

const loggerMiddleware = store => next => action => {
  console.log('this state', store.getState())
  console.log('action', action)
  next(action)
  console.log('next state', store.getState())
}

const exceptionMiddleware = store => next => action => {
  try {
    next(action)
  } catch (err) {
    console.error('错误报告: ', err)
  }
}

const timeMiddleware = store => next => action => {
  console.log('time', new Date().getTime())
  next(action)
}

const time = timeMiddleware(store)
const logger = loggerMiddleware(store)
const exception = exceptionMiddleware(store)
store.dispatch = exception(time(logger(next)))
```

其实我们只需要知道三个中间件，剩下的细节都可以封装起来！我们通过扩展 `createStore` 来实现！

先来看看期望的用法

```js
/*接收旧的 createStore，返回新的 createStore*/
const newCreateStore = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware)(createStore)

/*返回了一个 dispatch 被重写过的 store*/
const store = newCreateStore(reducer)
```

实现 `applyMiddleware`

```js
const applyMiddleware = function(...middlewares) {
  /*返回一个重写createStore的方法*/
  return function rewriteCreateStoreFunc(oldCreateStore) {
    /*返回重写后新的 createStore*/
    return function newCreateStore(reducer, initState) {
      /*1. 生成store*/
      const store = oldCreateStore(reducer, initState)
      /*给每个 middleware 传下store，相当于 const logger = loggerMiddleware(store);*/
      /* const chain = [exception, time, logger]*/
      const chain = middlewares.map(middleware => middleware(store))
      let dispatch = store.dispatch
      /* 实现 exception(time((logger(dispatch))))*/
      chain.reverse().map(middleware => {
        dispatch = middleware(dispatch)
      })

      /*2. 重写 dispatch*/
      store.dispatch = dispatch
      return store
    }
  }
}
```

现在还有个小问题，我们有两种 `createStore` 了。

```js
/*没有中间件的 createStore*/
let store = createStore(reducers, initState)

/*有中间件的 createStore*/
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware)
const newCreateStore = rewriteCreateStoreFunc(createStore)
const store = newCreateStore(reducer, initState)
```

为了让用户用起来统一一些，我们可以很简单的使他们的使用方式一致，我们修改下 `createStore` 方法

```js
function createStore(reducer, initState, rewriteCreateStoreFunc) {
  /*如果有 rewriteCreateStoreFunc，那就采用新的 createStore */
  if (rewriteCreateStoreFunc) {
    const newCreateStore = rewriteCreateStoreFunc(createStore)
    return newCreateStore(reducer, initState)
  }
  /*否则按照正常的流程走*/
  //...
}
```

最终的用法

```js
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware)
const store = createStore(reducer, initState, rewriteCreateStoreFunc)
```

### compose

我们的 `applyMiddleware` 中，把 `[A, B, C]` 转换成 `A(B(C(next)))`，是这样实现的

```js
const chain = [A, B, C]
let dispatch = store.dispatch
chain.reverse().map(middleware => {
  dispatch = middleware(dispatch)
})
```

`redux` 提供了一个 `compose` 方式，可以帮我们做这个事情

```js
const chain = [A, B, C]
dispatch = compose(...chain)(store.dispatch)
```

看下他是如何实现的

```js
export default function compose(...funcs) {
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

当然 `compose` 函数对于新人来说可能比较难理解，你只需要他是做什么的就行啦！

### 省略 initState

有时候我们创建 `store` 的时候不传 `initState`，我们怎么用？

```js
const store = createStore(reducer, {}, rewriteCreateStoreFunc)
```

`redux` 允许我们这样写

```js
const store = createStore(reducer, rewriteCreateStoreFunc)
```

我们仅需要改下 `createStore` 函数，如果第二个参数是一个 `objec`t，我们认为他是 `initState`，如果是 `function`，我们就认为他是 `rewriteCreateStoreFunc`。

```js
function craeteStore(reducer, initState, rewriteCreateStoreFunc) {
  if (typeof initState === 'function') {
    rewriteCreateStoreFunc = initState
    initState = undefined
  }
  //...
}
```

## react-redux 的实现

在上文，我们完成了一个简单的 `redux`。
一个组件如果想从 store 存取公用状态，需要进行四步操作：`import` 引入 `store`、`getState` 获取状态、`dispatch` 修改状态、`subscribe` 订阅更新，代码相对冗余，

而 `react-redux` 就提供了一种合并操作的方案：`react-redux` 提供 `Provider` 和 `connect` 两个 API，`Provider` 将 `store` 放进 `this.context` 里，省去了 `import` 这一步，`connec`t 将 `getState`、`dispatch` 合并进了 `this.props`，并自动订阅更新，简化了另外三步，

### 实现 Provider

```js
import React from 'react'
import PropTypes from 'prop-types'

export default class Provider extends React.Component {
  // 需要声明静态属性childContextTypes来指定context对象的属性,是context的固定写法
  static childContextTypes = {
    store: PropTypes.object
  }

  // 实现getChildContext方法,返回context对象,也是固定写法
  getChildContext() {
    return { store: this.store }
  }

  constructor(props, context) {
    super(props, context)
    this.store = props.store
  }

  // 渲染被Provider包裹的组件
  render() {
    return this.props.children
  }
}
```

完成 `Provider` 后，我们就能在组件中通过 `this.context.store` 这样的形式取到 `store`，不需要再单独 `import store`。

### 实现 connect

下面我们来思考一下如何实现 `connect`，我们先回顾一下 `connect` 的使用方法：

```js
connect(mapStateToProps, mapDispatchToProps)(App)
```

我们已经知道，`connect` 接收 `mapStateToProps`、`mapDispatchToProps` 两个方法，然后返回一个高阶函数，这个高阶函数接收一个组件，返回一个高阶组件（其实就是给传入的组件增加一些属性和功能）`connect` 根据传入的 `map`，将 `state` 和 `dispatch(action)`挂载子组件的 `props` 上，我们直接放出 `connect` 的实现代码，寥寥几行，并不复杂：

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import bindActionCreators from '../redux/bindActionCreators'

export default function connect(mapStateToProps, mapDispatchToProps) {
  return function(Component) {
    class Connect extends React.Component {
      componentDidMount() {
        // 从context获取store并订阅更新
        this.context.store.subscribe(this.handleStoreChange.bind(this))
      }
      handleStoreChange() {
        // 触发的方法有多种,这里为了简洁起见,直接forceUpdate强制更新,读者也可以通过setState来触发子组件更新
        this.forceUpdate()
      }

      render() {
        const dispathProps =
          typeof mapDispatchToProps && bindActionCreators(mapDispatchToProps, this.context.store.dispatch)

        return (
          <Component
            // 传入该组件的props,需要由connect这个高阶组件原样传回原组件
            {...this.props}
            // 根据mapStateToProps把state挂到this.props上
            {...mapStateToProps(this.context.store.getState())}
            // 根据mapDispatchToProps把dispatch(action)挂到this.props上
            {...dispathProps}
          />
        )
      }
    }
    // 接收context的固定写法
    Connect.contextTypes = {
      store: PropTypes.object
    }
    return Connect
  }
}
```

## 文末

代码见：[实现 redux 和 react-redux](https://github.com/gershonv/guodada-code/tree/master/my-redux)

源自于 [完全理解 redux（从零实现一个 redux](https://github.com/brickspert/blog/issues/22)
借鉴于 [10 行代码看尽 redux 原理](https://juejin.im/post/5def4831e51d45584b585000#heading)
