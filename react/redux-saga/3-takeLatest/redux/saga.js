import axios from 'axios'
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

 * takeLatest - takeLatest(pattern, saga, ...args)
                在发起到 Store 并且匹配 pattern 的每一个 action 上派生一个 saga。并自动取消之前所有已经启动但仍在执行中的 saga 任务。
 */
import { all, put, call, takeEvery, takeLatest } from 'redux-saga/effects'

function* helloSaga() {
  yield console.log('Hello Sagas!')
}

// counter
function* incrementAsync() {
  yield delay(1000)
  yield put({ type: 'INCREMENT' })
}

function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

// user
function* fetchUser() {
  try {
    const user = yield call(axios.get, 'https://jsonplaceholder.typicode.com/users')
    yield put({ type: 'FETCH_USER_SUCCEEDED', user: user })
  } catch (error) {
    yield put({ type: 'FETCH_USER_FAILURE', error: error.message })
  }
}

function* watchFetchUser() {
  yield takeLatest('FETCH_USER_REQUEST', fetchUser)
}

export default function* rootSage() {
  yield all([watchIncrementAsync(), helloSaga(), watchFetchUser()])
}
