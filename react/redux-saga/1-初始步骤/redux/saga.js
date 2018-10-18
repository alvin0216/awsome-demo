import { all } from 'redux-saga/effects'

function* helloSaga() {
  yield console.log('Hello Sagas!')
}

export default function* rootSage() {
  yield all([helloSaga()])
}
