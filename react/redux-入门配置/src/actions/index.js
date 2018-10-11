import axios from 'axios'
import { INCREMENT, DECREMENT } from '../constants'
// import {
//   FETCH_USER_SUCCESS,
//   FETCH_USER_REQUEST,
//   FETCH_USER_FAILURE
// } from '../constants'

import { LOAD_USER } from '../constants'

export const increment = () => {
  return disaptch => {
    setTimeout(() => {
      disaptch({ type: INCREMENT })
    }, 2000)
  }
  // return {
  //   type: INCREMENT,
  //   payload: new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve('1111')
  //     })
  //   })
  // }
}

export const decrement = () => {
  return {
    type: DECREMENT
  }
}

export const getUser = () => {
  // return disaptch => {
  //   disaptch({ type: FETCH_USER_REQUEST }) // loading
  //   axios
  //     .get('https://randomuser.me/api/')
  //     .then(res => {
  //       disaptch({
  //         type: FETCH_USER_SUCCESS,
  //         user: res.data.results[0]
  //       })
  //     })
  //     .catch(error => {
  //       disaptch({
  //         type: FETCH_USER_FAILURE,
  //         user: error.response.data
  //       })
  //     })
  // }
  return {
    type: LOAD_USER,
    payload: {
      promise: axios.get('https://randomuser.me/api/')
    }
  }
}
