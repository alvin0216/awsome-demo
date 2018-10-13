import React, { Component } from 'react'

import ErrorBoundary from './ErrorBoundary'

const Broken = () => {
  return <div>{null.map(val => val)}</div>
}

class App extends Component {
  state = {
    counter: 0
  }

  increment = () => {
    this.setState(prevState => ({ counter: prevState.counter + 1 }))
  }

  decrement = () => {
    this.setState(prevState => ({ counter: prevState.counter - 1 }))
  }

  render() {
    return (
      <div>
        <ErrorBoundary
          render={(error, errorInfo) => <p>Error: {error.toString()}</p>}
        >
          <Broken />
        </ErrorBoundary>
        <div>Counter: {this.state.counter}</div>
        <button onClick={this.increment}>Increment</button>
        <button onClick={this.decrement}>Decrement</button>
      </div>
    )
  }
}

export default App