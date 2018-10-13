[更好阅读体验请戳这里](https://gershonv.github.io/2018/09/28/react-hoc/)

### 高阶函数

高阶函数（Higher Order Function）=> 参数或返回值为函数
高阶组件：以组件作为参数的组件，结果 return 一个组件。

简单的例子:

```js
function add(a, b, fn) {
  return fn(a) + fn(b)
}
var fn = function(a) {
  return a * a
}
add(2, 3, fn) //13
```

还有一些我们平时常用高阶的方法,如： Map、Reduce、Filter、Sort；
以及现在常用的 redux 中的 connect 方法也是高阶函数。

#### 函数柯里化

> Currying：是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术

简单的例子：

```js
var add = function(x) {
  return function(y) {
    return function(z) {
      console.log('curr', x, y, z)
      return x + y + z
    }
  }
}

console.log(add(1)(5)(5)) //11
console.log(add(1)(5)) //如果传两个参数，则会把第三个函数返回出来 Function
```

### 高阶组件

> A higher-order component is a function that takes a component and returns a new component

先来一个最简单的高阶组件

```js
//===> demo
import React, { Component } from 'react'
import simpleHoc from './simpleHoc';

class Demo extends Component {
  render() {
    return <div>223</div>
  }
}

export default simpleHoc(Demo)

//===> simpleHoc
import React, { Component } from 'react'

const simpleHoc = WrappedComponent =>
  class extends Component {
    render() {
      console.log('simple')
      return <WrappedComponent {...this.props} />
    }
  }

export default simpleHoc
```

#### 装饰器模式

高阶组件可以看做是装饰器模式(Decorator Pattern)在 React 的实现。即允许向一个现有的对象添加新的功能，同时又不改变其结构，属于包装模式(Wrapper Pattern)的一种

ES7 中添加了一个 `decorator` 的属性，使用@符表示，可以更精简的书写。那上面的例子就可以改成：

```js
//===> demo
import React, { Component } from 'react'
import simpleHoc from './simpleHoc'

@simpleHoc
class Demo extends Component {
  render() {
    return <div>223</div>
  }
}

export default Demo
```

当然兼容性是存在问题的，通常都是通过 babel 去编译的。 babel 提供了 plugin，高阶组件用的是类装饰器，所以用 `transform-decorators-legacy`

ps [vscode 中使用 Experimental Decorators 报错](https://www.cnblogs.com/zhiyingzhou/p/7619962.html)

#### 属性代理模式

引入里我们写的最简单的形式，就是属性代理(Props Proxy)的形式。通过 hoc 包装 `wrappedComponent`，demo 组件中可以通过 `props` 直接操作包装传递的属性

```js
// ===> demo
import React, { Component } from 'react'
import simpleHoc from './simpleHoc'

@simpleHoc
class Demo extends Component {
  render() {
    return (
      <div>
        <button onClick={this.props.handleClick}>onClick</button>
      </div>
    )
  }
}

export default Demo

// ===> simpleHoc
import React, { Component } from 'react'

const simpleHoc = WrappedComponent =>
  class extends Component {
    handleClick = () => {
      alert(1)
    }

    render() {
      console.log('simple')
      return <WrappedComponent {...this.props} handleClick={this.handleClick} />
    }
  }

export default simpleHoc
```

##### 抽离 state

这里不是通过 ref 获取 state， 而是通过 { props, 回调函数 } 传递给 `wrappedComponent` 组件，通过回调函数获取 `state`。这里用的比较多的就是 react 处理表单的时候。通常 react 在处理表单的时候，一般使用的是受控组件，即把 input 都做成受控的，改变 value 的时候，用 `onChange` 事件同步到 `state` 中。当然这种操作通过 `Container` 组件也可以做到，具体的区别放到后面去比较。看一下代码就知道怎么回事了：

```js
// ===> demo
import React, { Component } from 'react'
import simpleHoc from './simpleHoc'

@simpleHoc
class Demo extends Component {
  render() {
    return (
      <div>
        <input name="username" {...this.props.getField('username')} />
        <br />
        <input name="password" {...this.props.getField('password')} />
        <button onClick={this.props.handleSubmit}>submit</button>
      </div>
    )
  }
}

export default Demo

// ===> hoc

import React, { Component } from 'react'

const simpleHoc = WrappedComponent =>
  class extends Component {
    constructor() {
      super()
      this.state = {
        fields: {}
      }
    }

    onChange = key => e => {
      let { fields } = this.state
      fields[key] = e.target.value
      this.setState({ fields })
    }

    getField = fieldName => {
      return {
        onChange: this.onChange(fieldName)
      }
    }

    handleSubmit = () => {
      console.log(this.state.fields)
    }

    render() {
      const props = {
        ...this.props,
        getField: this.getField,
        handleSubmit: this.handleSubmit
      }
      return <WrappedComponent {...props} />
    }
  }

export default simpleHoc
```

这里我们把 `state`，`onChange` 等方法都放到 `HOC` 里，其实是遵从的 react 组件的一种规范，子组件简单，傻瓜，负责展示，逻辑与操作放到 `Container`。比如说我们在 `HOC` 获取到用户名密码之后，再去做其他操作，就方便多了，而 `state`，处理函数放到 `Form` 组件里，只会让 `Form` 更加笨重，承担了本不属于它的工作，这样我们可能其他地方也需要用到这个组件，但是处理方式稍微不同，就很麻烦了。

#### 反向继承

反向继承(Inheritance Inversion)，简称 II，跟属性代理的方式不同的是，II 采用通过 去继承 `WrappedComponent`，本来是一种嵌套的关系，结果 II 返回的组件却继承了 `WrappedComponent`，这看起来是一种反转的关系。

通过继承 `WrappedComponent`，除了一些静态方法，包括生命周期，state，各种 function，我们都可以得到。上栗子：

```js
// ===> demo
import React, { Component } from 'react'
import simpleHoc from './simpleHoc'

@simpleHoc
class Demo extends Component {
  constructor() {
    super()
    this.state = {
      name: 'demo'
    }
  }

  componentDidMount() { // 不执行, 执行hoc中的生命周期，hoc 中无此生命周期才执行这个组件的周期
    console.log(this.state)
  }

  render() {
    this.hocMethods() // run hocMthods
    console.log(this.state) // {mixinName: "hoc", name: "demo"}
    return <div>demo</div>
  }
}

export default Demo

// ===> simpleHoc
import React, { Component } from 'react'

const simpleHoc = WrappedComponent =>
  class extends WrappedComponent {
    constructor(props) {
      super(props)
      this.state = {
        hocState: 'hoc',
        ...this.state
      }
    }

    componentDidMount() {
      console.log(this.state)
    }

    hocMethods = () => {
      console.log('run hocMthods')
    }

    render() {
      return super.render()
    }
  }

export default simpleHoc
```

`simpleHoc` return 的组件通过继承，拥有了 demo 的生命周期及属性，所以 didMount 会打印，state 也通过 constructor 执行，得到 state.name。

##### 渲染劫持

这里 `HOC` 里定义的组件继承了 `WrappedComponent` 的 `render`(渲染)，我们可以以此进行 `hijack`(劫持)，也就是控制它的 `render` 函数。栗子：

```js
// ===> demo
import React, { Component } from 'react'
import simpleHoc from './simpleHoc'

@simpleHoc({ type: 'add-style', style: { color: 'red' } })
class Demo extends Component {
  constructor() {
    super()
    this.state = {
      name: 'demo'
    }
  }
  render() {
    return <div>demo</div>
  }
}

export default Demo

// ===> simpleHoc
import React, { Component } from 'react'

const simpleHoc = config => WrappedComponent =>
  class extends WrappedComponent {
    render() {
      const { style = {} } = config
      const elementsTree = super.render()
      if (config.type === 'add-style') {
        return <div style={{ ...style }}>{elementsTree}</div>
      }
      return elementsTree
    }
  }

export default simpleHoc
```

我这里通过二阶函数，把 config 参数预制进 HOC， 算是一种柯理化的思想。 栗子很简单，这个 hoc 就是添加样式的功能。但是它暴露出来的信息却不少。首先我们可以通过 `config` 参数进行逻辑判断，有条件的渲染，当然这个参数的作用很多，`react-redux` 中的 `connect` 不就是传入了 `props-key` 嘛。再就是我们还可以拿到 `WrappedComponent` 的元素树，可以进行修改操作。最后就是我们通过 div 包裹，设置了 style。但其实具体如何操作还是根据业务逻辑去处理的...

### 参考：

[React 进阶之高阶组件](https://juejin.im/post/595243d96fb9a06bbd6f5ccd#heading-0)
