import Vue from 'vue'
import App from './App.vue'
import components from './index'
import './assets/styles.css'

// 注册所有组件
Vue.use(components)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app') 