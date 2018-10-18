import React, { Component } from 'react'
import { connect } from 'react-redux'
import { increment, incrementAsync, fetchUser } from './redux/actions.js'

class App extends Component {
  onIncrement = () => {
    this.props.increment()
  }

  onIncrementAsync = () => {
    this.props.incrementAsync() // 相当于 this.props.dispatch({ type: 'INCREMENT_ASYNC' })
  }

  onFetchUser = () => {
    this.props.fetchUser()
  }

  render() {
    const { isFetching, error, user } = this.props.user

    return (
      <div className="App">
        <h2>{this.props.counter}</h2>
        <button onClick={this.onIncrement}>increment</button>
        <br />
        <button onClick={this.onIncrementAsync}>incrementAsync</button>
        <br />
        <button onClick={this.onFetchUser}>fetchUser</button>
        <br/>
        {error ? error : isFetching ? 'Loading...' : user && user.data[0].name}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  counter: state.counter,
  user: state.user
})

export default connect(
  mapStateToProps,
  { increment, incrementAsync, fetchUser }
)(App)
