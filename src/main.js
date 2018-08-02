import Vue from 'vue'
import App from './App'
import router from './router'
import VueLocalStorage from 'vue-ls';
Vue.config.productionTip = false
Vue.use(VueLocalStorage);

/*
* element UI
* */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

/*
*bootstrap 3.3
* */
import 'bootstrap/dist/css/bootstrap.min.css'


router.beforeEach((to, from, next) => {
  next()
});

router.afterEach(() => {
  console.log('afterEach..');
});

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
