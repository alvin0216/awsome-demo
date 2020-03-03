import React, { Component } from 'react'
import { connect } from './react-redux'
import { addCount } from './store/couter/actions'

class App extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        <h2>{this.props.count}</h2>
        <button onClick={this.props.addCount}>addCount</button>
      </div>
    )
  }
}

export default connect(state => ({ count: state.counter.count }), { addCount })(App)
