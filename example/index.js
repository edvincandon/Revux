import Vue from 'vue'
import Revue from 'revue2'
import store from './store'
import * as actions from './actions'
import main from './component.vue'

window.Vue = Vue;
// make sure Vue is in global scope

const { Provider } = new Revue(store, actions, {
  component: main,
});

const app = new Vue(Provider).$mount('#target');
