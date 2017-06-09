import {
  shallowEqual,
  wrapActionCreators
} from './utils/index'
import Provider from './components/Provider'
/**
 * Extend Vue prototype + global mixin
 *
 * @param {Vue} Vue
 */

export default function install(Vue) {
   Vue.component('Provider', Provider)
}
