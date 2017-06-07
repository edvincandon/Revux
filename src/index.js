import { extendVue } from './extend'

const isDev = process.env.NODE_ENV !== 'production'

export default class Revue {
  constructor(reduxStore, reduxActions, options) {
    if (!options.component) {
      throw new Error('[revue2] - You must provide an entry point component')
    }

    this.store = reduxStore
    this.subscribe = this.subscribe.bind(this)
    if (reduxActions) {
      this.reduxActions = reduxActions
    }

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
  get state() {
    return this.store.getState()
  }
  get actions() {
    if (isDev && !this.reduxActions) {
      throw new Error('[revue2] - Binding actions to Revue before calling them!')
    }
    return this.reduxActions
  }
  dispatch(...args) {
    return this.store.dispatch(...args)
  }
}

Revue.install = (_Vue) =>	{ extendVue(_Vue) }

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(RevueInstaller)
}
