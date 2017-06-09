import install from './install'

const isDev = process.env.NODE_ENV !== 'production'

const Vuedux = {
  install(_vue) {
    install(_vue)
  }
}

export default Vuedux

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vuedux)
}
