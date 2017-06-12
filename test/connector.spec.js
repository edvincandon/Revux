import { expect } from 'chai'
import Vue from 'vue/dist/vue.common'
import connector from '../src/connector'


describe('Connector', () => {
  let injected
  const injectedComp = {
    inject: ['foo', 'bar'],
    render () {},
    created () {
      console.log(this.foo, this.bar)
      injected = [this.foo, this.bar]
    }
  }

  beforeEach(() => {
    injected = null
  })

  it('should work', () => {
    new Vue({
      template: `<child/>`,
      provide: {
        foo: 1,
        bar: false
      },
      components: {
        child: {
          template: `<injected-comp/>`,
          components: {
            injectedComp
          }
        }
      }
    }).$mount()
  })
})
