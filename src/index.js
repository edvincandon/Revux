import { extendVue } from './extend'

const isDev = process.env.NODE_ENV !== 'production'

export default class Revue {
  constructor(reduxStore, options) {
    if (!options.component) {
      throw new Error('[revue2] - You must provide an entry point component')
    }

    this.store = reduxStore
    this.subscribe = this.subscribe.bind(this)

    const revueInstance = this

    this.Provider = {
      render: h => h(options.component),
      data: function() {
        return Object.assign({}, {
          store: revueInstance
        }, options.data)
      }
    }
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
