// Inspired By React-Redux
// https://github.com/reactjs/redux/blob/master/src/bindActionCreators.js

export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return (...args) => dispatch(actionCreators(...args))
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('[revux] - bindActionCreators expects an object or a function.')
  }

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (let key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function')
      boundActionCreators[key] =  (...args) =>
        dispatch(actionCreator(...args));
  }
  return boundActionCreators
}
