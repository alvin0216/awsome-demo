import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import clientAxios from '../client/request';
import serverAxios from '../server/request';

import UserReducer from './user/reducer';

const reducer = combineReducers({
  user: UserReducer,
});

//服务端的store创建函数
export const getStore = (req) => {
  return createStore(
    reducer,
    applyMiddleware(thunk.withExtraArgument(serverAxios(req))),
  );
};
//客户端的store创建函数
export const getClientStore = () => {
  const defaultState = window.context ? window.context.state : {};
  return createStore(
    reducer,
    defaultState,
    applyMiddleware(thunk.withExtraArgument(clientAxios)),
  );
};
