import {
  shallowEqual,
  wrapActionCreators
} from './utils/index'

const defaultMapState = () => ({})
const defaultMapDispatch = {}

const connector = (mapState = defaultMapState, mapDispatch = defaultMapDispatch) => component => {
  return {
    mixins: [component],
    inject: ['$$store'],

    data () {
      const initData = {}
      const state = mapState(this.$$store.getState())
      const actions = wrapActionCreators(mapDispatch)(this.$$store.dispatch)

      Object.keys(state).forEach(key => {
        initData[key] = state[key]
      })

      Object.keys(actions).map(key => {
        if (key in initData) {
          console.warn(`[revux] - ${key} already defined in mapState`)
          return
        }
        initData[key] = actions[key]
      })

      return initData
    },

    created () {
      const vm = this
      const __store__ = this.$$store
      const getMappedState = (state = __store__.getState()) => mapState(state)

      const observeStore = (store, currState, select, onChange) => {
        let currentState = currState

        function handleChange() {
          const nextState = select(store.getState())
          if (!shallowEqual(currentState, nextState)) {
            const previousState = currentState
            currentState = nextState
            onChange(currentState, previousState)
          }
        }

        return store.subscribe(handleChange)
      }

      this._unsubscribe = observeStore(__store__, getMappedState(), getMappedState, (newState, oldState) => {
        Object.keys(newState).forEach(key => {
          vm.$set(this, key, newState[key])
        })
      })
    },

    beforeDestroy() {
      this._unsubscribe()
    }
  }
}

export default connector
