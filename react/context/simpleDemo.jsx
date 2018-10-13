import React, { Component } from 'react'
import './App.css'

// 第一步，创建 context
const myContext = React.createContext()

// 第二步，创建 Provider Component
class MyProvider extends Component {
  state = {
    name: 'gershon',
    age: 22
  }

  render() {
    return (
      <myContext.Provider value={{ state: this.state }}>
        {this.props.children}
      </myContext.Provider>
    )
  }
}

const Family = props => {
  return (
    <div>
      <h1>Family</h1>
      <Person />
    </div>
  )
}

class Person extends Component {
  render() {
    return (
      <div>
        <h1>Person</h1>
        <myContext.Consumer>
          {({ state }) => <p>My age is {state.age}</p>}
        </myContext.Consumer>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <p>Hello App</p>
        <MyProvider>
          <Family />
        </MyProvider>
      </div>
    )
  }
}

export default App
