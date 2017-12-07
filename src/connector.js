import { bindActionCreators } from 'redux'

import {
  shallowEqual,
} from './utils/index'

const defaultMapState = () => ({})
const defaultMapDispatch = {}
const defaultEventDispatch = {}

const forEach = (obj, iterator) => Object.keys(obj).forEach(key => iterator(key, obj[key]))

const normalizeMapState = mapState => {
  if (typeof mapState === 'function') {
    return mapState
  } else if (mapState === Object(mapState)) {
    return state => {
      const mapped = {}
      Object.keys(mapState)
        .filter(key => typeof mapState[key] === 'function')
        .forEach(key => {
          mapped[key] = mapState[key](state)
        })
      return mapped
    }
  } else {
    throw new Error('[revux] - mapState provided to connect is invalid')
  }
}

const connector = (_mapState = defaultMapState, mapDispatch = defaultMapDispatch, eventDispatch = defaultEventDispatch) => component => {
  const mapState = normalizeMapState(_mapState);
  return {
    name: `connect-${component.name}`,
    mixins: [component],
    inject: ['$$store'],

    data () {
      const initData = {}
      const mapData = {
        ...mapState(this.$$store.getState()),
        ...bindActionCreators(mapDispatch, this.$$store.dispatch)
      }

      Object.keys(mapData).forEach(key => {
        initData[key] = mapData[key]
      })

      return initData
    },

    created () {
      const vm = this

      forEach(
        bindActionCreators(eventDispatch, this.$$store.dispatch),
        (eventName, dispatcher) => vm.$on(eventName, dispatcher)
      )

      const getMappedState = state => mapState(state)

      const observeStore = (store, select, onChange) => {
        let currentState = select(store.getState())

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

      this._unsubscribe = observeStore(this.$$store, getMappedState, (newState, oldState) => {
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
