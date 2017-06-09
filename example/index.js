import Vue from 'vue/dist/vue.esm.js'
import Vuedux from '../src/index'
import VueRouter from 'vue-router'
import store from './store'
import Home from './views/home.vue'
import App from './app.vue'

Vue.use(Vuedux)
Vue.use(VueRouter)

const router = new VueRouter({
	routes: [
		{path: '/', component: Home}
	]
})

const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
