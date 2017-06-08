import {
  bindActionCreators
} from 'redux'

const wrapActionCreators = (actionCreators) => dispatch => bindActionCreators(actionCreators, dispatch)

export default wrapActionCreators
