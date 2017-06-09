export default {
  name: 'Provider',
  functional: true,
  props: {
    store: Object
  },
  render (createElement, context) {
    // create wrapper provider for store
    const wrapper = {
      provide () {
        return {
          $$store: context.props.store
        }
      },
      render (h) {
        return h('div', this.$slots.default)
      }
    }
    return createElement(
      wrapper,
      context.data,
      context.children
    )
  }
}
