import React, { Component } from 'react'
import { connect } from 'react-redux'
import { increment, incrementAsync } from './redux/actions.js'

class App extends Component {
  onIncrement = () => {
    this.props.increment()
  }

  onIncrementAsync = () => {
    this.props.incrementAsync() // 相当于 this.props.dispatch({ type: 'INCREMENT_ASYNC' })
  }

  render() {
    return (
      <div className="App">
        <h2>{this.props.counter}</h2>
        <button onClick={this.onIncrement}>increment</button>
        <br />
        <button onClick={this.onIncrementAsync}>incrementAsync</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  counter: state.counter
})

export default connect(
  mapStateToProps,
  { increment, incrementAsync }
)(App)
