import bindActionCreators from './bindActionCreators'

const wrapActionCreators = (actionCreators) => dispatch => bindActionCreators(actionCreators, dispatch)

export default wrapActionCreators
