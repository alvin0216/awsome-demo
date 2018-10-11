import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUser } from '../actions'

class User extends Component {
  render() {
    const { getUser } = this.props
    const { error, isFetching, user } = this.props.user
    return (
      <div>
        <h1 className="jumbotron-heading text-center">
          {error ? error : isFetching ? 'Loading...' : user.email}
        </h1>
        <p className="text-center">
          <button onClick={() => getUser()} className="btn btn-success mr-2">
            GET RANDOM USER
          </button>
        </p>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  { getUser }
)(User)
