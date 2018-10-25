export const createProvider = (storeKey = '$$store') => {
  return ({
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
          [storeKey]: this.store
        }
      },
      render(h) {
        if (this.$slots.default.length > 1) {
          return h('div', this.$slots.default)
        }
        return this.$slots.default[0]
      }
  })
}

export default createProvider()
