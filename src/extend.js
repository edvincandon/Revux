import {
  shallowEqual,
  wrapActionCreators
} from './utils'

/**
 * Extend Vue prototype + global mixin
 *
 * @param {Vue} Vue
 */

export function extendVue(Vue) {
  Vue.mixin({
    beforeDestroy() {
      if (this._unsubscribe) {
        this._unsubscribe()
      }
    }
  })
  const defaultMapState = () => ({});
  const defaultMapDispatch =  dispatch => ({ dispatch });

  Vue.prototype.$connect = function(mapState = defaultMapState, mapDispatch = defaultMapDispatch) {
    const vm = this
    const getMappedState = (state = this.$store.state) => mapState(state)

    const actions = wrapActionCreators(mapDispatch)(this.$store.dispatch)
    Object.keys(actions).forEach(key => {
      vm[key] = actions[key]
    })

    const observeStore = (store, currState, select, onChange) => {
      if (typeof onChange !== 'function') return null
      let currentState = currState || {}

      function handleChange() {
        const nextState = select(store.state)
        if (!shallowEqual(currentState, nextState)) {
          const previousState = currentState
          currentState = nextState
          onChange(currentState, previousState)
        }
      }

      onChange(currentState, null) // trigger onChange on component init
      return store.subscribe(handleChange)
    }

    this._unsubscribe = observeStore(this.$store, getMappedState(), getMappedState, (newState, oldState) => {
      Object.keys(newState).forEach(key => {
        if(vm[key] === undefined) {
          console.warn(`[revue2] - you forgot to declare property **${key}** in your component's data function making it unreactive`)
        }

        vm.$set(vm, key, newState[key])
      })
    })
  }

  Object.defineProperty(Vue.prototype, '$store', {
    get: function $store() {
      if (!this.$root.store) {
        throw new Error('[revue2] - No store provided to root component')
      }
      return this.$root.store
    }
  })
}
