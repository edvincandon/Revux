import { expect, assert } from 'chai'
import sinon from 'sinon'
import Vue from 'vue/dist/vue.common'
import connector from '../src/connector'
import store from './mocks/store'

describe('Connector', () => {
  it('should inject store from parent Provider', () => {
    let injected

    const connectedComponent = connector()({
      created () {
        injected = this.$$store
      },
      render () {}
    })

    new Vue({
      template: `<connected />`,
      provide: {
        $$store: store
      },
      components: {
        connected: {
          template: `<connected-component/>`,
          components: {
            connectedComponent
          }
        }
      }
    }).$mount()

    expect(injected).to.deep.eql(store)
  })

  it('should provide redux dispatch method on connected instance if no mapDispatch param to connector', () => {
    let vm, injected

    const connectedComponent = connector()({
      created () {
        vm = this
        injected = this.$$store
      },
      render () {}
    })

    new Vue({
      template: `<connected />`,
      provide: {
        $$store: store
      },
      components: {
        connected: {
          template: `<connected-component/>`,
          components: {
            connectedComponent
          }
        }
      }
    }).$mount()

    expect(injected).to.deep.eql(store)
    //expect(vm.dispatch()).t
  })

  it('should map state to data on connected component', () => {
    let data
    const currentState = store.getState()

    const baseComponent = {
      created () {
        data = this.$data
      },
      render () {}
    }

    const mapState = state => {
      const { foo, bar } = state.test
      return {
        foo,
        bar
      }
    }

    new Vue({
      template: `<connected />`,
      provide: {
        $$store: store
      },
      components: {
        connected: {
          template: `<connected-component/>`,
          components: {
            connectedComponent: connector(mapState)(baseComponent)
          }
        }
      }
    }).$mount()

    expect(data).to.have.keys('foo', 'bar')
    expect(data.foo).to.eql(currentState.test.foo)
    expect(data.bar).to.deep.eql(currentState.test.bar)

  })

  it('should map actions to data on connected component', () => {
    let actions, vm

    const baseComponent = {
      created () {
        actions = this.$data
        vm = this
      },
      render () {}
    }

    const mapActions = {
      doThis: () => ({type: 'DO_THIS'})
    }

    new Vue({
      template: `<connected />`,
      provide: {
        $$store: store
      },
      components: {
        connected: {
          template: `<connected-component/>`,
          components: {
            connectedComponent: connector(() => ({}), mapActions)(baseComponent)
          }
        }
      }
    }).$mount()

    expect(actions).to.have.keys('doThis')
    expect(vm.doThis()).to.deep.eql({type: 'DO_THIS'})

  })

  it('should override and use mapDispatch value if the same key is defined both in mapState and mapDispatch', () => {
    let vm
    const baseComponent = {
      created () {
        vm = this
      },
      render () {}
    }

    const mapState = state => {
      const { foo } = state.test
      return {
        foo
      }
    }

    const mapActions = {
      foo: () => ({ type: 'DO_MAGIC' })
    }

    new Vue({
      template: `<connected />`,
      provide: {
        $$store: store
      },
      components: {
        connected: {
          template: `<connected-component/>`,
          components: {
            connectedComponent: connector(mapState, mapActions)(baseComponent)
          }
        }
      }
    }).$mount()

    expect(vm.foo()).to.deep.eql({ type: 'DO_MAGIC' })
  })

  it('should update connected component data on store change', () => {
    let vm
    const baseComponent = {
      created () {
        vm = this
      },
      render () {}
    }

    const mapState = state => {
      const { foo } = state.test
      return {
        foo
      }
    }

    new Vue({
      template: `<connected />`,
      provide: {
        $$store: store
      },
      components: {
        connected: {
          template: `<connected-component/>`,
          components: {
            connectedComponent: connector(mapState)(baseComponent)
          }
        }
      }
    }).$mount()

    const expected = 'bar'
    store.dispatch({ type: 'ACTION_FOO', payload: expected })
    expect(vm.foo).to.eql(expected)
  })

  it('should unsubscribe on component destroy', () => {
    let vm
    const baseComponent = {
      created () {
        vm = this
      },
      render () {}
    }

    new Vue({
      template: `<connected />`,
      provide: {
        $$store: store
      },
      components: {
        connected: {
          template: `<connected-component/>`,
          components: {
            connectedComponent: connector()(baseComponent)
          }
        }
      }
    }).$mount()

    vm._unsubscribe = sinon.spy()
    vm.$destroy()
    assert(vm._unsubscribe.called)
  })
})
