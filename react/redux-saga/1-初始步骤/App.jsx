import React, { Component } from 'react'
import { connect } from 'react-redux'
import { increment } from './redux/actions.js'

class App extends Component {
  onIncrement = () => {
    this.props.increment()
  }

  render() {
    return (
      <div className="App">
        <h2>{this.props.counter}</h2>
        <button onClick={this.onIncrement}>increment</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  counter: state.counter
})

export default connect(
  mapStateToProps,
  { increment }
)(App)
