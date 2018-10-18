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

export default combineReducers({
  counter: counterReducer
})
