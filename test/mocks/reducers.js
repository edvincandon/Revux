import { combineReducers } from 'redux'

const defaultState = {
  bar: 'foo',
  foo: {
    bar: 'baz',
    baz: 'bar'
  }
}

export default combineReducers({
  foo: function (state = defaultState, action) {
    switch (action.type) {
      case 'ACTION_BAR': {
        return Object.assign({}, state, { bar: action.payload })
      }
      case 'ACTION_FOO': {
        const { bar, baz } = action.payload
        return Object.assign({}, state, { bar, baz })
      }
      default: {
        return state
      }
    }
  }
})
