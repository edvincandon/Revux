import {
  shallowEqual,
  wrapActionCreators
} from './utils/index'
import Provider from './components/Provider'
/**
 * Extend Vue prototype + global mixin
 *
 * @param {Vue} Vue
 */

export default function install(Vue) {
  Vue.mixin({
    beforeDestroy() {
      if (this._unsubscribe) {
        this._unsubscribe()
      }
    }
  })
  const defaultMapState = () => ({})
  const defaultMapDispatch = dispatch => ({
    dispatch
  })

  Vue.prototype.$connect = function(mapState = defaultMapState, mapDispatch = defaultMapDispatch) {
    const vm = this
    const __store__ = this.$store
    const getMappedState = (state = __store__.getState()) => mapState(state)

    const actions = wrapActionCreators(mapDispatch)(__store__.dispatch)
    Object.keys(actions).forEach(key => {
      vm[key] = actions[key]
    })

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
        if (vm[key] === undefined) {
          console.warn(`[revux] - you forgot to declare property **${key}** in your component's data function making it unreactive`)
        }

        vm.$set(vm, key, newState[key])
      })
    })
  }

  Object.defineProperty(Vue.prototype, '$store', {
    get: function $store() {
      let store
      let source = this

      while (source) {
        if (source._provided && source._provided.$$store) {
          store = source._provided.$$store
          break
        }
        source = source.$parent
      }

      if (!store) {
        throw new Error('[revux] - No store provided to root component')
      } else {
        return store
      }
    }
  })

   Vue.component('Provider', Provider)
}
