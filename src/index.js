/**
* Revux
* Edvin CANDON <edvincandon@gmail.com>
*/

import install from './install'
import connector from './connector'
import Provider from './components/Provider'

const revux = {
  install(_vue) {
    install(_vue)
  }
}

export default revux
export const connect = connector
export const provider = Provider
