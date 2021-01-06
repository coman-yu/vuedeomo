import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import request from './utils/request'
import echarts from 'echarts'
import('./utils/formatTime')
Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.prototype.$echarts = echarts;
  
Vue.use(ElementUI) //全局使用ElementUI
new Vue({
  router,
  store,
  render: h => h(App),
  data:{
    eventBus:new Vue()
  }
}).$mount('#app')
