import Vue from 'vue/dist/vue.esm.js'
import revux from '../src/index'
import VueRouter from 'vue-router'
import store from './store'
import Home from './views/home.vue'
import App from './app.vue'

Vue.use(revux)
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
