import install from './install'

const isDev = process.env.NODE_ENV !== 'production'

export default {
  install(_vue) {
    install(_vue)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Revue)
}
