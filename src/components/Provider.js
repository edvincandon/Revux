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
      template: '<div><slot></slot></div>'
    }
    return createElement(
      wrapper,
      context.data,
      context.children
    )
  }
}
