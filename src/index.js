import { extendVue } from './extend'

const isDev = process.env.NODE_ENV !== 'production'

export default class Revue {
  constructor(reduxStore) {
    this.store = reduxStore
    this.subscribe = this.subscribe.bind(this)
  }
  subscribe(cb) {
    this.store.subscribe(cb)
  }
	get dispatch() {
		return this.store.dispatch
	}
  get state() {
    return this.store.getState()
  }
}

Revue.install = (_Vue) =>	{ extendVue(_Vue) }

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(RevueInstaller)
}
