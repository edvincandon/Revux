import install from './install'

const isDev = process.env.NODE_ENV !== 'production'

const revux = {
  install(_vue) {
    install(_vue)
  }
}

export default revux

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(revux)
}
