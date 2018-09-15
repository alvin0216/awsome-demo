import { createStore, applyMiddleware, compose } from 'redux'
import Modules from './modules'
import thunk from 'redux-thunk'

const store = createStore(Modules, compose(
  applyMiddleware(thunk),
  window.devToolsExtension && window.devToolsExtension() // 配置redux 开发工具
));

export default store
