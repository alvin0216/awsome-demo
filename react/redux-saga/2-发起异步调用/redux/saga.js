import { delay } from 'redux-saga' // Returns a Promise that will resolve after ms milliseconds with val

/**
 * all - all([...effects]) | all(effects)
         命令 middleware 并行地运行多个 Effect，并等待它们全部完成。
 *       
 * put - put(action) 
         触发一个 action, 这个 effect 是非阻塞型的
 *        
 * takeEvery - takeEvery(pattern, saga, ...args)
               在发起（dispatch）到 Store 并且匹配 pattern 的每一个 action 上派生一个 saga
               - pattern: String | Array | Function
               - saga: Function
               - args: Array<any>

 */
import { all, put, takeEvery } from 'redux-saga/effects'

export function* incrementAsync() {
  yield delay(1000)
  yield put({ type: 'INCREMENT' })
}

export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

export default function* rootSage() {
  yield all([watchIncrementAsync()])
}
