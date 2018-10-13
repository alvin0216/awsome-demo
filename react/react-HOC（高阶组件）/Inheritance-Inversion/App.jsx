import React, { Component } from 'react'
import Mixin from './Mixin'

class App extends Component {
  state = {
    app: 'demo'
  }

  
  componentDidMount() { // 不执行, 执行hoc中的生命周期，hoc 中无此生命周期才执行这个组件的周期
    console.log(this.state)
  }


  render() {
    this.log(this.state) // { app: 'demo', hoc: 'demo'}
    return <div>demo</div>
  }
}

export default Mixin(App)
