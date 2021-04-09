import { SET_NAME } from '../contants';

//异步操作的action(采用thunk中间件)
export const fetchName = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/random/name').then((res) => {
      console.log(res.data);
      return dispatch({ type: SET_NAME, payload: res.data.name });
    });
  };
};
