import logger from './middlewares/logger'

const { createStore, combineReducers, applyMiddleware } = require('./my-redux')

const counterState = { count: 0 }
function counterReducer(state = counterState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state.count + 1

    default:
      return state
  }
}

const userState = { name: '' }
function userReducer(state = userState, action) {
  switch (action.type) {
    case 'UPDATE_NAME':
      return { ...state, name: action.payload }

    default:
      return state
  }
}

const reducers = combineReducers({
  counter: counterReducer,
  user: userReducer
})

const store = createStore(reducers, applyMiddleware(logger))

store.subscribe(() => {
  console.log('trigger store.subscribe: ', store.getState())
})

store.dispatch({ type: 'INCREMENT' })
