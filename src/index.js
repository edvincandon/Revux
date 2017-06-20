import install from './install'
import connector from './connector'
import Provider from './components/Provider'

const isDev = process.env.NODE_ENV !== 'production'

const revux = {
  install(_vue) {
    install(_vue)
  }
}

export default revux
export const connect = connector
export const provider = Provider
