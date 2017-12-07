import { expect, assert } from 'chai'
import sinon from 'sinon'
import Vue from 'vue/dist/vue.common'
import connector from '../src/connector'
import store from './mocks/store'
import 'babel-polyfill';

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
  })
  describe('mapState', () => {
    it('should map state to data if mapState is a function', () => {
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
    it('should map state to data if mapState is an object', () => {
      let data
      const currentState = store.getState()

      const baseComponent = {
        created () {
          data = this.$data
        },
        render () {}
      }

      const mapState = {
          foo: state => state.test.foo,
          bar: state => state.test.bar
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

    it('should throw if mapState is neither object or function', () => {
      const baseComponent = {}
      const mapState = 'MAKE_IT_CRASH'
      expect(() => connector(mapState)(baseComponent)).to.throw()
    })
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

  describe('events mapping', () => {
    let dispatchStub
    const originalDispatch = store.dispatch
    beforeEach(() => {
      dispatchStub = sinon.stub().returns()
      store.dispatch = dispatchStub
    })

    afterEach(() => {
      store.dispatch = originalDispatch
    })

    it('should map actions on events on connected component', () => {
      let vm
      let actionCreator = sinon.stub().returns({type: 'DO_THIS'});

      const baseComponent = {
        created () {
          vm = this
        },
        render () {}
      }

      const mapEvents = {
        eventName: actionCreator
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
              connectedComponent: connector(undefined, undefined, mapEvents)(baseComponent)
            }
          }
        }
      }).$mount()

      vm.$emit('eventName');

      expect(actionCreator.called, 'action creator was not called').to.be.true
      expect(store.dispatch.called, 'dispatch was not called').to.be.true
    })
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

    store.dispatch({ type: 'ACTION_FOO', payload: 'bar' })
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

  it('should create new name for connected component', () => {
      let vm
      const baseComponent = {
        name: 'test',
        created () {
          vm = this
        },
        render () {}
      }

      vm = connector()(baseComponent)
      expect(vm.name).to.eql('connect-test')
  })
})
