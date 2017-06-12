import {
  shallowEqual,
  wrapActionCreators
} from './utils/index'
import Provider from './components/Provider'

export default function install(Vue) {
   Vue.component('Provider', Provider)
}
