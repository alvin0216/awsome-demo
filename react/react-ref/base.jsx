import React, { Component } from 'react'

/**
 * @class Refs
 */
class Refs extends Component {
  componentDidMount = () => {
    //  普通 dom 的ref
    console.log(this.$inputRef) // <input type="text">
    this.$inputRef.focus()

    // 类组件 ref
    console.log(this.$childRef) // ProxyComponent{ context, print , props, refs, state...}
    this.$childRef.print() // {name: "guodada"}

    // 函数组件 ref
    console.log(this.$funcRef)
    console.log(this.$funcRef.props) // {name: "guo"}
  }

  render() {
    return (
      <div>
        <input type="text" ref={el => this.$inputRef = el} />
        <Child ref={el => this.$childRef = el} />
        <FuncComponent ref={el => this.$funcRef = el} name="guo" />
      </div>
    )
  }
}

class Child extends Component {
  state = { name: 'guodada' }

  print = () => console.log(this.state)

  render() {
    return null
  }
}

function FuncComponent() {
  // 函数组件中创建 ref
  let $inputRef = React.createRef()

  function handleClick() {
    console.log($inputRef.current) // <input type="text">
    $inputRef.current.focus()
  }

  return (
    <div>
      <input type="text" ref={$inputRef} />
      <button onClick={handleClick}>focus</button>
    </div>
  )
}

export default Refs
