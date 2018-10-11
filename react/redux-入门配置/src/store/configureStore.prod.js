import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import rootReducer from '../reducers'

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, promise())
  )

  return store
}

export default configureStore
