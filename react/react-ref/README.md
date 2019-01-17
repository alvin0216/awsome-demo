---
title: react - Ref
date: 2018-11-26 13:36:56
categories: React
tags: React
---

在 `react` 典型的数据流中，`props` 传递是父子组件交互的唯一方式；要修改子组件，你需要使用新的 props 重新渲染它。
但是，某些情况下你需要在典型数据流外强制修改子组件。某些情况下（例如和第三方的 dom 库整合，或者某个 dom 元素 focus 等）为了修改子组件我们可能需要另一种方式，这就是 `ref` 方式。

<!-- more -->

## ref 简介

`React` 提供的这个 `ref` 属性，表示为对组件真正实例的引用，其实就是 `ReactDOM.render()`返回的组件实例；需要区分一下，`ReactDOM.render()`渲染组件时返回的是组件实例；而渲染 `dom` 元素时，返回是具体的 `dom` 节点。

> 那么我们可以知道 `ref` 挂载到普通 `dom` 节点时代表这个 `dom` 元素，相当于 `document.querySelect()`, 而挂载到组件时返回的是这个组件的实例（我们可以直接访问组件的 `state` 和方法）

```js
class Demo extends Component {
  state = { name: 'demo' }
  render() {
    return null
  }
}

class App extends Component {
  componentDidMount() {
    this.input.focus() // 控制 input 元素的聚焦
    console.log(this.demo.state) // { name: 'demo' }
  }

  render() {
    return (
      <div>
        <input type="text" ref={el => (this.input = el)} />
        <Demo ref={el => (this.demo = el)} />
      </div>
    )
  }
}
```

## 通过回调方式设置 ref（推荐）

ref 属性可以设置为一个回调函数，这也是官方强烈推荐的用法；这个函数执行的时机为：

- 组件被挂载后，回调函数被立即执行，回调函数的参数为该组件的具体实例。
- 组件被卸载或者原有的 `ref` 属性本身发生变化时，回调也会被立即执行，此时回调函数参数为 `null`，以确保内存泄露。

```js
class Demo extends Component {
  render() {
    return <span>demo</span>
  }
}

class App extends Component {
  state = { visible: true }

  toggleVisible = () => {
    this.setState({ visible: !this.state.visible })
  }

  refCb = instance => {
    console.log(instance)
  }

  render() {
    return (
      <div>
        <button onClick={this.toggleVisible}>toggle</button>
        {this.state.visible && <Demo ref={this.refCb} />}
      </div>
    )
  }
}
// demo mounted => run refCb 返回 Demo 组件实例对象
// demo destory => run refCb 返回 null
```

## 其他方式设置 ref

### createRef

```js
class App extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    this.inputRef.current.focus()
  }

  render() {
    return <input type="text" ref={this.inputRef} />
  }
}
```

### ref='xxx'（不推荐）

```jsx
<input ref="inputRef" />

// this.refs.inputRef 访问这个 dom 元素
```

## 在函数组件中使用 ref

函数组件，即无状态组件`stateless component`在创建时是不会被实例化的。
无状态组件内部其实是可以使用 ref 功能的，虽然不能通过 this.refs 访问到，但是可以通过将 ref 内容保存到无状态组件内部的一个本地变量中获取到。

```jsx
import React from 'react'

const App = () => {
  let inputRef
  function handleClick() {
    inputRef.focus()
  }
  return (
    <div>
      <button onClick={handleClick}>focus</button>
      <input type="text" ref={el => (inputRef = el)} />
    </div>
  )
}

export default App
```

## React.forwardRef

> `Ref forwarding` 是一种自动将 `ref` 通过组件传递给其子节点的技术。

Ref 转发使组件可以像暴露自己的 ref 一样暴露子组件的 ref。也就是说我们不想控制子组件，我们想具体控制到子组件某个组件的实例。

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
))

class App extends Component {
  componentDidMount() {
    console.log(this.fButton) //  <button className="FancyButton">click</button>
  }

  render() {
    return <FancyButton ref={node => (this.fButton = node)}>click</FancyButton>
  }
}
```

举例个应用场景，我们自封装一个 `Input` 组件，那我们的 `ref` 是要具体控制到原生的 `input`。以下是具体得代码：

```js
class Input extends Component {
  render() {
    const { forwardedRef, ...rest } = this.props
    return <input {...rest} ref={forwardedRef} type="text" />
  }
}

const MyInput = React.forwardRef((props, ref) => <Input {...props} forwardedRef={ref} />)

class App extends Component {
  componentDidMount() {
    this.input.focus()
  }

  render() {
    return <MyInput defaultValue="guodada" ref={el => (this.input = el)} />
  }
}
```

## ref 在 HOC 中存在的问题

`react` 的 HOC 是高阶组件，简单理解就是包装了一个低阶的组件，最后返回一个高阶的组件；高阶组件其实是在低阶组件基础上做了一些事情。

既然 `HOC` 会基于低阶组件生成一个新的高阶组件，若用 `ref` 就不能访问到我们真正需要的低阶组件实例，我们访问到的其实是高阶组件实例。所以:

```js
const Hoc = WrappedComponent =>
  class extends Component {
    render() {
      return <WrappedComponent {...this.props} />
    }
  }

class Demo extends Component {
  state = { name: 'guodada' }
  render() {
    return null
  }
}

const Test = Hoc(Demo)

class App extends Component {
  componentDidMount() {
    console.log(this.demoRef.state) // null, this.demoRef 不是 Demo 组件的实例
  }

  render() {
    return <Test ref={node => (this.demoRef = node)} />
  }
}
```

## 总结

`ref` 提供了一种对于 `react` 标准的数据流不太适用的情况下组件间交互的方式，例如管理 dom 元素 focus、text selection 以及与第三方的 dom 库整合等等。 但是在大多数情况下应该使用 react 响应数据流那种方式，不要过度使用 ref。

另外，在使用 ref 时，不用担心会导致内存泄露的问题，react 会自动帮你管理好，在组件卸载时 ref 值也会被销毁。

最后补充一点：

> 不要在组件的 `render` 方法中访问 `ref` 引用，`render` 方法只是返回一个虚拟 dom，这时组件不一定挂载到 `dom` 中或者 `render` 返回的虚拟 dom 不一定会更新到 dom 中。

参考 [React 之 ref 详细用法](https://segmentfault.com/a/1190000008665915)
