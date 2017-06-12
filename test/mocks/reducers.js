import { combineReducers } from 'redux'

const defaultState = {
  foo: 'foo',
  bar: {
    baz: 'baz',
    foo: 'bar'
  }
}

export default combineReducers({
  test: function (state = defaultState, action) {
    switch (action.type) {
      case 'ACTION_FOO': {
        return Object.assign({}, state, { foo: action.payload })
      }
      case 'ACTION_BAZ': {
        return Object.assign({}, state, { bar: Object.assign({}, state.bar, { baz: action.payload }) })
      }
      default: {
        return state
      }
    }
  }
})
