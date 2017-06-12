export default {
  name: 'Provider',
  props: {
    store: {
      type: Object,
      required: true,
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
    return h('div', this.$slots.default)
  }
}
