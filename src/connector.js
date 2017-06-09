import {
  shallowEqual,
  wrapActionCreators
} from './utils/index'

const defaultMapState = () => ({})
const defaultMapDispatch = dispatch => ({
  dispatch
})

const connector = (mapState = defaultMapState, mapDispatch = defaultMapDispatch) => component => {
  return {
    mixins: [component],
    name: `connect-${component.name}`,
    inject: ['$$store'],

    data () {
      const state = mapState(this.$$store.getState())
      const attachedState = {}
      Object.keys(state).forEach(key => {
        attachedState[key] = state[key]
      })

      const actions = wrapActionCreators(mapDispatch)(this.$$store.dispatch)
      const attachedActions = {}
      Object.keys(actions).forEach(key => {
        attachedActions[key] = actions[key]
      })

      return Object.assign({}, attachedState, attachedActions)
    },

    created () {
      const vm = this
      const __store__ = this.$$store
      const getMappedState = (state = __store__.getState()) => mapState(state)

      const observeStore = (store, currState, select, onChange) => {
        if (typeof onChange !== 'function') return null
        let currentState = currState || {}

        function handleChange() {
          const nextState = select(store.getState())
          if (!shallowEqual(currentState, nextState)) {
            const previousState = currentState
            currentState = nextState
            onChange(currentState, previousState)
          }
        }

        onChange(currentState, null) // trigger onChange on component init
        return store.subscribe(handleChange)
      }

      this._unsubscribe = observeStore(__store__, getMappedState(), getMappedState, (newState, oldState) => {
        Object.keys(newState).forEach(key => {
          vm.$set(this, key, newState[key])
        })
      })
    },

    beforeDestroy() {
      if (this._unsubscribe) {
        this._unsubscribe()
      }
    }
  }
}

export default connector
