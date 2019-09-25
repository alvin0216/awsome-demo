/**
 *
 * @param {Function} reducer - reducer func
 * @param {any} [preloadedState] - initState
 * @param {Function} [enhancer] - middlewares: rewrite store.dispatch
 *
 * @return {Store}
 */
export default function createStore(reducer, preloadedState, enhancer) {
  /**
   * 如果 第二个参数为 function 类型，则认为它为 enhancer : createStore(reducer, enhancer)
   * 如果 第二个参数未 object 则它为 initState
   */
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  /**
   * 如果传入 enhancer 则我们需要传入对于的 reducer、preloadedState
   * 通过 enhancer 中间件来改写 store.dispatch
   */
  if (typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, preloadedState)
  }

  let state = preloadedState
  const listeners = []

  function getState() {
    return state
  }

  /**
   * store 的订阅事件
   *
   * @param {Function} listener - store.dispatch 后的 callback
   * @return {Function} 返回取消当前订阅的函数
   */
  function subscribe(listener) {
    listeners.push(listener)
    return function unsubscribe() {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  /**
   * store.dispatch 函数来改变 store 的数据
   * @param {Object} action
   */
  function dispatch(action) {
    state = reducer(state, action) // reducer
    // 通知所有 listener: store 发生了改变
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }

  dispatch({ type: '@@redux/INIT' }) // 初始化 store 的数据

  return {
    getState,
    dispatch,
    subscribe
  }
}
