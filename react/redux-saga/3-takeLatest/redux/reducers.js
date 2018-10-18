import { combineReducers } from 'redux'

const counterReducer = (state = 1, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'INCREMENT_ASYNC':
      return state + 1
    default:
      return state
  }
}

const userState = {
  isFetching: false,
  error: null,
  user: null
}

const userReducer = (state = userState, action = {}) => {
  switch (action.type) {
    case 'FETCH_USER_REQUEST':
      return {
        isFetching: true,
        error: null,
        user: null
      }
    case 'FETCH_USER_SUCCEEDED':
      return {
        isFetching: false,
        error: null,
        user: action.user
      }
    case 'FETCH_USER_FAILURE':
      return {
        isFetching: false,
        error: action.error,
        user: null
      }
    default:
      return state
  }
}

export default combineReducers({
  counter: counterReducer,
  user: userReducer
})
