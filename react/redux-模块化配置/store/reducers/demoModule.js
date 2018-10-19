import * as types from '../types'
import update from 'immutability-helper'

const defaultState = {
  name: '默认值',
  jsonArray: [{ name: '数组默认值' }],
  array: []
}

/**
 * demo reducer
 * */
export default function demo(state = defaultState, action = {}) {
  const { type, payload } = action
  const res = Object.assign({}, state)
  switch (type) {
    case types.UPDATE_NAME:
      res.name = payload.name
      break
    case types.UPODATE_ARRAY:
      res.jsonArray = update(state.jsonArray, {
        [0]: {
          $set: { name: payload.name }
        }
      })
      break
    default:

  }
  return res
}
