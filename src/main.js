import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor /* { default global options } */)

Vue.config.productionTip = false

// 时间处理过滤器
Vue.filter('time', function (value) {
  return moment((value * 1000)).format('YYYY年MM月DD日HH:mm:ss')
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前带上token
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  // 每次相应的时候都看一下token的状态是否过期 过期重新登录
  if (response.meta.status === 401) {
    router.push('/login')
    response.meta.msg = '亲，您的登录状态已过期，请重新登录'
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 使用elementui插件
Vue.use(ElementUI)
// 设置全局的根路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 把axios挂载到vue原型上
Vue.prototype.$axios = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
