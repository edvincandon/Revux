import { expect, assert } from 'chai'
import sinon from 'sinon'
import Vue from 'vue/dist/vue.common'
import revux from '../src/index'
import Provider from '../src/components/Provider'
import store from './mocks/store'

Vue.use(revux)
const ProviderTest = Vue.extend(Provider)

describe('Provider', () => {
  let vm;

  it('should throw when store is not a valid redux store', () => {
    vm = () => new ProviderTest({
      propsData: {
        store: {foo: 'bar'}
      }
    });
    expect(vm).to.throw();
  })

  it('should not throw when valid redux store is provided', () => {
    vm = () => new ProviderTest({
      propsData: {
        store
      }
    });
    expect(vm).to.not.throw();
  })

  it('should provide store to children components', () => {
    vm = new ProviderTest({
      propsData: {
        store
      }
    });
    expect(Provider.provide()).to.have.keys("$$store")
    expect(vm._provided.$$store).to.deep.eql(store)
  })

  it('should render $slots correctly if Provider has single child', () => {
    const testCreated = sinon.stub()

    new Vue({
      template: `<Provider :store="store"><test></test></Provider>`,
      data() {
        return {
          store
        }
      },
      components: {
        test: {
          render: () => {},
          created: testCreated
        }
      }
    }).$mount()
    assert(testCreated.called)
  })

  it('should render $slots correctly if Provider has multiple children', () => {
    const fooCreated = sinon.stub()
    const barCreated = sinon.stub()

    new Vue({
      template: `<Provider :store="store"><foo /><bar /></Provider>`,
      data() {
        return {
          store
        }
      },
      components: {
        foo: {
          render: () => {},
          created: fooCreated
        },
        bar: {
          render: () => {},
          created: barCreated
        }
      }
    }).$mount()
    assert(fooCreated.called)
    assert(barCreated.called)
  })
})
