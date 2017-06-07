import Vue from 'vue/dist/vue.esm.js'
import Revue from '../src/index'
import VueRouter from 'vue-router'
import store from './store'
import Home from './component/home.vue'
import App from './app.vue';

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

// const { Provider } = new Revue(store, {
//   component: App
// });

const app = new Vue({
  router,
  render: h => h(App),
  data: function () {
    return {
      store: new Revue(store, {})
    }
  }
}).$mount('#app');

console.log(app);
