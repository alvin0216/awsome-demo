import { SET_NAME } from '../contants';

let defaultState = {
  name: 'alvin',
};

export default function UserReducer(state = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_NAME:
      return { ...state, name: payload };

    default:
      return state;
  }
}
