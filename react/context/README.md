---
title: react-context
date: 2018-11-09 09:58:42
categories: React
tags: React
toc: true
comments: true
---

## 简单使用

`Context` 设计目的是为共享那些被认为对于一个组件树而言是“全局”的数据，你可以看做为 `redux`，因为 `redux` 也是通过这个东东实现的。

```jsx
import React, { Component } from 'react'

/**
 * 1. 创建 context
 * 2. 根组件 App 包裹 MyContext.Provider
 * 3. App => Father => Child => MyContext.Consumer => context.age 取出结果
 */
const MyContext = React.createContext()

const Child = () => (
  <MyContext.Consumer>{({ age }) => <p>My age is {age}</p>}</MyContext.Consumer>
)

const Father = () => <Child />

class App extends Component {
  render() {
    return (
      <MyContext.Provider value={{ age: 22 }}>
        <Father />
      </MyContext.Provider>
    )
  }
}

export default App
```

## 理论知识

### React.createContext

```jsx
const { Provider, Consumer } = React.createContext(defaultValue)
```

创建一对 { `Provider`, `Consumer` }。当 React 渲染 `context` 组件 `Consumer` 时，它将从组件树的上层中最接近的匹配的 `Provider` 读取当前的 `context` 值。

### Provider

```jsx
<Provider value={/* some value */}>

```

React 组件允许 `Consumers` 订阅 `context` 的改变。
接收一个 `value` 属性传递给 `Provider` 的后代 `Consumers`。一个 `Provider` 可以联系到多个 `Consumers`。Providers 可以被嵌套以覆盖组件树内更深层次的值。

### Consumer

```jsx
<Consumer>
  {value => /* render something based on the context value */}
</Consumer>
```

一个可以订阅 `context` 变化的 React 组件。

注意，`MyContext.Consumer` 使用的是 `render props` 这种模式，`render props` 模式指的是让 `prop` 可以是一个 `render` 函数

## 父子耦合

经常需要从组件树中某个深度嵌套的组件中更新 `context`。在这种情况下，可以通过 `context` 向下传递一个函数，以允许 `Consumer` 更新 `context` ：

```jsx
import React, { Component } from 'react'

const MyContext = React.createContext()

const Child = () => (
  <MyContext.Consumer>
     {ctx => (
      <div>
        <p>My age is {ctx.age}</p>
        <button onClick={ctx.changeAge}>changeAge</button>
      </div>
    )}
  </MyContext.Consumer>
)

const Father = () => <Child />

class App extends Component {
  state = {
    age: 22
  }
  
  changeAge = () => {
    this.setState(prevState => ({
      age: ++prevState.age
    }))
  }

  render() {
    return (
      <MyContext.Provider value={{
        age: this.state.age,
        changeAge: this.changeAge
      }}>
        <Father />
      </MyContext.Provider>
    )
  }
}

export default App
```

## 作用于多个上下文

为了保持 `context` 快速进行二次渲染， `React` 需要使每一个 `Consumer` 在组件树中成为一个单独的节点。

```jsx
import React, { Component } from 'react'

const MyContext = React.createContext()

const UserContext = React.createContext()

const Child = () => (
  <MyContext.Consumer>
    {ctx => (
      <UserContext.Consumer>
        {user => (
          <div>
            <p>My name is {user.name}</p>
            <p>My age is {ctx.age}</p>
            <button onClick={ctx.changeAge}>changeAge</button>
          </div>
        )}
      </UserContext.Consumer>
    )}
  </MyContext.Consumer>
)

const Father = () => <Child />

class App extends Component {
  state = {
    age: 22,
    name: '郭大大'
  }

  changeAge = () => {
    this.setState(prevState => ({
      age: ++prevState.age
    }))
  }

  render() {
    return (
      <MyContext.Provider
        value={{
          age: this.state.age,
          changeAge: this.changeAge
        }}>
        <UserContext.Provider value={{ name: this.state.name }}>
          <Father />
        </UserContext.Provider>
      </MyContext.Provider>
    )
  }
}

export default App
```

如果两个或者多个上下文的值经常被一起使用，也许你需要考虑你自己渲染属性的组件提供给它们。


## 在生命周期方法中访问 Context

在生命周期方法中从上下文访问值是一种相对常见的用例。而不是将上下文添加到每个生命周期方法中，只需要将它作为一个 `props` 传递，然后像通常使用 `props` 一样去使用它。

```jsx
import React, { Component } from 'react'

const MyContext = React.createContext()

class Child extends Component {
  
  componentDidMount() {
   console.log(this.props.ctx) 
  }  

  render() {
    const { age, changeAge } = this.props.ctx
    return (
      <div>
        <p>My age is {age}</p>
        <button onClick={changeAge}>changeAge</button>
      </div>
    )
  }
}


const Father = props => (
  <MyContext.Consumer>
    {ctx => <Child {...props} ctx={ctx} />}
  </MyContext.Consumer>
)

class App extends Component {
  state = {
    age: 22
  }

  changeAge = () => {
    this.setState(prevState => ({
      age: ++prevState.age
    }))
  }

  render() {
    return (
      <MyContext.Provider
        value={{
          age: this.state.age,
          changeAge: this.changeAge
        }}>
        <Father />
      </MyContext.Provider>
    )
  }
}

export default App
```

## 转发 Refs

一个关于渲染属性API的问题是 `refs` 不会自动的传递给被封装的元素。为了解决这个问题，使用 `React.forwardRef`：

- fancy-button.js

```jsx
class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// 使用 context 传递当前的 "theme" 给 FancyButton.
// 使用 forwardRef 传递 refs 给 FancyButton 也是可以的.
export default React.forwardRef((props, ref) => (
  <ThemeContext.Consumer>
    {theme => (
      <FancyButton {...props} theme={theme} ref={ref} />
    )}
  </ThemeContext.Consumer>
))
```
- app.js

```jsx
import FancyButton from './fancy-button'

const ref = React.createRef()

// ref属性将指向 FancyButton 组件,
// ThemeContext.Consumer 没有包裹它
// 这意味着我们可以调用 FancyButton 的方法就像这样 ref.current.focus()
<FancyButton ref={ref} onClick={handleClick}>
  Click me!
</FancyButton>
```

## 尽量减少使用 context

因为 `context` 使用 `reference identity` 确定何时重新渲染，在 `Consumer` 中，当一个 `Provider` 的父节点重新渲染的时候，有一些问题可能触发意外的渲染。例如下面的代码，所有的 `Consumner` 在 `Provider` 重新渲染之时，每次都将重新渲染，因为一个新的对象总是被创建对应 `Provider` 里的 value

```jsx
class App extends React.Component {
  render() {
    return (
      <Provider value={{something: 'something'}}>
        <Toolbar />
      </Provider>
    );
  }
}
```

为了防止这样, 提升 `value` 到父节点的 `state` 里:

```jsx
class App extends React.Component {
  constructor(props) {
    this.state = {
      value: {something: 'something'},
    };
  }

  render() {
    return (
      <Provider value={this.state.value}>
        <Toolbar />
      </Provider>
    );
  }
}
```

## 注意点

React context的局限性：

1. 在组件树中，如果中间某一个组件 ShouldComponentUpdate returning false 了，会阻碍 context 的正常传值，导致子组件无法获取更新。
2. 组件本身 extends React.PureComponent 也会阻碍 context 的更新。
3. Context 应该是唯一不可变的
4. 组件只在初始化的时候去获取 Context
