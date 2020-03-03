import { compose, createStore, applyMiddleware } from '../redux'
import logger from '../middleware/logger'
import exception from '../middleware/exception'
import time from '../middleware/time'

import rootReducer from './rootReducers'

const storeEnhancers = compose(applyMiddleware(exception, time, logger))

export default createStore(rootReducer, storeEnhancers)
