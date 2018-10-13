import React, { Component } from 'react'

// 接收一个组件，返回一个新的组件
const PropsLogger = WrapperComponent => {
  return class extends Component {
    render() {
      return <WrapperComponent {...this.props} />
    }
  }
}

// Hello 是返回的新的组件
const Hello = PropsLogger(props => {
  return <p>Hello {props.name}</p>
})

class App extends Component {
  render() {
    return <Hello name="gershon" />
  }
}

export default App
