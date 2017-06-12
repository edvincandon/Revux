import { expect } from 'chai'
import Vue from 'vue'
import Provider from '../src/components/Provider'
import store from './mocks/store'

const ProviderTest = Vue.extend(Provider)

describe('Provider', () => {
  let vm;

  it('should throw when no store provided', () => {
    vm = new ProviderTest()
    expect(vm.$mount).to.throw();
  })

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
})
