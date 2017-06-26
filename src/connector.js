import {
  shallowEqual,
  wrapActionCreators
} from './utils/index'

const defaultMapState = () => ({})
const defaultMapDispatch = {}

const connector = (mapState = defaultMapState, mapDispatch = defaultMapDispatch) => component => {
  return {
    name: `connect-${component.name}`,
    mixins: [component],
    inject: ['$$store'],

    data () {
      const initData = {}

      const mapData = {
        ...mapState(this.$$store.getState()),
        ...wrapActionCreators(mapDispatch)(this.$$store.dispatch)
      }

      Object.keys(mapData).forEach(key => {
        initData[key] = mapData[key]
      })

      return initData
    },

    created () {
      const vm = this
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
