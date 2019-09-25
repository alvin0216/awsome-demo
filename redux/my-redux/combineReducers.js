/**
 * 合并所有的 reducer
 * @param {Object} reducers - example { app: function }
 * @returns {Function}
 */

export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)

  // 返回合并后的新的 reducer 函数
  return function combination(state = {}, action) {
    const nextState = {}

    // 遍历所有的reducers，整合成为一个新的state
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i] // reducer 的 key。 例如 app
      const reducer = reducers[key] // 当前 reducer
      const previousStateForKey = state[key] // 对应 state[key] 例如 例如 state.app
      const nextStateForKey = reducer(previousStateForKey, action) // 执行每个 reducer 返回新的默认 state
      nextState[key] = nextStateForKey // 将每个state 逐步赋值到 state 当中
    }
    return nextState
  }
}
