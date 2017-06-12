import { expect } from 'chai'
import Vue from 'vue/dist/vue.common'
import connector from '../src/connector'
import store from './mocks/store'


describe('Connector', () => {
  let injected

  beforeEach(() => {
    injected = null
  })

  it('should inject store from parent Provider', () => {
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
})
