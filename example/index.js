import Vue from 'vue/dist/vue.esm.js'
import Revue from '../src/index'
import VueRouter from 'vue-router'
import store from './store'
import Home from './views/home.vue'
import App from './app.vue'

Vue.use(Revue)
Vue.use(VueRouter)

if (__DEV__) {
  window.Vue = Vue
}

const router = new VueRouter({
	routes: [
		{path: '/', component: Home}
	]
})

const app = new Vue({
  router,
  render: h => h(App),
  data: function () {
    return {
      store: new Revue(store, {})
    }
  }
}).$mount('#app');
