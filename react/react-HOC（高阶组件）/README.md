---
title: react - 高阶组件
date: 2018-09-28 22:58:45
categories: React
tags: React
---

## 高阶函数 / 柯理化

> 高阶函数（`Higher Order Function`）=> 参数或返回值为函数

比较常见的有数组的遍历方式 Map、Reduce、Filter、Sort；常用的 redux 中的 `connect` 方法也是高阶函数。

```js
// 高阶函数 - 简单的例子
function add(a, b, fn) {
  return fn(a) + fn(b)
}
var fn = function(a) {
  return a * a
}
add(2, 3, fn) // 13
```

> 函数柯里化 接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术

```js
const add = function(x) {
  return function(y) {
    return function(z) {
      return x + y + z
    }
  }
}

console.log(add(1)(2)(3)) // 6
console.log(add(1)) // function (y) {...}
```

## 高阶组件（属性代理）

> HOC(全称 `Higher-order component`)是一种 React 的进阶使用方法，主要还是为了便于组件的复用。HOC 就是一个方法，获取一个组件，返回一个更高级的组件。

以下是简单实现的 hoc:

```js
const Hoc = WrappedComponent =>
  class extends Component {
    render() {
      return <WrappedComponent {...this.props} name={'guodada'} />
    }
  }

// use
const Demo = props => <span>{props.name}</span>
export default Hoc(Demo)
```

### hoc 的具体用途

1. 代码复用
2. 对 props 进行增删改、监控
3. 渲染劫持

其实，除了代码复用和模块化，`HOC` 做的其实就是劫持，由于传入的 `wrappedComponent` 是作为一个 `child` 进行渲染的，上级传入的 props 都是直接传给 `HOC` 的，所以 `HOC` 组件拥有很大的权限去修改 `props` 和控制渲染。

对 props 进行增加上式代码用例已经说明了，我们可以使用 `HOC` 的特性来做一些渲染劫持的事情。譬如，控制组件的渲染：

```js
// 在传入的 data 未加载完时，显示 loading...
const Hoc = WrappedComponent =>
  class extends Component {
    render() {
      if (!this.props.data) return <div>Loading...</div>
      return <WrappedComponent {...this.props} />
    }
  }
```

又或者我们可以对 props 进行监控

```jsx
const Hoc = WrappedComponent =>
  class extends Component {
    componentDidUpdate(prevProps, prevState) {
      console.log('prevProps', prevProps)
      console.log('nextProps', this.props)
    }
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
```

除此外还可以用来做页面权限管理。可以通过 HOC 对组件进行包裹，当跳转到当前页面的时候，检查用户是否含有对应的权限。如果有的话，渲染页面。如果没有的话，跳转到其他页面(比如无权限页面，或者登陆页面)。

### 使用 HOC 注意项

1. ref 不能获取到你想要获取的 ref

```js
const Hoc = WrappedComponent =>
  class extends Component {
    state = { name: 'hoc' }
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
    console.log(this.demoRef.state) // { name: 'hoc' }, this.demoRef 不是 Demo 组件的实例 而是 hoc 的实例对象
  }

  render() {
    return <Test ref={node => (this.demoRef = node)} />
  }
}
```

2. `Component` 上面绑定的 `Static` 方法会丢失

```jsx
// 定义一个static方法
WrappedComponent.staticMethod = function() {
  /*...*/
}
// 利用HOC包裹
const EnhancedComponent = enhance(WrappedComponent)

// 返回的方法无法获取到staticMethod
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

这里有一个解决方法，就是 `hoist-non-react-statics` 组件，这个组件会自动把所有绑定在对象上的非 `React` 方法都绑定到新的对象上：

### 做点小运用

使用 HOC 来代理用户的一些表单行为，如下：

```jsx
import React, { Component } from 'react'

const Form = WrappedComponent =>
  class extends Component {
    state = { fields: {} }

    onChange = key => e => {
      let { fields } = this.state
      fields[key] = e.target.value
      this.setState({ fields })
    }

    getField = fieldName => ({
      onChange: this.onChange(fieldName)
    })

    submit = () => {
      console.log(this.state.fields)
    }

    render() {
      const props = {
        ...this.props,
        onChange: this.onChange,
        getField: this.getField,
        submit: this.submit
      }
      return <WrappedComponent {...props} />
    }
  }

class App extends Component {
  render() {
    return (
      <div>
        <input type="text" {...this.props.getField('name')} />
        <button onClick={this.props.submit}>submit</button>
      </div>
    )
  }
}

export default Form(App)
```

## 高阶组件（反继承）

反向继承(`Inheritance Inversion`)，简称 `II`，跟属性代理的方式不同的是，`II` 采用通过 去继承 `WrappedComponent`，本来是一种嵌套的关系，结果 `II` 返回的组件却继承了 `WrappedComponent`，这看起来是一种反转的关系。

简单来理解，代理模式来自上下级组件的包装，而反继承模式的 HOC 和被包装的组件属于同级组件，可以互相调用彼此的方法和 state。而且可以劫持生命周期。

使用了该模式之后两者可以视为同一组件去使用，譬如 `II` 可以调用包装的组件的方法和属性，组件可以调用 `II` 的方法和属性：

```js
import React, { Component } from 'react'

const Hoc = WrappedComponent =>
  class extends WrappedComponent {
    constructor(props) {
      super(props)
      this.state = {
        theme: 'green', // 公用属性
        ...this.state // 组件内的属性可以覆盖 hoc 定义的属性
      }
    }

    componentDidMount() {
      console.log('run hoc componentDidMount') // run hoc componentDidMount
    }

    toggle = () => {
      this.setState(
        prevState => ({
          theme: prevState.theme === 'green' ? 'red' : 'green'
        }),
        () => {
          this.log(this.state.theme)
        }
      )
    }

    render() {
      return super.render()
    }
  }

class App extends Component {
  componentDidMount() {
    console.log('run App componentDidMount') // 不执行，因为被 hoc 劫持了
  }

  log = theme => {
    console.log(theme)
  }

  render() {
    return (
      <div>
        <div>{this.state.theme}</div>
        <button onClick={this.toggle}>click</button>
      </div>
    )
  }
}

export default Hoc(App)
```
