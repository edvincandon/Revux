export default {
  name: 'Provider',
  props: {
    store: {
      type: Object,
      validator: function (store) {
        if (!store.dispatch && !store.subscribe && !store.getState) {
          throw new Error('[revux] - store provided is not a valid redux store')
        }
        return true
      }
    }
  },
  provide () {
    return {
      $$store: this.store
    }
  },
  render(h) {
    if (!this.store) {
      throw new Error('[revux] - you must provide a store to Provider')
    }
    return h('div', this.$slots.default)
  }
}
