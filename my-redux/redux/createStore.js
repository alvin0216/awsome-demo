export default function createStore(reducer, initState, rewriteCreateStoreFunc) {
  let state = initState
  const listeners = []

  if (typeof initState === 'function') {
    rewriteCreateStoreFunc = initState
    initState = undefined
  }

  /* 如果有 rewriteCreateStoreFunc，那就采用新的 createStore */
  if (rewriteCreateStoreFunc) {
    const newCreateStore = rewriteCreateStoreFunc(createStore)
    return newCreateStore(reducer, initState)
  }

  /* 否则按照正常的流程走*/
  /* 订阅函数 */
  function subscribe(listener) {
    listeners.push(listener)
  }

  /* state 值的修改 */
  function dispatch(action) {
    state = reducer(state, action)
    /* 执行通知 */
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }

  /* 注意！！！只修改了这里，用一个不匹配任何计划的 type，来获取初始值 */
  dispatch({ type: Symbol() })

  function getState() {
    return state
  }

  return { subscribe, dispatch, getState }
}
