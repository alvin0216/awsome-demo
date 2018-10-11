import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
// import { increment, decrement } from './actions'
import * as actions from './actions'

import User from './components/User'

// const mapDispatchToProps = dispatch => {
//   return {
//     increment: payload => dispatch(increment(payload))
//   }
// }
function testable(target) {
  target.isTestable = true
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch)
}

const mapStateToProps = state => {
  return {
    counter: state.counter
  }
}

// 装饰器-用来修改类的行为: http://es6.ruanyifeng.com/#docs/decorator
@testable
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class App extends Component {
  // spt =>
  static propTypes = {
    counter: PropTypes.number.isRequired,
    increment: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired
  }

  render() {
    const { increment, decrement } = this.props
    return (
      <div className="container">
        <h1 className="jumbotron-heading text-center">{this.props.counter}</h1>
        <p className="text-center">
          <button onClick={() => increment()} className="btn btn-primary mr-2">
            Increase
          </button>
          <button onClick={() => decrement()} className="btn btn-danger my-2">
            Decrease
          </button>
        </p>
        <User />
      </div>
    )
  }
}

console.log(App.isTestable)
export default App
