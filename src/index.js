import install from './install'
import connector from './connector'

const isDev = process.env.NODE_ENV !== 'production'

const revux = {
  install(_vue) {
    install(_vue)
  }
}

export default revux
export const connect = connector

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(revux)
}
