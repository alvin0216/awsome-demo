import React, { Component, PureComponent } from 'react'

// PureComponent 做浅层比较，state|prop未发生改变就不会重新 render
class Temp extends PureComponent {
  render() {
    console.log('render Temp')
    return <div>{this.props.val}</div>
  }
}

class App extends Component {
  state = {
    val: 1
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        val: 1
      })
    }, 2000)
  }

  render() {
    console.log('render App')
    return <Temp val={this.state.val} />
  }
}

export default App
