// ====== state
const defaultState = {
  count: 0,
};

/**
 * UserReducer
 */
export default function countReducer(state = defaultState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state;
  }
}
