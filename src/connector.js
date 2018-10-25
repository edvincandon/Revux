import {
  shallowEqual,
  bindActionCreators
} from './utils/index'

const defaultMapState = () => ({})
const defaultMapDispatch = {}

const normalizeMapState = mapState => {
  if (typeof mapState === 'function') return mapState

  if (mapState === Object(mapState)) {
    return (state, ownProps) => Object.keys(mapState)
      .filter(key => typeof mapState[key] === 'function')
      .reduce((map, key) => ({ ...map, [key]: mapState[key](state, ownProps) }), {})
  }

  throw new Error('[revux] - mapState provided to connect is invalid')
}

const connector = (_mapState = defaultMapState, mapDispatch = defaultMapDispatch, options = {}) => component => {
  const storeKey = options.storeKey || '$$store'
  const mapState = normalizeMapState(_mapState)

  return {
    name: `connect-${component.name}`,
    mixins: [component],
    inject: [storeKey],

    data () {
      const merged = {
        ...mapState(this[storeKey].getState(), this.$props || {}),
        ...bindActionCreators(mapDispatch, this[storeKey].dispatch)
      }

      return Object.keys(merged)
        .reduce((data, key) => ({ ...data, [key]: merged[key] }), {})
    },

    created () {
      const getMappedState = state => mapState(state, this.$props || {})

      const observeStore = (store, select, onChange) => {
        let currentState = select(store.getState())

        return store.subscribe(() => {
          const nextState = select(store.getState())
          if (!shallowEqual(currentState, nextState)) {
            const previousState = currentState
            currentState = nextState
            onChange(currentState, previousState)
          }
        })
      }

      this._unsubscribe = observeStore(this[storeKey], getMappedState, (newState, oldState) => {
        Object.keys(newState).forEach(key => {
          this.$set(this, key, newState[key])
        })
      })
    },

    beforeDestroy() {
      this._unsubscribe()
    }
  }
}

export default connector
